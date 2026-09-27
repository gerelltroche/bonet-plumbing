// Google Places API (v1) → normalized reviews data.
//
// Plain JS (not TS) so it can be shared by the Astro build (src/lib/reviews.ts)
// and the refresh script (scripts/reviews-refresh.mjs) without a
// TypeScript loader.
//
// Reviews can be written in English or Spanish, and the site has both. Google
// already knows each review's original language (originalText.languageCode)
// and translates it when the request carries another languageCode, so we fetch
// the place once per site locale and join the results on the review's resource
// name. Each review ends up with its original language and its text in every
// locale Google gave us, and the component picks the one for the page.

/**
 * @typedef {{ author: string; rating: number;
 *   lang: string; text: Record<string, string>; publishedAt: string;
 *   location?: string; reviewUrl?: string; avatarUrl?: string }} Review
 *   `lang` is the language the reviewer wrote in; `text[lang]` is their
 *   original words and any other key is Google's translation.
 * @typedef {{ reviews: Review[]; overallRating: number; reviewCount: number;
 *   googleReviewsUrl: string }} ReviewsData
 */

const MAX_REVIEWS = 3;
/** Site locales. The first one decides review order and the headline numbers. */
const LOCALES = ["en", "es"];

/**
 * Fetch the place's rating, review count and top reviews in every locale.
 * Returns `null` (after logging why) on any failure so the caller can fall
 * back to the committed snapshot. Never throws.
 *
 * @param {{ apiKey: string; placeId: string }} opts
 * @returns {Promise<ReviewsData | null>}
 */
export async function fetchPlaceReviews({ apiKey, placeId }) {
  try {
    const [primary, ...others] = await Promise.all(
      LOCALES.map((locale) => fetchPlace({ apiKey, placeId, locale })),
    );
    if (!primary) return null;

    /** @type {Map<string, Record<string, string>>} review name → locale → text */
    const translations = new Map();
    for (const [i, place] of [primary, ...others].entries()) {
      if (!place) continue; // a missing locale just means no translation
      const locale = LOCALES[i];
      for (const r of place.reviews ?? []) {
        if (baseLang(r.text?.languageCode) !== locale || !r.text?.text?.trim()) continue;
        const byLocale = translations.get(r.name) ?? {};
        byLocale[locale] = r.text.text;
        translations.set(r.name, byLocale);
      }
    }

    const candidates = (primary.reviews ?? []).filter((r) => originalText(r).trim().length > 0);
    // Prefer reviews we have in every locale, so Spanish visitors don't get
    // an untranslated English one (and vice versa) when a better one exists.
    const complete = (r) => LOCALES.every((l) => l === originalLang(r) || translations.get(r.name)?.[l]);
    const chosen = [...candidates.filter(complete), ...candidates.filter((r) => !complete(r))];

    /** @type {Review[]} */
    const reviews = chosen.slice(0, MAX_REVIEWS).map((r) => {
      const lang = originalLang(r);
      return {
        author: r.authorAttribution?.displayName ?? "Google reviewer",
        rating: r.rating ?? 5,
        lang,
        text: { ...translations.get(r.name), [lang]: originalText(r) },
        publishedAt: (r.publishTime ?? "").slice(0, 10),
        ...(r.googleMapsUri ? { reviewUrl: r.googleMapsUri } : {}),
        ...(r.authorAttribution?.photoUri ? { avatarUrl: r.authorAttribution.photoUri } : {}),
      };
    });

    if (reviews.length === 0 || typeof primary.rating !== "number" || typeof primary.userRatingCount !== "number") {
      console.warn("[reviews] Places API response incomplete (no reviews/rating/count)");
      return null;
    }

    return {
      reviews,
      overallRating: primary.rating,
      reviewCount: primary.userRatingCount,
      googleReviewsUrl: primary.googleMapsUri ?? "https://www.google.com/search?q=Bonet+Plumbing+LLC+Oviedo",
    };
  } catch (err) {
    console.error("[reviews] fetch failed:", err);
    return null;
  }
}

/** @param {{ apiKey: string; placeId: string; locale: string }} opts */
async function fetchPlace({ apiKey, placeId, locale }) {
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=${locale}`;
  const res = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews,googleMapsUri",
    },
  });
  if (!res.ok) {
    console.error(`[reviews] Places API (${locale}) ${res.status}: ${await res.text()}`);
    return null;
  }
  return res.json();
}

const originalText = (r) => r.originalText?.text ?? r.text?.text ?? "";
const originalLang = (r) => baseLang(r.originalText?.languageCode ?? r.text?.languageCode) || LOCALES[0];

/** "es-419" → "es". @param {string | undefined} code */
function baseLang(code) {
  return (code ?? "").split("-")[0].toLowerCase();
}
