import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { google } from 'googleapis';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class GoogleService {
  private readonly logger = new Logger(GoogleService.name);

  private readonly clientId = process.env.GOOGLE_CLIENT_ID || '';
  private readonly clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
  private readonly redirectUri =
    process.env.GOOGLE_CALENDAR_REDIRECT_URI ||
    process.env.GOOGLE_REDIRECT_URI ||
    'http://localhost:3000/api/google/callback';

  constructor(private readonly prisma: PrismaService) {}

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
  async handleOAuthCallback(code: string, userId: string) {
    if (!this.clientId || !this.clientSecret) {
      throw new BadRequestException(
        'Google OAuth client credentials are not configured on the server',
      );
    }

    const oauth2Client = this.getOAuth2Client();

    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const userInfo = await oauth2.userinfo.get();
      const googleAccountId = userInfo.data.id || userId;

      const expiresAt = tokens.expiry_date
        ? new Date(tokens.expiry_date)
        : null;

      const existing = await this.prisma.account.findFirst({
        where: { userId, providerId: 'google' },
      });

      if (existing) {
        await this.prisma.account.update({
          where: { id: existing.id },
          data: {
            accountId: googleAccountId,
            accessToken: tokens.access_token || existing.accessToken,
            refreshToken: tokens.refresh_token || existing.refreshToken,
            accessTokenExpiresAt: expiresAt,
            scope: tokens.scope || existing.scope,
          },
        });
      } else {
        await this.prisma.account.create({
          data: {
            userId,
            providerId: 'google',
            accountId: googleAccountId,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            accessTokenExpiresAt: expiresAt,
            scope: tokens.scope,
          },
        });
      }

      return {
        success: true,
        message: 'Google Calendar & Meet successfully connected',
      };
    } catch (error) {
      this.logger.error('Failed to exchange Google authorization code:', error);
      throw new BadRequestException('Failed to exchange authorization code with Google');
    }
  }

  /**
   * Authenticates an OAuth2 client with doctor's saved tokens
   */
  private async getAuthenticatedClient(userId: string) {
    const account = await this.prisma.account.findFirst({
      where: { userId, providerId: 'google' },
    });

    if (!account || !account.refreshToken) {
      return null;
    }

    const oauth2Client = this.getOAuth2Client();
    oauth2Client.setCredentials({
      access_token: account.accessToken || undefined,
      refresh_token: account.refreshToken,
      expiry_date: account.accessTokenExpiresAt
        ? account.accessTokenExpiresAt.getTime()
        : undefined,
    });

    // Handle automatic token refresh events to keep DB in sync
    oauth2Client.on('tokens', async (tokens) => {
      try {
        await this.prisma.account.update({
          where: { id: account.id },
          data: {
            accessToken: tokens.access_token || account.accessToken,
            refreshToken: tokens.refresh_token || account.refreshToken,
            accessTokenExpiresAt: tokens.expiry_date
              ? new Date(tokens.expiry_date)
              : account.accessTokenExpiresAt,
          },
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
          attendees: [{ email: patientEmail }],
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

      return {
        meetLink,
        googleEventId: event.data.id || undefined,
      };
    } catch (error) {
      this.logger.error('Error creating Google Calendar Meet event:', error);
      const fallbackMeetLink = `https://meet.google.com/tele-${bookingId.slice(-8)}`;
      return { meetLink: fallbackMeetLink };
    }
  }

  /**
   * Check connection status
   */
  async getConnectionStatus(userId: string) {
    const account = await this.prisma.account.findFirst({
      where: { userId, providerId: 'google' },
    });

    return {
      isConnected: Boolean(account && account.refreshToken),
      connectedAt: account?.createdAt || null,
    };
  }

  /**
   * Disconnect Google Calendar
   */
  async disconnect(userId: string) {
    await this.prisma.account.deleteMany({
      where: { userId, providerId: 'google' },
    });

    return { message: 'Google account disconnected successfully' };
  }
}
