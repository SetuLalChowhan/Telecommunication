export type ThemeMode = "light" | "dark" | "system";

/**
 * Applies a theme mode to the document root.
 *
 * `system` follows the OS preference. This is a DOM side effect only — it is
 * safe to call from an effect or a click handler.
 */
export function applyTheme(mode: string): void {
  if (typeof document === "undefined") return;

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  const shouldUseDark = mode === "dark" || (mode === "system" && prefersDark);

  document.documentElement.classList.toggle("dark", shouldUseDark);
}
