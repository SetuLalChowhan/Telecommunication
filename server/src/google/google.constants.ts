export const GOOGLE_CALENDAR_PROVIDER = 'google-calendar';
export const GOOGLE_OAUTH_SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
] as const;

export const OAUTH_STATE_EXPIRY_MINUTES = 10;
