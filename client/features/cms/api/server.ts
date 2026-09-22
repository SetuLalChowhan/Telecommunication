import { serverFetch, ServerFetchOptions } from "@/lib/api/server-fetch";
import { CmsSectionStore, WebsiteSection } from "../types";

function toSection(raw: unknown): WebsiteSection | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  const key = typeof value.key === "string" ? value.key : null;
  if (!key) return null;

  return {
    id: String(value.id ?? key),
    key,
    title: typeof value.title === "string" ? value.title : "",
    subtitle: typeof value.subtitle === "string" ? value.subtitle : null,
    badge: typeof value.badge === "string" ? value.badge : null,
    content: value.content ?? null,
    imageUrl: typeof value.imageUrl === "string" ? value.imageUrl : null,
    ctaText: typeof value.ctaText === "string" ? value.ctaText : null,
    ctaLink: typeof value.ctaLink === "string" ? value.ctaLink : null,
    metadata: value.metadata ?? null,
    isActive: value.isActive !== false,
    updatedAt: String(value.updatedAt ?? ""),
    createdAt: String(value.createdAt ?? ""),
  };
}

/**
 * Server-side website CMS sections, keyed by `key` for O(1) lookup.
 *
 * Always resolves — an unreachable backend yields an empty store and every
 * section falls back to its hard-coded default.
 */
export async function getCmsSectionsServer(
  options?: ServerFetchOptions
): Promise<CmsSectionStore> {
  try {
    const response = await serverFetch<unknown>("/cms/sections", {
      revalidate: 300,
      tags: ["cms"],
      ...options,
    });

    let list: unknown[] = [];
    if (Array.isArray(response)) {
      list = response;
    } else if (response && typeof response === "object") {
      const respObj = response as Record<string, any>;
      if (Array.isArray(respObj.data)) {
        list = respObj.data;
      } else if (respObj.data && typeof respObj.data === "object") {
        if (Array.isArray(respObj.data.sections)) {
          list = respObj.data.sections;
        } else if (Array.isArray(respObj.data.data)) {
          list = respObj.data.data;
        }
      } else if (Array.isArray(respObj.sections)) {
        list = respObj.sections;
      }
    }

    if (!Array.isArray(list)) {
      list = [];
    }

    const store: CmsSectionStore = {};

    for (const item of list) {
      const section = toSection(item);
      if (!section || !section.isActive) continue;
      // First row wins, so a duplicate key cannot blank out a resolved section.
      if (!store[section.key]) store[section.key] = section;
    }

    return store;
  } catch (error) {
    console.error("Failed to fetch CMS sections on server:", error);
    return {};
  }
}

/** Convenience wrapper that resolves a single section by key. */
export async function getCmsSectionServer(
  key: string,
  options?: ServerFetchOptions
): Promise<WebsiteSection | undefined> {
  const store = await getCmsSectionsServer(options);
  return store[key];
}
