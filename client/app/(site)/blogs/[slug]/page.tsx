import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogDetailContent } from "@/components/site/blogs/BlogDetailContent";
import { getBlogBySlugServer } from "@/features/blogs/api/server";
import { SITE_URL, absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";

interface BlogDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { post } = await getBlogBySlugServer(slug);

  if (!post) {
    return {
      title: "Article Not Found | DocConnect",
      description: "The requested medical article could not be found.",
      robots: { index: false, follow: true },
    };
  }

  const description = post.excerpt || post.subtitle;
  const url = `/blogs/${post.slug}`;

  return {
    title: `${post.title} | DocConnect`,
    description,
    keywords: post.tags.length ? post.tags : undefined,
    authors: [{ name: post.author.name }],
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url,
      siteName: "DocConnect",
      publishedTime: post.publishedAtIso ?? undefined,
      authors: [post.author.name],
      ...(post.featuredImage
        ? { images: [{ url: post.featuredImage, alt: post.title }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      ...(post.featuredImage ? { images: [post.featuredImage] } : {}),
    },
  };
}

export default async function BlogDetailsPage({ params }: BlogDetailsPageProps) {
  const { slug } = await params;
  const { post, relatedPosts } = await getBlogBySlugServer(slug);

  if (!post) notFound();

  const articleUrl = absoluteUrl(`/blogs/${post.slug}`);

  // Structured data built purely from typed API fields.
  const blogPostingLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.subtitle,
    ...(post.featuredImage ? { image: [post.featuredImage] } : {}),
    ...(post.publishedAtIso ? { datePublished: post.publishedAtIso } : {}),
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.role || undefined,
    },
    ...(post.reviewer
      ? {
          reviewedBy: {
            "@type": "Person",
            name: post.reviewer.name,
            jobTitle: post.reviewer.title || undefined,
          },
        }
      : {}),
    publisher: {
      "@type": "Organization",
      name: "DocConnect",
      url: SITE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    url: articleUrl,
    articleSection: post.category,
    ...(post.tags.length ? { keywords: post.tags.join(", ") } : {}),
    ...(post.faqs.length
      ? {
          mainEntity: post.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }
      : {}),
  };

  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Health articles", path: "/blogs" },
    { name: post.title, path: `/blogs/${post.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <BlogDetailContent post={post} relatedPosts={relatedPosts} />

      {/* FAQ answers are also rendered as crawlable HTML, not only JSON-LD. */}
      {post.faqs.length > 0 && (
        <section className="border-t border-border bg-muted/30 py-14">
          <div className="container-page mx-auto max-w-3xl space-y-6">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <dl className="space-y-5">
              {post.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <dt className="text-sm font-semibold text-foreground">
                    {faq.question}
                  </dt>
                  <dd className="mt-1.5 text-xs leading-relaxed text-secondary-text sm:text-sm">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}
    </>
  );
}
