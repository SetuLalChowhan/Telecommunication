"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BLOG_POSTS } from "@/lib/blog-data";

export default function BlogDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // Find blog post
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="rounded-2xl border border-border bg-card p-10 max-w-md mx-auto space-y-4 shadow-xs">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">Blog Not Found</h1>
          <p className="text-sm text-secondary-text">
            The blog article you are looking for does not exist or has been removed.
          </p>
          <Link href="/blogs">
            <Button className="rounded-xl bg-primary text-white hover:bg-primary-dark">
              Back to Blogs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Container with Section Padding */}
      <div className="max-w-[1920px] mx-auto section-padding-x pt-8 sm:pt-12">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Back Navigation Link */}
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all blogs</span>
          </Link>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground leading-[1.2] tracking-tight">
            {post.title}
          </h1>

          {/* Written by & Submitted date */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-secondary-text pb-4 border-b border-border/80">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-primary" />
              <span>
                Written by <strong className="text-foreground">{post.author.name}</strong>
              </span>
            </div>
            <span>&bull;</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                Submitted on <strong className="text-foreground">{post.publishedAt}</strong>
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden border border-border bg-muted/40 shadow-xs">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              priority
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
            />
          </div>

          {/* Excerpt Summary */}
          {post.excerpt && (
            <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed bg-slate-50/60 dark:bg-slate-900/30 p-5 rounded-2xl border border-border">
              {post.excerpt}
            </p>
          )}

          {/* Description / Content Body */}
          <div className="space-y-5 text-secondary-text text-sm sm:text-base leading-relaxed pt-2">
            {post.content.map((block, idx) => {
              if (block.type === "heading") {
                return (
                  <h2
                    key={idx}
                    className="text-xl sm:text-2xl font-bold text-foreground pt-4 pb-1"
                  >
                    {block.text}
                  </h2>
                );
              }

              if (block.type === "subheading") {
                return (
                  <h3 key={idx} className="text-lg font-bold text-foreground pt-2">
                    {block.text}
                  </h3>
                );
              }

              if (block.type === "list" && block.items) {
                return (
                  <ul key={idx} className="space-y-2.5 pl-4 my-3 list-disc text-secondary-text">
                    {block.items.map((item, i) => (
                      <li key={i} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              }

              if (block.type === "quote") {
                return (
                  <blockquote
                    key={idx}
                    className="my-5 border-l-4 border-primary pl-4 py-2 italic text-foreground bg-slate-50/60 dark:bg-slate-900/40 rounded-r-xl"
                  >
                    <p>&ldquo;{block.text}&rdquo;</p>
                  </blockquote>
                );
              }

              if (block.type === "callout") {
                return (
                  <div
                    key={idx}
                    className="my-4 p-4 rounded-xl border border-primary/20 bg-primary/5 text-foreground text-sm leading-relaxed"
                  >
                    {block.text}
                  </div>
                );
              }

              return (
                <p key={idx} className="leading-relaxed">
                  {block.text}
                </p>
              );
            })}
          </div>

          {/* Bottom Back Button */}
          <div className="pt-8 border-t border-border flex items-center justify-between">
            <Link href="/blogs">
              <Button variant="outline" className="rounded-xl text-xs sm:text-sm h-10 px-4 gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to all blogs</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
