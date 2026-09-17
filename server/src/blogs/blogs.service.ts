import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { BlogQueryDto, BlogSortBy } from './dto/blog-query.dto.js';
import { CreateBlogDto } from './dto/create-blog.dto.js';
import { UpdateBlogDto } from './dto/update-blog.dto.js';
import {
  createPaginationMeta,
  getPaginationParams,
} from '../common/pagination/pagination.utils.js';

@Injectable()
export class BlogsService {
  constructor(private readonly prisma: PrismaService) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // --- Public APIs ---

  async listPublicBlogs(query: BlogQueryDto) {
    const { page = 1, limit = 10, search, category, sortBy = BlogSortBy.NEWEST } = query;
    const { skip, take } = getPaginationParams(page, limit);

    const where: Prisma.BlogPostWhereInput = {
      published: true,
    };

    if (search && search.trim() !== '') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { authorName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category && category !== 'All Articles') {
      where.category = { equals: category, mode: 'insensitive' };
    }

    let orderBy: Prisma.BlogPostOrderByWithRelationInput = { publishedAt: 'desc' };
    if (sortBy === BlogSortBy.OLDEST) {
      orderBy = { publishedAt: 'asc' };
    } else if (sortBy === BlogSortBy.POPULAR) {
      orderBy = { viewsCount: 'desc' };
    }

    const [items, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return {
      items,
      meta: createPaginationMeta(page, limit, total),
    };
  }

  async getFeaturedBlogs() {
    return this.prisma.blogPost.findMany({
      where: {
        published: true,
        featured: true,
      },
      take: 4,
      orderBy: { publishedAt: 'desc' },
    });
  }

  async getBlogBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post || !post.published) {
      throw new NotFoundException(`Blog post not found: ${slug}`);
    }

    // Increment views count
    await this.prisma.blogPost.update({
      where: { id: post.id },
      data: { viewsCount: { increment: 1 } },
    });

    // Fetch related articles
    const relatedPosts = await this.prisma.blogPost.findMany({
      where: {
        published: true,
        category: post.category,
        id: { not: post.id },
      },
      take: 3,
      orderBy: { publishedAt: 'desc' },
    });

    return {
      post,
      relatedPosts,
    };
  }

  async getBlogCategories() {
    const categories = await this.prisma.blogPost.groupBy({
      by: ['category'],
      where: { published: true },
      _count: { id: true },
    });

    return categories.map((c) => ({
      name: c.category,
      count: c._count.id,
    }));
  }

  // --- Admin CMS APIs ---

  async adminListBlogs(query: BlogQueryDto) {
    const { page = 1, limit = 10, search, category } = query;
    const { skip, take } = getPaginationParams(page, limit);

    const where: Prisma.BlogPostWhereInput = {};

    if (search && search.trim() !== '') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { authorName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }

    const [items, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return {
      items,
      meta: createPaginationMeta(page, limit, total),
    };
  }

  async adminCreateBlog(dto: CreateBlogDto) {
    const slug = dto.slug ? this.generateSlug(dto.slug) : this.generateSlug(dto.title);

    const existing = await this.prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new BadRequestException(`A blog post with slug '${slug}' already exists`);
    }

    const publishedAt = dto.published ? new Date() : null;

    return this.prisma.blogPost.create({
      data: {
        ...dto,
        slug,
        publishedAt,
      },
    });
  }

  async adminUpdateBlog(id: string, dto: UpdateBlogDto) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Blog post not found with ID: ${id}`);
    }

    let slug = post.slug;
    if (dto.slug && dto.slug !== post.slug) {
      slug = this.generateSlug(dto.slug);
      const existing = await this.prisma.blogPost.findUnique({
        where: { slug },
      });
      if (existing && existing.id !== id) {
        throw new BadRequestException(`A blog post with slug '${slug}' already exists`);
      }
    }

    let publishedAt = post.publishedAt;
    if (dto.published !== undefined) {
      if (dto.published && !post.published) {
        publishedAt = new Date();
      } else if (!dto.published) {
        publishedAt = null;
      }
    }

    return this.prisma.blogPost.update({
      where: { id },
      data: {
        ...dto,
        slug,
        publishedAt,
      },
    });
  }

  async adminDeleteBlog(id: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Blog post not found with ID: ${id}`);
    }

    return this.prisma.blogPost.delete({
      where: { id },
    });
  }

  async adminTogglePublish(id: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Blog post not found with ID: ${id}`);
    }

    const nextPublished = !post.published;
    return this.prisma.blogPost.update({
      where: { id },
      data: {
        published: nextPublished,
        publishedAt: nextPublished ? new Date() : null,
      },
    });
  }
}
