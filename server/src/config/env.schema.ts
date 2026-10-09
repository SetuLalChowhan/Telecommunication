export function parseTrustedOrigins(raw?: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);
}

export function validateEnv(config: Record<string, unknown> = process.env) {
  return config;
}
