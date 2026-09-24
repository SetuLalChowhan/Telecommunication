import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ConnectGoogleDto {
  @IsNotEmpty({ message: 'Authorization code is required' })
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  redirectUri?: string;
}
