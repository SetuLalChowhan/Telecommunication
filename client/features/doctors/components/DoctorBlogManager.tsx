"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  BookOpen,
  Check,
  Edit2,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdminBlogs,
  useAdminCreateBlog,
  useAdminDeleteBlog,
  useAdminTogglePublish,
  useAdminUpdateBlog,
} from "@/features/blogs/api/queries";
import type { AdminBlogPayload, BlogPost } from "@/features/blogs";
import { useAuth } from "@/lib/api";

// Dynamic import — Quill uses browser APIs, must be client-only
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="flex h-52 items-center justify-center rounded-b-lg border border-t-0 border-input bg-muted/20 text-xs text-muted-foreground">
      Loading editor…
    </div>
  ),
});

// "bullet" and "ordered" are NOT standalone Quill formats — they are values of "list"
const QUILL_MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "link"],
    ["clean"],
  ],
};

const QUILL_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",       // covers both ordered and bullet
  "blockquote",
  "link",
];

const CATEGORIES = [
  "General Health",
  "Cardiology",
  "Nutrition",
  "Mental Health",
  "Pediatrics",
  "Dermatology",
  "Orthopedics",
  "Diabetes",
  "Women's Health",
];

interface FormState {
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  published: boolean;
}

const emptyForm = (): FormState => ({
  title: "",
  subtitle: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  category: "General Health",
  published: false,
});

function postToForm(post: BlogPost): FormState {
  return {
    title: post.title,
    subtitle: post.subtitle ?? "",
    excerpt: post.excerpt ?? "",
    content: typeof post.content === "string" ? post.content : "",
    featuredImage: post.featuredImage ?? "",
    category: post.category ?? "General Health",
    published: post.featured ?? false,
  };
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  label,
  required,
  children,
  htmlFor,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={htmlFor}
        className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
      >
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DoctorBlogManager() {
  const { user } = useAuth();
  const { data, isLoading } = useAdminBlogs();
  const createMutation = useAdminCreateBlog();
  const updateMutation = useAdminUpdateBlog();
  const deleteMutation = useAdminDeleteBlog();
  const toggleMutation = useAdminTogglePublish();

  const [open, setOpen] = useState(false);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setForm(emptyForm());
      setEditPost(null);
    }
  }, [open]);

  const openCreate = () => {
    setEditPost(null);
    setForm(emptyForm());
    setOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditPost(post);
    setForm(postToForm(post));
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.content.trim()) return;

    const payload: AdminBlogPayload = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || undefined,
      excerpt: form.excerpt.trim() || undefined,
      content: form.content,
      featuredImage:
        form.featuredImage.trim() ||
        "https://placehold.co/800x450/e2e8f0/94a3b8?text=Article",
      category: form.category,
      published: form.published,
      authorName: user?.name || "Medical Team",
      authorRole: "Doctor",
      authorAvatar: user?.image || "",
    };

    if (editPost) {
      updateMutation.mutate(
        { id: editPost.id, payload },
        { onSuccess: () => setOpen(false) }
      );
    } else {
      createMutation.mutate(payload, { onSuccess: () => setOpen(false) });
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, { onSuccess: () => setDeleteConfirmId(null) });
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const posts = data?.items ?? [];

  return (
    <section className="panel overflow-hidden">
      {/* Header */}
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <h2 className="panel-title">My articles</h2>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1.5 rounded-md px-3 text-xs font-semibold"
          onClick={openCreate}
        >
          <Plus className="h-3.5 w-3.5" />
          Write article
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : posts.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">No articles yet.</p>
          <p className="mt-0.5 text-xs text-muted-foreground/60">
            Share your clinical knowledge with patients.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {posts.map((post) => (
            <li key={post.id} className="flex items-start gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">
                  {post.title}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">
                    {post.category}
                  </span>
                  <span
                    className={`inline-flex items-center rounded px-1.5 py-px text-[10px] font-semibold ${
                      post.featured
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {post.featured ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  type="button"
                  title={post.featured ? "Unpublish" : "Publish"}
                  disabled={toggleMutation.isPending}
                  onClick={() => toggleMutation.mutate(post.id)}
                  className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Edit"
                  onClick={() => openEdit(post)}
                  className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>

                {deleteConfirmId === post.id ? (
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      title="Confirm delete"
                      disabled={deleteMutation.isPending}
                      onClick={() => handleDelete(post.id)}
                      className="rounded p-1.5 text-destructive transition-colors hover:bg-destructive/10"
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      title="Cancel"
                      onClick={() => setDeleteConfirmId(null)}
                      className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    title="Delete"
                    onClick={() => setDeleteConfirmId(post.id)}
                    className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-[92vh] w-full max-w-2xl flex-col gap-0 overflow-hidden p-0">
          {/* Dialog header */}
          <DialogHeader className="shrink-0 border-b border-border px-6 py-4">
            <DialogTitle className="text-sm font-semibold text-foreground">
              {editPost ? "Edit article" : "Write an article"}
            </DialogTitle>
          </DialogHeader>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="space-y-5">
              {/* Two-column: title + category */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <Field label="Title" required htmlFor="blog-title">
                    <Input
                      id="blog-title"
                      value={form.title}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, title: e.target.value }))
                      }
                      placeholder="e.g. Managing Hypertension at Home"
                      className="h-9 text-sm"
                    />
                  </Field>
                </div>
                <div>
                  <Field label="Category" htmlFor="blog-category">
                    <select
                      id="blog-category"
                      value={form.category}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, category: e.target.value }))
                      }
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>

              {/* Subtitle */}
              <Field label="Subtitle" htmlFor="blog-subtitle">
                <Input
                  id="blog-subtitle"
                  value={form.subtitle}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, subtitle: e.target.value }))
                  }
                  placeholder="A one-line summary (optional)"
                  className="h-9 text-sm"
                />
              </Field>

              {/* Excerpt */}
              <Field label="Excerpt" htmlFor="blog-excerpt">
                <Textarea
                  id="blog-excerpt"
                  value={form.excerpt}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, excerpt: e.target.value }))
                  }
                  placeholder="Short preview shown in the article listing (optional)"
                  rows={2}
                  className="resize-none text-sm"
                />
              </Field>

              {/* Featured image */}
              <Field label="Featured image URL" htmlFor="blog-image">
                <Input
                  id="blog-image"
                  value={form.featuredImage}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, featuredImage: e.target.value }))
                  }
                  placeholder="https://..."
                  className="h-9 font-mono text-xs"
                />
              </Field>

              {/* Content — Quill */}
              <Field label="Content" required>
                <div className="quill-wrapper overflow-hidden rounded-lg border border-input">
                  <ReactQuill
                    theme="snow"
                    value={form.content}
                    onChange={(val) =>
                      setForm((f) => ({ ...f, content: val }))
                    }
                    modules={QUILL_MODULES}
                    formats={QUILL_FORMATS}
                    placeholder="Write your article content here…"
                  />
                </div>
              </Field>

              {/* Publish toggle */}
              <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, published: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-border accent-primary"
                />
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Publish immediately
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Unchecked saves as a draft visible only to you
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Footer actions */}
          <div className="shrink-0 flex items-center justify-end gap-2 border-t border-border bg-muted/20 px-6 py-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 px-4 text-xs font-medium"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-9 px-5 text-xs font-semibold"
              onClick={handleSave}
              disabled={isSaving || !form.title.trim() || !form.content.trim()}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Saving…
                </>
              ) : editPost ? (
                "Save changes"
              ) : (
                "Publish article"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default DoctorBlogManager;
