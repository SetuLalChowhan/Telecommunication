"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogPost } from "@/lib/blog-data";

interface BlogDetailContentProps {
  post: BlogPost | null | undefined;
}

export function BlogDetailContent({ post }: BlogDetailContentProps) {
  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="rounded-xl border border-border bg-card p-10 max-w-md mx-auto space-y-4">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
          <h1 className="text-lg font-semibold text-foreground">Article not found</h1>
          <p className="text-sm text-secondary-text">
            The blog article you are looking for does not exist or has been removed.
          </p>
          <Link href="/blogs">
            <Button className="rounded-lg bg-primary text-primary-foreground hover:bg-primary-dark">
              Back to blogs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container-page pt-8 sm:pt-12">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all blogs</span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground leading-tight tracking-tight">
            {post.title}
          </h1>

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

          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl overflow-hidden border border-border bg-muted/40">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              priority
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
            />
          </div>

          {post.excerpt && (
            <p className="text-base font-medium text-foreground leading-relaxed bg-muted/40 p-5 rounded-xl border border-border">
              {post.excerpt}
            </p>
          )}

          <div className="space-y-5 text-secondary-text text-sm sm:text-base leading-relaxed pt-2">
            {post.content.map((block, idx) => {
              if (block.type === "heading") {
                return (
                  <h2
                    key={idx}
                    className="text-xl font-semibold text-foreground pt-4 pb-1"
                  >
                    {block.text}
                  </h2>
                );
              }

              if (block.type === "subheading") {
                return (
                  <h3 key={idx} className="text-lg font-semibold text-foreground pt-2">
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
                    className="my-5 border-l-4 border-primary pl-4 py-2 italic text-foreground bg-muted/40 rounded-r-lg"
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

          <div className="pt-8 border-t border-border flex items-center justify-between">
            <Link href="/blogs">
              <Button variant="outline" className="rounded-lg text-xs sm:text-sm h-10 px-4 gap-2">
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
