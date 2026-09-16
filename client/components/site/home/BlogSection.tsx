import React from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Calendar, ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  image: string;
}

const BLOGS: BlogPost[] = [
  {
    id: "blog-1",
    slug: "improve-quickly-online-consultations",
    title: "How To Improve Quickly With The Help Of Online Consultations",
    author: "By Admin",
    date: "16 - Sep - 2026",
    excerpt:
      "Discover proven telemedicine routines and preparation steps to get the most effective diagnosis and treatment plan from your online doctor.",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "blog-2",
    slug: "preventive-care-healthy-heart-strategy",
    title: "The Most Effective Preventive Care Habits For A Healthy Heart",
    author: "By Dr. Sarah",
    date: "12 - Sep - 2026",
    excerpt:
      "Key lifestyle adjustments and routine cardiovascular screenings that can dramatically reduce health risks and improve vitality.",
    image:
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "blog-3",
    slug: "financial-audit-planning-family-treatment",
    title: "Financial Audit And Planning For Quality Family Healthcare",
    author: "By Admin",
    date: "08 - Sep - 2026",
    excerpt:
      "A complete guide on maximizing healthcare coverage, budget-friendly telemedicine plans, and preventive care savings for your family.",
    image:
      "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=800&q=80",
  },
];

export const BlogSection: React.FC = () => {
  return (
    <section className="w-full bg-surface py-14 sm:py-16 lg:py-20 border-b border-border/70 overflow-hidden">
      <div className="max-w-[1920px] mx-auto section-padding-x">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 border border-primary/20 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span>Our Blog</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold leading-tight tracking-tight text-foreground">
            Our Latest & Most Popular Tips & Tricks
          </h2>
        </div>

        {/* 3 Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8">
          {BLOGS.map((blog) => (
            <article
              key={blog.id}
              className="group flex flex-col rounded-tl-[32px] rounded-tr-[32px] rounded-bl-[16px] rounded-br-[16px] border border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-xl hover:border-primary/40 transition-all duration-300"
            >
              {/* Blog Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/40">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Blog Body */}
              <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between space-y-4">
                <div className="space-y-3">
                  {/* Meta Details: Author & Date */}
                  <div className="flex items-center gap-4 text-xs font-medium text-primary">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      <span>{blog.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{blog.date}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    <Link href={`/blogs`}>
                      {blog.title}
                    </Link>
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs sm:text-sm text-secondary-text leading-relaxed line-clamp-3">
                    {blog.excerpt}
                  </p>
                </div>

                {/* Read More Trigger Link */}
                <div className="pt-2">
                  <Link
                    href={`/blogs`}
                    className="inline-flex items-center text-xs sm:text-sm font-semibold text-primary hover:text-primary-dark transition-colors group/link"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BlogSection;
