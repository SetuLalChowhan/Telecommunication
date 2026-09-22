import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { BlogsService } from './blogs.service.js';
import { BlogQueryDto } from './dto/blog-query.dto.js';
import { CreateBlogDto } from './dto/create-blog.dto.js';
import { UpdateBlogDto } from './dto/update-blog.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { ResponseMessage } from '../common/decorator/response-message.decorator.js';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  // --- Public Endpoints ---

  @Get()
  @AllowAnonymous()
  @ResponseMessage('Blog posts fetched successfully')
  listPublicBlogs(@Query() query: BlogQueryDto) {
    return this.blogsService.listPublicBlogs(query);
  }

  @Get('featured')
  @AllowAnonymous()
  @ResponseMessage('Featured blog posts fetched successfully')
  getFeaturedBlogs() {
    return this.blogsService.getFeaturedBlogs();
  }

  @Get('categories')
  @AllowAnonymous()
  @ResponseMessage('Blog categories fetched successfully')
  getBlogCategories() {
    return this.blogsService.getBlogCategories();
  }

  @Get(':slug')
  @AllowAnonymous()
  @ResponseMessage('Blog post details fetched successfully')
  getBlogBySlug(@Param('slug') slug: string) {
    return this.blogsService.getBlogBySlug(slug);
  }

  // --- Admin CMS Endpoints ---

  @Get('admin/all')
  @Roles('ADMIN', 'DOCTOR')
  @UseGuards(RolesGuard)
  @ResponseMessage('Admin blog posts fetched successfully')
  adminListBlogs(@Query() query: BlogQueryDto) {
    return this.blogsService.adminListBlogs(query);
  }

  @Post('admin/create')
  @Roles('ADMIN', 'DOCTOR')
  @UseGuards(RolesGuard)
  @ResponseMessage('Blog post created successfully')
  adminCreateBlog(@Body() dto: CreateBlogDto) {
    return this.blogsService.adminCreateBlog(dto);
  }

  @Patch('admin/:id')
  @Roles('ADMIN', 'DOCTOR')
  @UseGuards(RolesGuard)
  @ResponseMessage('Blog post updated successfully')
  adminUpdateBlog(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    return this.blogsService.adminUpdateBlog(id, dto);
  }

  @Delete('admin/:id')
  @Roles('ADMIN', 'DOCTOR')
  @UseGuards(RolesGuard)
  @ResponseMessage('Blog post deleted successfully')
  adminDeleteBlog(@Param('id') id: string) {
    return this.blogsService.adminDeleteBlog(id);
  }

  @Patch('admin/:id/toggle-publish')
  @Roles('ADMIN', 'DOCTOR')
  @UseGuards(RolesGuard)
  @ResponseMessage('Blog post publish status toggled successfully')
  adminTogglePublish(@Param('id') id: string) {
    return this.blogsService.adminTogglePublish(id);
  }
}
