import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { getPaginationParams } from '../common/pagination/pagination.utils.js';
import { BlogSortBy } from './dto/blog-query.dto.js';

export interface BlogListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: BlogSortBy;
  publishedOnly?: boolean;
}

@Injectable()
export class BlogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(params: BlogListParams): Prisma.BlogPostWhereInput {
    const where: Prisma.BlogPostWhereInput = {};
    if (params.publishedOnly) where.published = true;
    if (params.search?.trim()) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { excerpt: { contains: params.search, mode: 'insensitive' } },
        { authorName: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    if (params.category && params.category !== 'All Articles') {
      where.category = { equals: params.category, mode: 'insensitive' };
    }
    return where;
  }

  async findMany(params: BlogListParams) {
    const { skip, take } = getPaginationParams(params.page, params.limit);
    const where = this.buildWhere(params);

    let orderBy: Prisma.BlogPostOrderByWithRelationInput = { publishedAt: 'desc' };
    if (params.sortBy === BlogSortBy.OLDEST) orderBy = { publishedAt: 'asc' };
    else if (params.sortBy === BlogSortBy.POPULAR) orderBy = { viewsCount: 'desc' };
    else if (!params.publishedOnly) orderBy = { createdAt: 'desc' };

    const [rows, total] = await Promise.all([
      this.prisma.blogPost.findMany({ where, skip, take, orderBy }),
      this.prisma.blogPost.count({ where }),
    ]);

    return { rows, total };
  }

  async findFeatured() {
    return this.prisma.blogPost.findMany({
      where: { published: true, featured: true },
      take: 4,
      orderBy: { publishedAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.blogPost.findUnique({ where: { slug } });
  }

  async findById(id: string) {
    return this.prisma.blogPost.findUnique({ where: { id } });
  }

  async findRelated(category: string | null, excludeId: string) {
    return this.prisma.blogPost.findMany({
      where: { published: true, category: category ?? undefined, id: { not: excludeId } },
      take: 3,
      orderBy: { publishedAt: 'desc' },
    });
  }

  async incrementViews(id: string) {
    return this.prisma.blogPost.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    });
  }

  async getCategories() {
    return this.prisma.blogPost.groupBy({
      by: ['category'],
      where: { published: true },
      _count: { id: true },
    });
  }

  async create(data: Prisma.BlogPostCreateInput) {
    return this.prisma.blogPost.create({ data });
  }

  async update(id: string, data: Prisma.BlogPostUpdateInput) {
    return this.prisma.blogPost.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.blogPost.delete({ where: { id } });
  }
}
