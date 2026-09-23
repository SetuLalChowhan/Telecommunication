/**
 * Converts a text/name into an SEO-friendly slug
 * Example: "Dr. John Doe, MD" -> "dr-john-doe-md"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

/** Longest slug the database and the DTO accept. */
export const MAX_DOCTOR_SLUG_LENGTH = 60;

/**
 * The preferred public URL segment for a doctor: `dr-` + the name.
 *
 * Deliberately deterministic and free of any random/ID suffix — "Ithika"
 * becomes `dr-ithika`, not `dr-ithika-twocyd`. Uniqueness is resolved
 * separately by `firstFreeSlug`, so names never get an opaque suffix unless
 * someone already owns the clean slug.
 */
export function generateDoctorSlug(name?: string | null): string {
  const base = name ? slugify(name) : '';
  const prefixed = !base ? 'doctor' : base.startsWith('dr-') ? base : `dr-${base}`;
  return prefixed.slice(0, MAX_DOCTOR_SLUG_LENGTH).replace(/-+$/, '');
}

/** The single valid public URL shape for a doctor. */
export const DOCTOR_SLUG_PATTERN = /^dr-[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Canonicalises a doctor-supplied slug into that one shape.
 *
 * Returns an empty string when nothing usable is left, so callers can reject it
 * rather than silently persisting a placeholder URL.
 */
export function sanitizeDoctorSlug(input: string): string {
  const cleaned = slugify(input);
  if (!cleaned) return '';
  return generateDoctorSlug(cleaned);
}

/**
 * Candidate slug for the Nth attempt: `dr-ithika`, `dr-ithika-2`, `dr-ithika-3`…
 *
 * A counter keeps the URL readable, stable and obviously human-made, unlike a
 * random or timestamp suffix.
 */
export function withSlugSuffix(base: string, attempt: number): string {
  if (attempt <= 1) return base;
  const suffix = `-${attempt}`;
  const room = MAX_DOCTOR_SLUG_LENGTH - suffix.length;
  return `${base.slice(0, room).replace(/-+$/, '')}${suffix}`;
}

/**
 * True when `slug` is a de-duplicated form of `base` (`dr-ithika-2`).
 *
 * Used to tell "still auto-generated" apart from "deliberately chosen", so a
 * rename may refresh the former but never overwrite the latter.
 */
export function isNumberedSlugFor(slug: string, base: string): boolean {
  if (!base || slug === base) return false;
  const escaped = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escaped}-\\d+$`).test(slug);
}

/**
 * First slug derived from `base` that is not already taken.
 *
 * `taken` holds the slugs that exist, so one query resolves uniqueness instead
 * of a loop of round-trips.
 */
export function firstFreeSlug(
  base: string,
  taken: Iterable<string>,
  maxAttempts = 50,
): string {
  const used = new Set(taken);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const candidate = withSlugSuffix(base, attempt);
    if (!used.has(candidate)) return candidate;
  }

  return withSlugSuffix(base, maxAttempts + 1);
}
