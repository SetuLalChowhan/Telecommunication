import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ReviewsService } from './reviews.service.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CurrentUser } from '../common/decorator/current-user.decorator.js';
import { ResponseMessage } from '../common/decorator/response-message.decorator.js';
import { PaginationDto } from '../common/pagination/pagination.dto.js';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @Roles('PATIENT')
  @UseGuards(RolesGuard)
  @ResponseMessage('Review submitted successfully')
  createReview(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(userId, dto);
  }

  @Get('doctor/:doctorId')
  @AllowAnonymous()
  @ResponseMessage('Doctor reviews fetched successfully')
  getDoctorReviews(
    @Param('doctorId') doctorId: string,
    @Query() query: PaginationDto,
  ) {
    return this.reviewsService.getDoctorReviews(doctorId, query);
  }

  @Get('my-reviews')
  @Roles('PATIENT')
  @UseGuards(RolesGuard)
  @ResponseMessage('My reviews fetched successfully')
  getMyReviews(
    @CurrentUser('id') userId: string,
    @Query() query: PaginationDto,
  ) {
    return this.reviewsService.getMyReviews(userId, query);
  }
}
