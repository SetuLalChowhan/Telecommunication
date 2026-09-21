import React from "react";
import type { Metadata } from "next";
import { BLOG_POSTS } from "@/lib/blog-data";
import { BlogDetailContent } from "@/components/site/blogs/BlogDetailContent";

interface BlogDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogDetailsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = BLOG_POSTS.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    return {
      title: "Article Not Found | DocConnect",
      description: "The requested medical article could not be found.",
    };
  }

  return {
    title: `${post.title} | DocConnect`,
    description: post.excerpt,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [
        {
          url: post.featuredImage,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  };
}

export default async function BlogDetailsPage({
  params,
}: BlogDetailsPageProps) {
  const resolvedParams = await params;
  const post = BLOG_POSTS.find((p) => p.slug === resolvedParams.slug);

  return <BlogDetailContent post={post} />;
}
