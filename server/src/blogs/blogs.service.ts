import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogsRepository } from './blogs.repository.js';
import { BlogQueryDto, BlogSortBy } from './dto/blog-query.dto.js';
import { CreateBlogDto } from './dto/create-blog.dto.js';
import { UpdateBlogDto } from './dto/update-blog.dto.js';
import { createPaginationMeta } from '../common/pagination/pagination.utils.js';

@Injectable()
export class BlogsService {
  constructor(private readonly repo: BlogsRepository) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // -- Public APIs -----------------------------------------------------------

  async listPublicBlogs(query: BlogQueryDto) {
    const { page = 1, limit = 10, search, category, sortBy = BlogSortBy.NEWEST } = query;
    const { rows, total } = await this.repo.findMany({ page, limit, search, category, sortBy, publishedOnly: true });

    return {
      items: rows,
      meta: createPaginationMeta(page, limit, total),
    };
  }

  async getFeaturedBlogs() {
    return this.repo.findFeatured();
  }

  async getBlogBySlug(slug: string) {
    const post = await this.repo.findBySlug(slug);

    if (!post || !post.published) {
      throw new NotFoundException(`Blog post not found: ${slug}`);
    }

    await this.repo.incrementViews(post.id);

    const relatedPosts = await this.repo.findRelated(post.category, post.id);

    return { post, relatedPosts };
  }

  async getBlogCategories() {
    const categories = await this.repo.getCategories();
    return categories.map((c) => ({ name: c.category, count: c._count.id }));
  }

  // -- Admin CMS APIs --------------------------------------------------------

  async adminListBlogs(query: BlogQueryDto) {
    const { page = 1, limit = 10, search, category } = query;
    const { rows, total } = await this.repo.findMany({ page, limit, search, category, publishedOnly: false });

    return {
      items: rows,
      meta: createPaginationMeta(page, limit, total),
    };
  }

  async adminCreateBlog(dto: CreateBlogDto) {
    const slug = dto.slug ? this.generateSlug(dto.slug) : this.generateSlug(dto.title);

    const existing = await this.repo.findBySlug(slug);
    if (existing) {
      throw new BadRequestException(`A blog post with slug '${slug}' already exists`);
    }

    return this.repo.create({
      ...dto,
      slug,
      publishedAt: dto.published ? new Date() : null,
    });
  }

  async adminUpdateBlog(id: string, dto: UpdateBlogDto) {
    const post = await this.repo.findById(id);
    if (!post) {
      throw new NotFoundException(`Blog post not found with ID: ${id}`);
    }

    let slug = post.slug;
    if (dto.slug && dto.slug !== post.slug) {
      slug = this.generateSlug(dto.slug);
      const existing = await this.repo.findBySlug(slug);
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

    return this.repo.update(id, { ...dto, slug, publishedAt });
  }

  async adminDeleteBlog(id: string) {
    const post = await this.repo.findById(id);
    if (!post) {
      throw new NotFoundException(`Blog post not found with ID: ${id}`);
    }
    return this.repo.delete(id);
  }

  async adminTogglePublish(id: string) {
    const post = await this.repo.findById(id);
    if (!post) {
      throw new NotFoundException(`Blog post not found with ID: ${id}`);
    }

    const nextPublished = !post.published;
    return this.repo.update(id, {
      published: nextPublished,
      publishedAt: nextPublished ? new Date() : null,
    });
  }
}
