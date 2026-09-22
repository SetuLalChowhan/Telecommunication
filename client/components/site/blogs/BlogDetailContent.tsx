import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Tag,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BlogCard from "@/components/site/blogs/BlogCard";
import type { BlogPost } from "@/features/blogs";

interface BlogDetailContentProps {
  post: BlogPost | null | undefined;
  relatedPosts?: BlogPost[];
}

export function BlogDetailContent({
  post,
  relatedPosts = [],
}: BlogDetailContentProps) {
  if (!post) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mx-auto max-w-md space-y-4 rounded-xl border border-border bg-card p-10">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="text-lg font-semibold text-foreground">Article not found</h1>
          <p className="text-sm text-secondary-text">
            The article you are looking for does not exist or has been unpublished.
          </p>
          <Button asChild>
            <Link href="/blogs">Back to all articles</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container-page pt-8 sm:pt-12">
        <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all articles</span>
          </Link>

          <div className="space-y-4">
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {post.category}
            </span>

            <h1 className="text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              {post.title}
            </h1>

            {post.subtitle && (
              <p className="text-base leading-relaxed text-secondary-text sm:text-lg">
                {post.subtitle}
              </p>
            )}
          </div>

          {/* Byline */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-border py-4 text-xs text-secondary-text sm:text-sm">
            <span className="flex items-center gap-2">
              <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                {post.author.avatar && (
                  <Image
                    src={post.author.avatar}
                    alt=""
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                )}
              </span>
              <span>
                <span className="block font-semibold text-foreground">
                  {post.author.name}
                </span>
                <span className="block text-[11px]">{post.author.role}</span>
              </span>
            </span>

            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              <time dateTime={post.publishedAtIso ?? undefined}>
                {post.publishedAt}
              </time>
            </span>

            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {post.readTime}
            </span>
          </div>

          {post.featuredImage && (
            <figure className="space-y-2">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-muted/40 sm:aspect-[16/9]">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 768px, 100vw"
                  className="object-cover"
                />
              </div>
              {post.imageCaption && (
                <figcaption className="text-xs text-muted-foreground">
                  {post.imageCaption}
                </figcaption>
              )}
            </figure>
          )}

          {post.keyTakeaways.length > 0 && (
            <aside className="rounded-xl border border-border bg-muted/40 p-5">
              <h2 className="text-sm font-semibold text-foreground">Key takeaways</h2>
              <ul className="mt-3 space-y-2">
                {post.keyTakeaways.map((item) => (
                  <li key={item} className="flex gap-2.5 text-xs leading-relaxed text-secondary-text sm:text-sm">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          {/* Body */}
          {typeof post.content === "string" ? (
            // React Quill HTML output
            <div
              className="blog-prose pt-2"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            // Legacy structured block renderer
            <div className="space-y-5 pt-2 text-sm leading-relaxed text-secondary-text sm:text-base">
              {post.content.map((block, index) => {
                if (block.type === "heading") {
                  return (
                    <h2
                      key={index}
                      className="pt-4 text-xl font-semibold text-foreground"
                    >
                      {block.text}
                    </h2>
                  );
                }

                if (block.type === "subheading") {
                  return (
                    <h3 key={index} className="pt-2 text-lg font-semibold text-foreground">
                      {block.text}
                    </h3>
                  );
                }

                if (block.type === "list" && block.items) {
                  return (
                    <ul key={index} className="my-3 list-disc space-y-2.5 pl-5">
                      {block.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                }

                if (block.type === "quote") {
                  return (
                    <blockquote
                      key={index}
                      className="my-5 rounded-r-lg border-l-4 border-primary bg-muted/40 py-2 pl-4 italic text-foreground"
                    >
                      <p>&ldquo;{block.text}&rdquo;</p>
                      {block.author && (
                        <footer className="mt-1.5 text-xs not-italic text-muted-foreground">
                          — {block.author}
                        </footer>
                      )}
                    </blockquote>
                  );
                }

                if (block.type === "callout") {
                  return (
                    <div
                      key={index}
                      className="my-4 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed text-foreground"
                    >
                      {block.text}
                    </div>
                  );
                }

                return (
                  <p key={index} className="leading-relaxed">
                    {block.text}
                  </p>
                );
              })}
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-6">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border bg-card px-2 py-0.5 text-[11px] font-medium text-secondary-text"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Reviewer */}
          {post.reviewer && (
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <ShieldCheck
                className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400"
                aria-hidden="true"
              />
              <div className="space-y-0.5 text-xs">
                <p className="font-semibold text-foreground">
                  Medically reviewed by {post.reviewer.name}
                </p>
                <p className="text-muted-foreground">
                  {post.reviewer.title}
                  {post.reviewer.reviewDate ? ` · ${post.reviewer.reviewDate}` : ""}
                </p>
              </div>
            </div>
          )}

          {/* Author bio */}
          {post.author.bio && (
            <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
              <User className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <p className="text-xs leading-relaxed text-secondary-text">
                <strong className="font-semibold text-foreground">
                  {post.author.name}
                </strong>{" "}
                — {post.author.bio}
              </p>
            </div>
          )}

          {/* Related */}
          {relatedPosts.length > 0 && (
            <section className="space-y-5 border-t border-border pt-8">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Related articles
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((related) => (
                  <BlogCard key={related.id} post={related} />
                ))}
              </div>
            </section>
          )}

          <div className="flex items-center justify-between border-t border-border pt-8">
            <Button asChild variant="outline">
              <Link href="/blogs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to all articles
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetailContent;
