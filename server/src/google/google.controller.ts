import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
} from '@nestjs/common';
import { GoogleService } from './google.service.js';
import { ConnectGoogleDto } from './dto/connect-google.dto.js';
import { CurrentUser } from '../common/decorator/current-user.decorator.js';
import { ResponseMessage } from '../common/decorator/response-message.decorator.js';

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get('auth-url')
  @ResponseMessage('Google OAuth consent URL generated')
  getAuthUrl(@CurrentUser('id') userId: string) {
    return this.googleService.getAuthUrl(userId);
  }

  @Post('connect')
  @ResponseMessage('Google Calendar connected successfully')
  connectGoogle(
    @CurrentUser('id') userId: string,
    @Body() dto: ConnectGoogleDto,
  ) {
    return this.googleService.handleOAuthCallback(dto.code, userId);
  }

  @Get('status')
  @ResponseMessage('Google connection status retrieved')
  getStatus(@CurrentUser('id') userId: string) {
    return this.googleService.getConnectionStatus(userId);
  }

  @Delete('disconnect')
  @ResponseMessage('Google account disconnected')
  disconnect(@CurrentUser('id') userId: string) {
    return this.googleService.disconnect(userId);
  }
}
