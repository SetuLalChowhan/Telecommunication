import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { google } from 'googleapis';
import { GoogleRepository } from './google.repository.js';

const GOOGLE_CALENDAR_PROVIDER = 'google-calendar';

@Injectable()
export class GoogleService {
  private readonly logger = new Logger(GoogleService.name);

  private readonly clientId = process.env.GOOGLE_CLIENT_ID || '';
  private readonly clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
  private readonly redirectUri =
    process.env.GOOGLE_CALENDAR_REDIRECT_URI ||
    process.env.GOOGLE_REDIRECT_URI ||
    'http://localhost:3000/api/google/callback';

  constructor(private readonly repo: GoogleRepository) {}

  /**
   * Creates an OAuth2 client instance
   */
  private getOAuth2Client() {
    return new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.redirectUri,
    );
  }

  /**
   * Generates Google OAuth Consent URL with Google Calendar & Meet scopes
   */
  getAuthUrl(userId: string): { url: string } {
    const oauth2Client = this.getOAuth2Client();

    const scopes = [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes,
      state: userId,
    });

    return { url };
  }

  /**
   * Exchanges authorization code for tokens and saves Google account
   */
  async handleOAuthCallback(code: string, userId: string, redirectUri?: string) {
    if (!this.clientId || !this.clientSecret) {
      throw new BadRequestException(
        'Google OAuth client credentials are not configured on the server',
      );
    }

    let tokens;
    let oauth2Client: InstanceType<typeof google.auth.OAuth2> | null = null;

    // Prioritize postmessage (GIS code flow) or explicitly passed redirectUri, with fallback
    const candidateUris = Array.from(
      new Set(
        [redirectUri, 'postmessage', this.redirectUri].filter(
          Boolean,
        ) as string[],
      ),
    );

    let lastError: any = null;
    for (const uri of candidateUris) {
      try {
        const client = new google.auth.OAuth2(
          this.clientId,
          this.clientSecret,
          uri,
        );
        const res = await client.getToken(code);
        if (res.tokens) {
          tokens = res.tokens;
          oauth2Client = client;
          break;
        }
      } catch (err) {
        lastError = err;
      }
    }

    if (!tokens || !oauth2Client) {
      this.logger.error(
        'Failed to exchange Google authorization code with candidate redirect URIs:',
        lastError,
      );
      throw new BadRequestException(
        lastError?.response?.data?.error_description ||
          lastError?.message ||
          'Failed to exchange authorization code with Google',
      );
    }

    try {
      oauth2Client.setCredentials(tokens);

      let googleAccountId: string = userId;

      // Extract Google sub ID safely from id_token without external API dependency
      if (tokens.id_token) {
        try {
          const payloadBase64 = tokens.id_token.split('.')[1];
          if (payloadBase64) {
            const decoded = JSON.parse(
              Buffer.from(payloadBase64, 'base64').toString('utf8'),
            );
            if (decoded?.sub) {
              googleAccountId = String(decoded.sub);
            }
          }
        } catch (err) {
          this.logger.warn('Could not decode id_token sub, attempting userinfo API', err);
        }
      }

      if (googleAccountId === userId) {
        try {
          const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
          const userInfo = await oauth2.userinfo.get();
          if (userInfo?.data?.id) {
            googleAccountId = userInfo.data.id;
          }
        } catch (err) {
          this.logger.warn('Optional userInfo.get() call was skipped or failed:', err);
        }
      }

      const expiresAt = tokens.expiry_date
        ? new Date(tokens.expiry_date)
        : null;

      // 1. Check if a google-calendar integration account already exists with this Google account ID
      const existingByGoogleId = await this.repo.findAccountByGoogleId(
        GOOGLE_CALENDAR_PROVIDER,
        googleAccountId,
      );

      // 2. Check if the current doctor user already has a google-calendar integration account linked
      const existingByUser = await this.repo.findAccountByUserIdAndProvider(
        userId,
        GOOGLE_CALENDAR_PROVIDER,
      );

      if (
        existingByGoogleId &&
        existingByUser &&
        existingByGoogleId.id !== existingByUser.id
      ) {
        // If there are two separate rows, delete the old user row to prevent unique constraint conflicts
        await this.repo.deleteAccount(existingByUser.id);
      }

      const targetAccount = existingByGoogleId || existingByUser;

      if (targetAccount) {
        await this.repo.updateAccount(targetAccount.id, {
          user: { connect: { id: userId } },
          providerId: GOOGLE_CALENDAR_PROVIDER,
          accountId: googleAccountId,
          accessToken: tokens.access_token || targetAccount.accessToken,
          refreshToken: tokens.refresh_token || targetAccount.refreshToken,
          idToken: tokens.id_token || targetAccount.idToken,
          accessTokenExpiresAt: expiresAt || targetAccount.accessTokenExpiresAt,
          scope: tokens.scope || targetAccount.scope,
        });
      } else {
        await this.repo.createAccount({
          user: { connect: { id: userId } },
          providerId: GOOGLE_CALENDAR_PROVIDER,
          accountId: googleAccountId,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          idToken: tokens.id_token,
          accessTokenExpiresAt: expiresAt,
          scope: tokens.scope,
        });
      }

      return {
        success: true,
        message: 'Google Calendar & Meet successfully connected',
      };
    } catch (error: any) {
      this.logger.error(
        'Failed to save Google account credentials:',
        error?.stack || error?.message || error,
      );
      throw new BadRequestException(
        error?.message ||
          error?.response?.data?.error_description ||
          'Failed to process Google account information',
      );
    }
  }

  /**
   * Authenticates an OAuth2 client with doctor's saved tokens
   */
  private async getAuthenticatedClient(userId: string) {
    const account = await this.repo.findFirstAccountForUser(userId, [
      GOOGLE_CALENDAR_PROVIDER,
      'google',
    ]);

    if (!account || (!account.refreshToken && !account.accessToken)) {
      return null;
    }

    const oauth2Client = this.getOAuth2Client();
    oauth2Client.setCredentials({
      access_token: account.accessToken || undefined,
      refresh_token: account.refreshToken || undefined,
      expiry_date: account.accessTokenExpiresAt
        ? account.accessTokenExpiresAt.getTime()
        : undefined,
    });

    // Handle automatic token refresh events to keep DB in sync
    oauth2Client.on('tokens', async (tokens) => {
      try {
        await this.repo.updateAccount(account.id, {
          accessToken: tokens.access_token || account.accessToken,
          refreshToken: tokens.refresh_token || account.refreshToken,
          accessTokenExpiresAt: tokens.expiry_date
            ? new Date(tokens.expiry_date)
            : account.accessTokenExpiresAt,
        });
      } catch (err) {
        this.logger.warn('Failed to update refreshed tokens in DB:', err);
      }
    });

    return oauth2Client;
  }

  /**
   * Creates a Google Calendar event with Google Meet conference link
   */
  async createMeetingEvent(params: {
    doctorUserId: string;
    doctorName?: string | null;
    patientEmail: string;
    patientName?: string | null;
    slotStart: Date;
    slotEnd: Date;
    bookingId: string;
    notes?: string | null;
  }): Promise<{ meetLink: string; googleEventId?: string }> {
    const {
      doctorUserId,
      doctorName,
      patientEmail,
      patientName,
      slotStart,
      slotEnd,
      bookingId,
      notes,
    } = params;

    const oauth2Client = await this.getAuthenticatedClient(doctorUserId);

    if (!oauth2Client) {
      // Graceful fallback: return standard meeting link
      const fallbackMeetLink = `https://meet.google.com/tele-${bookingId.slice(-8)}`;
      this.logger.log(
        `Doctor Google account not connected. Using standard meet link: ${fallbackMeetLink}`,
      );
      return { meetLink: fallbackMeetLink };
    }

    try {
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      const event = await calendar.events.insert({
        calendarId: 'primary',
        conferenceDataVersion: 1,
        requestBody: {
          summary: `Consultation: Dr. ${doctorName || 'Doctor'} & ${patientName || 'Patient'}`,
          description: `Telemedicine video consultation.\nBooking ID: ${bookingId}\nNotes: ${notes || 'None'}`,
          start: {
            dateTime: slotStart.toISOString(),
          },
          end: {
            dateTime: slotEnd.toISOString(),
          },
          attendees: patientEmail?.trim()
            ? [{ email: patientEmail.trim() }]
            : undefined,
          conferenceData: {
            createRequest: {
              requestId: `tele-${bookingId}-${Date.now()}`,
              conferenceSolutionKey: {
                type: 'hangoutsMeet',
              },
            },
          },
        },
      });

      const meetLink =
        event.data.conferenceData?.entryPoints?.find(
          (ep) => ep.entryPointType === 'video',
        )?.uri ||
        event.data.hangoutLink ||
        `https://meet.google.com/tele-${bookingId.slice(-8)}`;

      this.logger.log(
        `Google Calendar event created successfully. Meet Link: ${meetLink} (Event ID: ${event.data.id})`,
      );

      return {
        meetLink,
        googleEventId: event.data.id || undefined,
      };
    } catch (error: any) {
      this.logger.error(
        'Error creating Google Calendar Meet event:',
        error?.response?.data || error?.message || error,
      );
      const fallbackMeetLink = `https://meet.google.com/tele-${bookingId.slice(-8)}`;
      return { meetLink: fallbackMeetLink };
    }
  }

  /**
   * Check connection status
   */
  async getConnectionStatus(userId: string) {
    const account = await this.repo.findFirstAccountForUser(userId, [
      GOOGLE_CALENDAR_PROVIDER,
      'google',
    ]);

    return {
      isConnected: Boolean(
        account && (account.refreshToken || account.accessToken),
      ),
      connectedAt: account?.createdAt || null,
    };
  }

  /**
   * Disconnect Google Calendar
   */
  async disconnect(userId: string) {
    await this.repo.deleteAccountsForUser(userId, [
      GOOGLE_CALENDAR_PROVIDER,
      'google',
    ]);

    return { message: 'Google account disconnected successfully' };
  }
}
