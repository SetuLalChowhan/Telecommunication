import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogPost } from "@/lib/blog-data";

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <article className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-colors hover:border-primary/40">
      {/* Blog Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/40">
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-102"
        />
      </div>

      {/* Blog Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Meta: Author & Date */}
          <div className="flex items-center gap-2 text-xs text-secondary-text">
            <span className="font-semibold text-primary">{post.author.name}</span>
            <span>&bull;</span>
            <span>{post.publishedAt}</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            <Link href={`/blogs/${post.slug}`}>
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-xs sm:text-sm text-secondary-text leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        {/* Read Link */}
        <div className="pt-3 border-t border-border/60">
          <Link
            href={`/blogs/${post.slug}`}
            className="inline-flex items-center text-xs sm:text-sm font-semibold text-primary hover:text-primary-dark transition-colors group/link"
          >
            <span>Read article</span>
            <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
