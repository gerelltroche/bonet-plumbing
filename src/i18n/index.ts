// Locale helpers shared by every component and layout.
//
// URL scheme: English is unprefixed (/repiping/), Spanish lives under /es/
// (/es/repiping/) with the same slugs, so a page's twin in the other language
// is always derivable from its path. That is what hreflang and the language
// badge rely on.
import { ui, type UiStrings } from "./ui";

export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const SITE_URL = "https://bonetplumbing.com";

export function localeFromPath(pathname: string): Locale {
  return pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en";
}

/** "/es/repiping/" → "/repiping/"; English paths pass through. */
export function stripLocale(pathname: string): string {
  if (pathname === "/es" || pathname === "/es/") return "/";
  return pathname.startsWith("/es/") ? pathname.slice(3) : pathname;
}

/** Localize a site-relative path ("/repiping/#slab-leak", "/#contact"). Fragments ("#contact") pass through. */
export function localizePath(path: string, locale: Locale): string {
  if (!path.startsWith("/")) return path;
  const bare = stripLocale(path);
  if (locale === DEFAULT_LOCALE) return bare;
  return bare === "/" ? "/es/" : `/es${bare}`;
}

/** Absolute URL of this page in the given locale, for hreflang and the badge. */
export function alternateUrl(pathname: string, locale: Locale): string {
  return SITE_URL + localizePath(pathname, locale);
}

export type I18n = {
  locale: Locale;
  /** Strings for this locale. */
  t: UiStrings;
  /** Localize a site-relative path for this locale. */
  l: (path: string) => string;
};

/** Call as `useI18n(Astro.url)` in any component or page. */
export function useI18n(url: URL): I18n {
  const locale = localeFromPath(url.pathname);
  return { locale, t: ui[locale], l: (p) => localizePath(p, locale) };
}
