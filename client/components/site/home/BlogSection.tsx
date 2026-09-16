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
    title: "How to Prepare for Your Online Doctor Video Consultation",
    author: "Medical Team",
    date: "16 Sep, 2026",
    excerpt:
      "Discover proven preparation steps and symptom logging to get the most effective diagnosis and treatment plan from your virtual consultation.",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "blog-2",
    slug: "preventive-care-healthy-heart-strategy",
    title: "Essential Preventative Health Habits for Heart & Lifestyle Wellness",
    author: "Dr. Sarah Jenkins",
    date: "12 Sep, 2026",
    excerpt:
      "Key lifestyle habits, blood pressure monitoring, and routine cardiovascular screenings that can dramatically improve long-term vitality.",
    image:
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "blog-3",
    slug: "financial-audit-planning-family-treatment",
    title: "Managing Family Healthcare: Telehealth Benefits & Quick Access",
    author: "Health Advisory",
    date: "08 Sep, 2026",
    excerpt:
      "A complete overview of instant virtual appointments, pediatric triage, and regular health checkups from home for your entire family.",
    image:
      "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=800&q=80",
  },
];

export const BlogSection: React.FC = () => {
  return (
    <section className="w-full bg-slate-50/60 dark:bg-slate-900/20 py-14 sm:py-16 lg:py-20 border-b border-border overflow-hidden">
      <div className="max-w-[1920px] mx-auto section-padding-x">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-4 sm:space-y-5">
          <span className="text-xs font-semibold tracking-wider text-primary uppercase block">
            Health Insights & Articles
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-foreground">
            Latest Healthcare Articles & Tips
          </h2>
          <p className="text-sm sm:text-[15px] text-secondary-text max-w-lg mx-auto leading-relaxed">
            Stay informed with verified medical advice, preventative care tips, and telehealth guidance from certified doctors.
          </p>
        </div>

        {/* 3 Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOGS.map((blog) => (
            <article
              key={blog.id}
              className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200"
            >
              {/* Blog Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/40">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-102"
                />
              </div>

              {/* Blog Body */}
              <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between space-y-4">
                <div className="space-y-2.5">
                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-secondary-text">
                    <span className="font-medium text-primary">{blog.author}</span>
                    <span>&bull;</span>
                    <span>{blog.date}</span>
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

                {/* Read Link */}
                <div className="pt-2 border-t border-border/60">
                  <Link
                    href={`/blogs`}
                    className="inline-flex items-center text-xs sm:text-sm font-semibold text-primary hover:text-primary-dark transition-colors group/link"
                  >
                    <span>Read Full Article</span>
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
