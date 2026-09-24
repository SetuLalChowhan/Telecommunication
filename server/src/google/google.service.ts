import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { randomBytes } from 'crypto';
import { GoogleRepository } from './google.repository.js';

const GOOGLE_CALENDAR_PROVIDER = 'google-calendar';

@Injectable()
export class GoogleService {
  private readonly logger = new Logger(GoogleService.name);

  constructor(
    private readonly repo: GoogleRepository,
    private readonly configService: ConfigService,
  ) {}

  private get clientId(): string {
    return this.configService.get<string>('GOOGLE_CLIENT_ID') || '';
  }

  private get clientSecret(): string {
    return this.configService.get<string>('GOOGLE_CLIENT_SECRET') || '';
  }

  private get defaultRedirectUri(): string {
    return (
      this.configService.get<string>('GOOGLE_CALENDAR_REDIRECT_URI') ||
      this.configService.get<string>('GOOGLE_REDIRECT_URI') ||
      'http://localhost:3000/api/google/callback'
    );
  }

  /**
   * Creates an OAuth2 client instance with specified or default redirect URI
   */
  private getOAuth2Client(customRedirectUri?: string) {
    return new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      customRedirectUri || this.defaultRedirectUri,
    );
  }

  /**
   * Generates Google OAuth Consent URL with secure random state and Google Calendar scopes
   */
  async getAuthUrl(userId: string): Promise<{ url: string; state: string }> {
    if (!this.clientId || !this.clientSecret) {
      throw new BadRequestException(
        'Google OAuth client credentials are not configured on the server',
      );
    }

    const state = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    await this.repo.createOAuthState(state, userId, expiresAt);

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
      state,
    });

    return { url, state };
  }

  /**
   * Exchanges authorization code for tokens, verifies Google identity, and securely links account
   */
  async handleOAuthCallback(
    code: string,
    userId: string,
    state?: string,
    redirectUri?: string,
  ) {
    if (!this.clientId || !this.clientSecret) {
      throw new BadRequestException(
        'Google OAuth client credentials are not configured on the server',
      );
    }

    // 1. Verify OAuth State for CSRF protection and account linking safety
    if (state) {
      const record = await this.repo.findAndConsumeOAuthState(state);
      if (!record || record.value !== userId || record.expiresAt < new Date()) {
        throw new BadRequestException('Invalid or expired OAuth state parameter');
      }
    }

    const oauth2Client = this.getOAuth2Client(redirectUri);

    let tokens;
    try {
      const tokenResponse = await oauth2Client.getToken(code);
      tokens = tokenResponse.tokens;
    } catch (err: any) {
      this.logger.error(
        'Failed to exchange authorization code with Google:',
        err?.response?.data || err?.message || err,
      );
      throw new BadRequestException(
        err?.response?.data?.error_description ||
          'Failed to exchange authorization code with Google',
      );
    }

    if (!tokens || !tokens.access_token) {
      throw new BadRequestException('No access token received from Google');
    }

    try {
      oauth2Client.setCredentials(tokens);

      let googleAccountId: string | null = null;

      // 2. Cryptographically verify Google ID token signature and extract permanent sub identifier
      if (tokens.id_token) {
        try {
          const ticket = await oauth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: this.clientId,
          });
          const payload = ticket.getPayload();
          if (payload?.sub) {
            googleAccountId = payload.sub;
          }
        } catch (err) {
          this.logger.warn(
            'Failed to verify ID token signature, attempting userinfo API fallback:',
            err,
          );
        }
      }

      // Fallback to userinfo API if id_token verification was not possible
      if (!googleAccountId) {
        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const userInfo = await oauth2.userinfo.get();
        if (!userInfo?.data?.id) {
          throw new BadRequestException('Unable to verify Google account identity');
        }
        googleAccountId = userInfo.data.id;
      }

      // 3. Prevent account hijacking: Check if this Google account is already linked to another user
      const existingByGoogleId = await this.repo.findAccountByGoogleId(
        GOOGLE_CALENDAR_PROVIDER,
        googleAccountId,
      );

      if (existingByGoogleId && existingByGoogleId.userId !== userId) {
        throw new BadRequestException(
          'This Google account is already connected to another user account',
        );
      }

      // 4. Check if current user already has a linked google-calendar account
      const existingByUser = await this.repo.findAccountByUserIdAndProvider(
        userId,
        GOOGLE_CALENDAR_PROVIDER,
      );

      const expiresAt = tokens.expiry_date
        ? new Date(tokens.expiry_date)
        : null;

      if (existingByUser) {
        await this.repo.updateAccount(existingByUser.id, {
          accountId: googleAccountId,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token || existingByUser.refreshToken,
          idToken: tokens.id_token || existingByUser.idToken,
          accessTokenExpiresAt: expiresAt || existingByUser.accessTokenExpiresAt,
          scope: tokens.scope || existingByUser.scope,
        });
      } else if (existingByGoogleId) {
        await this.repo.updateAccount(existingByGoogleId.id, {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token || existingByGoogleId.refreshToken,
          idToken: tokens.id_token || existingByGoogleId.idToken,
          accessTokenExpiresAt: expiresAt || existingByGoogleId.accessTokenExpiresAt,
          scope: tokens.scope || existingByGoogleId.scope,
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
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(
        'Failed to save Google account credentials:',
        error?.stack || error?.message || error,
      );
      throw new BadRequestException(
        'Failed to process and link Google account',
      );
    }
  }

  /**
   * Authenticates an OAuth2 client with doctor's saved tokens and registers auto-refresh listener
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

    // Handle automatic token refresh events safely and preserve existing refresh token
    oauth2Client.on('tokens', async (newTokens) => {
      try {
        const currentAccount = await this.repo.findFirstAccountForUser(userId, [
          GOOGLE_CALENDAR_PROVIDER,
          'google',
        ]);
        if (currentAccount) {
          await this.repo.updateAccount(currentAccount.id, {
            accessToken: newTokens.access_token || currentAccount.accessToken,
            refreshToken: newTokens.refresh_token || currentAccount.refreshToken,
            accessTokenExpiresAt: newTokens.expiry_date
              ? new Date(newTokens.expiry_date)
              : currentAccount.accessTokenExpiresAt,
          });
        }
      } catch (err) {
        this.logger.warn('Failed to update refreshed Google tokens in database:', err);
      }
    });

    return oauth2Client;
  }

  /**
   * Creates a Google Calendar event with Google Meet conference link
   * Returns genuine meetLink if created, or null if Google is not connected/failed.
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
  }): Promise<{ meetLink: string | null; googleEventId?: string | null }> {
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
      this.logger.log(
        `Doctor (User: ${doctorUserId}) has not connected Google Calendar. Skipping Meet event creation.`,
      );
      return { meetLink: null, googleEventId: null };
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
              // Stable conference request ID to ensure idempotency on retries
              requestId: `tele-conf-${bookingId}`,
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
        null;

      this.logger.log(
        `Google Calendar event created successfully. Meet Link: ${meetLink} (Event ID: ${event.data.id})`,
      );

      return {
        meetLink,
        googleEventId: event.data.id || null,
      };
    } catch (error: any) {
      this.logger.error(
        `Error creating Google Calendar Meet event for booking ${bookingId}:`,
        error?.response?.data || error?.message || error,
      );
      return { meetLink: null, googleEventId: null };
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
