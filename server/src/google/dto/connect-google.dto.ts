import { IsNotEmpty, IsString } from 'class-validator';

export class ConnectGoogleDto {
  @IsNotEmpty({ message: 'Authorization code is required' })
  @IsString()
  code: string;
}
