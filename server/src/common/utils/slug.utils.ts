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

/**
 * Generates a unique doctor slug from their name
 */
export function generateDoctorSlug(name?: string | null, shortId?: string): string {
  const base = name ? slugify(name) : 'doctor';
  const prefix = base.startsWith('dr-') ? base : `dr-${base}`;
  
  if (shortId) {
    return `${prefix}-${shortId.slice(-6).toLowerCase()}`;
  }
  return prefix;
}
