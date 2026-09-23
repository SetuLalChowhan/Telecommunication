/**
 * Blog / healthcare article domain types.
 *
 * `BlogPostDto` mirrors the backend `BlogPost` Prisma model exactly.
 * `BlogPost` is the view model the site components consume, produced by
 * `toBlogPost()` so dates are already formatted and denormalised author /
 * reviewer objects are flat.
 */

export type BlogContentBlockType =
  | "paragraph"
  | "heading"
  | "subheading"
  | "quote"
  | "list"
  | "callout";

export interface BlogContentBlock {
  type: BlogContentBlockType;
  text?: string;
  items?: string[];
  author?: string;
}

export interface BlogFAQ {
  question: string;
  answer: string;
}

/** Raw API payload (1:1 with the Prisma model). */
export interface BlogPostDto {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  content: BlogContentBlock[];
  featuredImage: string;
  imageCaption: string | null;
  category: string;
  tags: string[];
  readTime: string;
  published: boolean;
  publishedAt: string | null;
  featured: boolean;
  viewsCount: number;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  authorBio: string | null;
  reviewerName: string | null;
  reviewerTitle: string | null;
  reviewerAvatar: string | null;
  reviewerDate: string | null;
  keyTakeaways: string[];
  faqs: BlogFAQ[] | null;
  createdAt: string;
  updatedAt: string;
}

/** View model used by site components. */
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: string;
  /** ISO string, kept for <time dateTime> and JSON-LD. */
  publishedAtIso: string | null;
  /** Pre-formatted UTC string, safe to render on server and client alike. */
  publishedAt: string;
  readTime: string;
  featuredImage: string;
  imageCaption: string;
  tags: string[];
  featured: boolean;
  viewsCount: number;
  author: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  reviewer: {
    name: string;
    title: string;
    avatar: string;
    reviewDate: string;
  } | null;
  keyTakeaways: string[];
  /** HTML string (React Quill output) or legacy structured block array. */
  content: string | BlogContentBlock[];
  faqs: BlogFAQ[];
}

export interface BlogCategory {
  name: string;
  count: number;
}

export interface BlogListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BlogListResult {
  items: BlogPost[];
  meta: BlogListMeta;
}

export interface BlogDetailResult {
  post: BlogPost | null;
  relatedPosts: BlogPost[];
}

export type BlogSortBy = "newest" | "oldest" | "popular";

export interface BlogQueryParams {
  search?: string;
  category?: string;
  sortBy?: BlogSortBy;
  page?: number;
  limit?: number;
}

export const DEFAULT_BLOG_META: BlogListMeta = {
  page: 1,
  limit: 9,
  total: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

/** Query keys for the doctor/admin blog console (published + drafts). */
export const adminBlogKeys = {
  all: ["admin-blogs"] as const,
  list: (params?: BlogQueryParams) =>
    [...adminBlogKeys.all, "list", params ?? {}] as const,
};

/** Query keys. Shared by server prefetch and client hooks so they match exactly. */
export const blogKeys = {
  all: ["blogs"] as const,
  list: (params: BlogQueryParams) => [...blogKeys.all, "list", params] as const,
  featured: () => [...blogKeys.all, "featured"] as const,
  categories: () => [...blogKeys.all, "categories"] as const,
  detail: (slug: string) => [...blogKeys.all, "detail", slug] as const,
};

/** Payload for creating/updating a blog post from the doctor/admin dashboard. */
export interface AdminBlogPayload {
  title: string;
  subtitle?: string;
  excerpt?: string;
  /** HTML string from React Quill */
  content: string;
  featuredImage: string;
  imageCaption?: string;
  category?: string;
  tags?: string[];
  readTime?: string;
  published?: boolean;
  featured?: boolean;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  authorBio?: string;
  slug?: string;
}
