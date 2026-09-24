import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GoogleService } from './google.service.js';
import { BadRequestException } from '@nestjs/common';

describe('GoogleService', () => {
  let service: GoogleService;
  let mockRepo: any;
  let mockConfigService: any;

  beforeEach(() => {
    mockRepo = {
      createOAuthState: vi.fn().mockResolvedValue({ id: 'ver-1' }),
      findAndConsumeOAuthState: vi.fn(),
      findAccountByGoogleId: vi.fn(),
      findAccountByUserIdAndProvider: vi.fn(),
      findFirstAccountForUser: vi.fn(),
      createAccount: vi.fn().mockResolvedValue({ id: 'acc-1' }),
      updateAccount: vi.fn().mockResolvedValue({ id: 'acc-1' }),
      deleteAccountsForUser: vi.fn().mockResolvedValue({ count: 1 }),
    };

    mockConfigService = {
      get: vi.fn((key: string) => {
        if (key === 'GOOGLE_CLIENT_ID') return 'mock-client-id';
        if (key === 'GOOGLE_CLIENT_SECRET') return 'mock-client-secret';
        if (key === 'GOOGLE_CALENDAR_REDIRECT_URI') return 'http://localhost:3000/api/google/callback';
        return null;
      }),
    };

    service = new GoogleService(mockRepo, mockConfigService);
  });

  describe('getAuthUrl', () => {
    it('generates a consent URL with a secure random state and stores it', async () => {
      const result = await service.getAuthUrl('user-123');

      expect(result.url).toBeDefined();
      expect(result.state).toBeDefined();
      expect(typeof result.state).toBe('string');
      expect(mockRepo.createOAuthState).toHaveBeenCalledWith(
        result.state,
        'user-123',
        expect.any(Date),
      );
    });

    it('throws BadRequestException if OAuth credentials are not configured', async () => {
      mockConfigService.get.mockReturnValue('');

      await expect(service.getAuthUrl('user-123')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('handleOAuthCallback state validation', () => {
    it('throws BadRequestException when state is invalid or expired', async () => {
      mockRepo.findAndConsumeOAuthState.mockResolvedValue(null);

      await expect(
        service.handleOAuthCallback('mock-code', 'user-123', 'invalid-state'),
      ).rejects.toThrow('Invalid or expired OAuth state parameter');
    });

    it('throws BadRequestException when state belongs to a different user', async () => {
      mockRepo.findAndConsumeOAuthState.mockResolvedValue({
        value: 'different-user',
        expiresAt: new Date(Date.now() + 60000),
      });

      await expect(
        service.handleOAuthCallback('mock-code', 'user-123', 'valid-state'),
      ).rejects.toThrow('Invalid or expired OAuth state parameter');
    });
  });

  describe('createMeetingEvent', () => {
    it('returns null meetLink and googleEventId when doctor has not connected Google Calendar', async () => {
      mockRepo.findFirstAccountForUser.mockResolvedValue(null);

      const result = await service.createMeetingEvent({
        doctorUserId: 'doc-user-1',
        patientEmail: 'patient@example.com',
        slotStart: new Date(),
        slotEnd: new Date(),
        bookingId: 'booking-999',
      });

      expect(result).toEqual({
        meetLink: null,
        googleEventId: null,
      });
    });
  });

  describe('getConnectionStatus', () => {
    it('returns false when no account exists', async () => {
      mockRepo.findFirstAccountForUser.mockResolvedValue(null);

      const status = await service.getConnectionStatus('user-123');
      expect(status.isConnected).toBe(false);
      expect(status.connectedAt).toBeNull();
    });

    it('returns true when account with tokens exists', async () => {
      const now = new Date();
      mockRepo.findFirstAccountForUser.mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        createdAt: now,
      });

      const status = await service.getConnectionStatus('user-123');
      expect(status.isConnected).toBe(true);
      expect(status.connectedAt).toEqual(now);
    });
  });

  describe('disconnect', () => {
    it('deletes calendar accounts for user', async () => {
      const result = await service.disconnect('user-123');

      expect(mockRepo.deleteAccountsForUser).toHaveBeenCalledWith(
        'user-123',
        ['google-calendar', 'google'],
      );
      expect(result.message).toBe('Google account disconnected successfully');
    });
  });
});
