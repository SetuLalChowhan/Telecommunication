import { formatLongDate } from "@/lib/format";
import { BlogContentBlock, BlogFAQ, BlogPost, BlogPostDto } from "./types";

/**
 * The single blog DTO -> view-model mapper.
 *
 * The backend envelope is now trusted (one stable shape), so the only job here
 * is presentation: pre-format dates and flatten the denormalised author /
 * reviewer fields for the site components.
 */

function toContent(dto: BlogPostDto): string | BlogContentBlock[] {
  // `content` is either a React Quill HTML string or the legacy block array.
  if (typeof dto.content === "string") return dto.content;
  return Array.isArray(dto.content) ? dto.content : "";
}

export function toBlogPost(dto: BlogPostDto): BlogPost {
  return {
    id: dto.id,
    slug: dto.slug,
    title: dto.title,
    subtitle: dto.subtitle ?? "",
    excerpt: dto.excerpt ?? "",
    category: dto.category || "General Health",
    publishedAtIso: dto.publishedAt,
    publishedAt:
      formatLongDate(dto.publishedAt) || formatLongDate(dto.createdAt),
    readTime: dto.readTime || "5 min read",
    featuredImage: dto.featuredImage,
    imageCaption: dto.imageCaption ?? "",
    tags: Array.isArray(dto.tags) ? dto.tags : [],
    featured: Boolean(dto.featured),
    viewsCount: dto.viewsCount ?? 0,
    author: {
      name: dto.authorName || "Medical Team",
      role: dto.authorRole || "Contributor",
      avatar: dto.authorAvatar || "",
      bio: dto.authorBio ?? "",
    },
    reviewer: dto.reviewerName
      ? {
          name: dto.reviewerName,
          title: dto.reviewerTitle ?? "",
          avatar: dto.reviewerAvatar ?? "",
          reviewDate: dto.reviewerDate ?? "",
        }
      : null,
    keyTakeaways: Array.isArray(dto.keyTakeaways) ? dto.keyTakeaways : [],
    content: toContent(dto),
    faqs: (dto.faqs ?? []) as BlogFAQ[],
  };
}
