import { IsBoolean, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

/** Supported interface languages. Extend alongside the client's select options. */
export const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'bn'] as const;

/** Supported theme modes; `system` follows the OS preference. */
export const SUPPORTED_THEMES = ['light', 'dark', 'system'] as const;

export class UpdateUserSettingsDto {
  @IsOptional()
  @IsIn(SUPPORTED_LANGUAGES)
  language?: string;

  @IsOptional()
  @IsIn(SUPPORTED_THEMES)
  theme?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  timezone?: string;

  @IsOptional()
  @IsBoolean()
  emailAlerts?: boolean;

  @IsOptional()
  @IsBoolean()
  pushAlerts?: boolean;

  @IsOptional()
  @IsBoolean()
  weeklyDigest?: boolean;

  @IsOptional()
  @IsBoolean()
  marketingEmails?: boolean;
}
