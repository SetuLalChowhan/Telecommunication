import { serverGet, ServerFetchOptions } from "@/lib/api/server";
import { CACHE } from "@/lib/cache/policy";
import { CmsSectionStore, WebsiteSection } from "../types";

/**
 * Server-side website CMS sections, keyed by `key` for O(1) lookup.
 *
 * The backend returns `{ list, sections }`; we build the store from `list` so
 * duplicate keys cannot blank a resolved section (first row wins).
 *
 * Always resolves — an unreachable backend yields an empty store and every
 * section falls back to its hard-coded default.
 */
export async function getCmsSectionsServer(
  options?: ServerFetchOptions
): Promise<CmsSectionStore> {
  try {
    const { list } = await serverGet<{ list?: WebsiteSection[] }>(
      "/cms/sections",
      { ...CACHE.cms.server, ...options }
    );

    const store: CmsSectionStore = {};
    for (const section of list ?? []) {
      if (section?.isActive !== false && !store[section.key]) {
        store[section.key] = section;
      }
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
