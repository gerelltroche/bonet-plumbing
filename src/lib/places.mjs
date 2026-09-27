// Google Places API (v1) → normalized reviews data.
//
// Plain JS (not TS) so it can be shared by the Astro build (src/lib/reviews.ts)
// and the standalone snapshot script (scripts/reviews-snapshot.mjs) without a
// TypeScript loader.

/**
 * @typedef {{ author: string; rating: number; text: string; date: string;
 *   location?: string; reviewUrl?: string; avatarUrl?: string }} Review
 * @typedef {{ reviews: Review[]; overallRating: number; reviewCount: number;
 *   googleReviewsUrl: string }} ReviewsData
 */

const MAX_REVIEWS = 3;

/**
 * Fetch the place's rating, review count and top reviews.
 * Returns `null` (after logging why) on any failure so the caller can fall
 * back to the committed snapshot. Never throws.
 *
 * @param {{ apiKey: string; placeId: string }} opts
 * @returns {Promise<ReviewsData | null>}
 */
export async function fetchPlaceReviews({ apiKey, placeId }) {
  try {
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;
    const res = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews,googleMapsUri",
      },
    });

    if (!res.ok) {
      console.error(`[reviews] Places API ${res.status}: ${await res.text()}`);
      return null;
    }

    const data = await res.json();

    /** @type {Review[]} */
    const reviews = (data.reviews ?? [])
      .filter((r) => (r.text?.text ?? r.originalText?.text ?? "").trim().length > 0)
      .slice(0, MAX_REVIEWS)
      .map((r) => ({
        author: r.authorAttribution?.displayName ?? "Google reviewer",
        rating: r.rating ?? 5,
        text: r.text?.text ?? r.originalText?.text ?? "",
        date: formatMonthYear(r.publishTime),
        ...(r.googleMapsUri ? { reviewUrl: r.googleMapsUri } : {}),
        ...(r.authorAttribution?.photoUri ? { avatarUrl: r.authorAttribution.photoUri } : {}),
      }));

    if (reviews.length === 0 || typeof data.rating !== "number" || typeof data.userRatingCount !== "number") {
      console.warn("[reviews] Places API response incomplete (no reviews/rating/count)");
      return null;
    }

    return {
      reviews,
      overallRating: data.rating,
      reviewCount: data.userRatingCount,
      googleReviewsUrl: data.googleMapsUri ?? "https://www.google.com/search?q=Bonet+Plumbing+LLC+Oviedo",
    };
  } catch (err) {
    console.error("[reviews] fetch failed:", err);
    return null;
  }
}

/** @param {string | undefined} isoString */
function formatMonthYear(isoString) {
  if (!isoString) return "Recent";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "Recent";
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}
