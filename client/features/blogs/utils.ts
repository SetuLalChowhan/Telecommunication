import {
  BlogPost,
  BlogPostDto,
  BlogContentBlock,
  BlogFAQ,
} from "./types";

/**
 * Fixed-locale, fixed-timezone formatter.
 *
 * Dates are formatted on the server (RSC) and again on the client after
 * hydration. Using the host locale/timezone would make the two disagree and
 * trigger a hydration mismatch, so both sides go through this one formatter
 * with an explicit locale and UTC.
 */
const LONG_DATE = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const SHORT_DATE = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatLongDate(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return LONG_DATE.format(date);
}

export function formatShortDate(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return SHORT_DATE.format(date);
}

function normalizeContent(content: unknown): BlogContentBlock[] {
  if (!Array.isArray(content)) return [];

  return content.flatMap((raw): BlogContentBlock[] => {
    if (!raw || typeof raw !== "object") return [];
    const block = raw as Partial<BlogContentBlock>;
    if (!block.type) return [];

    return [
      {
        type: block.type,
        text: block.text,
        items: Array.isArray(block.items) ? block.items : undefined,
        author: block.author,
      },
    ];
  });
}

function normalizeFaqs(faqs: unknown): BlogFAQ[] {
  if (!Array.isArray(faqs)) return [];

  return faqs.flatMap((raw): BlogFAQ[] => {
    if (!raw || typeof raw !== "object") return [];
    const faq = raw as Partial<BlogFAQ>;
    if (!faq.question || !faq.answer) return [];
    return [{ question: faq.question, answer: faq.answer }];
  });
}

/** Maps the API payload into the view model. Tolerates partial CMS rows. */
export function toBlogPost(dto: BlogPostDto): BlogPost {
  // content can be a raw HTML string (React Quill) or the legacy block array
  const content: string | BlogContentBlock[] =
    typeof dto.content === "string"
      ? dto.content
      : normalizeContent(dto.content);

  return {
    id: dto.id,
    slug: dto.slug,
    title: dto.title,
    subtitle: dto.subtitle ?? "",
    excerpt: dto.excerpt ?? "",
    category: dto.category || "General Health",
    publishedAtIso: dto.publishedAt,
    publishedAt: formatLongDate(dto.publishedAt) || formatLongDate(dto.createdAt),
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
    content,
    faqs: normalizeFaqs(dto.faqs),
  };
}

/**
 * The backend returns paginated payloads in two shapes depending on the
 * endpoint, so unwrap defensively: `{ data: { items, meta } }` or `{ items, meta }`.
 */
export function normalizeBlogList(raw: unknown): {
  items: BlogPostDto[];
  meta: Record<string, unknown> | undefined;
} {
  if (!raw || typeof raw !== "object") return { items: [], meta: undefined };

  const body = raw as Record<string, unknown>;

  // Case 1: { items, meta } or { data: { items, meta } }
  const nested = body.data as Record<string, unknown> | undefined;
  const candidate = nested && !Array.isArray(nested) ? nested : body;

  if (Array.isArray(candidate.items)) {
    return {
      items: candidate.items as BlogPostDto[],
      meta: candidate.meta as Record<string, unknown> | undefined,
    };
  }

  // Case 2: a bare array
  if (Array.isArray(body.data)) {
    return { items: body.data as BlogPostDto[], meta: undefined };
  }
  if (Array.isArray(raw)) {
    return { items: raw as BlogPostDto[], meta: undefined };
  }

  return { items: [], meta: undefined };
}

export function normalizeBlogArray(raw: unknown): BlogPostDto[] {
  if (Array.isArray(raw)) return raw as BlogPostDto[];
  if (!raw || typeof raw !== "object") return [];

  const body = raw as Record<string, unknown>;

  if (Array.isArray(body.data)) return body.data as BlogPostDto[];
  if (Array.isArray(body.items)) return body.items as BlogPostDto[];

  const nested = body.data as Record<string, unknown> | undefined;
  if (nested) {
    if (Array.isArray(nested.items)) return nested.items as BlogPostDto[];
    if (Array.isArray(nested.data)) return nested.data as BlogPostDto[];
  }

  return [];
}

/** `{ post, relatedPosts }` in either envelope form. */
export function normalizeBlogDetail(raw: unknown): {
  post: BlogPostDto | null;
  relatedPosts: BlogPostDto[];
} {
  if (!raw || typeof raw !== "object") return { post: null, relatedPosts: [] };

  const body = raw as Record<string, unknown>;
  const inner = body.data as Record<string, unknown> | undefined;
  const source = inner && !Array.isArray(inner) ? inner : body;

  const post = (source.post ?? null) as BlogPostDto | null;
  const related = Array.isArray(source.relatedPosts)
    ? (source.relatedPosts as BlogPostDto[])
    : [];

  return { post, relatedPosts: related };
}
