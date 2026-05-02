// Google Places API → reviews fetcher.
//
// Runs at build time (Astro frontmatter). Required env vars on Netlify:
//   GOOGLE_PLACES_API_KEY  — Places API key from Google Cloud
//   GOOGLE_PLACE_ID        — Place ID for Bonet Plumbing
//
// If either is missing, the placeholder data is returned so builds never fail.

export type Review = {
  author: string;
  rating: number;
  text: string;
  date: string;
  location?: string;
  reviewUrl?: string;
};

export type ReviewsData = {
  reviews: Review[];
  overallRating: number;
  reviewCount: number;
  googleReviewsUrl: string;
};

const PLACEHOLDER: ReviewsData = {
  overallRating: 5.0,
  reviewCount: 5,
  googleReviewsUrl: "https://www.google.com/search?q=Bonet+Plumbing+LLC+Oviedo",
  reviews: [
    {
      author: "Sample Reviewer A",
      rating: 5,
      text: "Leo showed up the same afternoon I called, found the leak in 10 minutes, and had it patched up before dinner. Honest pricing, clean work — exactly what you want from a plumber.",
      date: "April 2026",
      location: "Oviedo, FL",
    },
    {
      author: "Sample Reviewer B",
      rating: 5,
      text: "Replaced my water heater the next morning. Walked me through the options, no pressure to upgrade. Will absolutely call Bonet again.",
      date: "March 2026",
      location: "Winter Springs, FL",
    },
    {
      author: "Sample Reviewer C",
      rating: 5,
      text: "Clogged main line on a Sunday and Leo still picked up the phone. Fair price, fast fix, and he cleaned up before he left. Highly recommend.",
      date: "March 2026",
      location: "East Orlando, FL",
    },
  ],
};

const MAX_REVIEWS = 3;

// Memoize the fetch so the API is hit once per build, no matter how many
// pages render the Reviews component.
let cached: Promise<ReviewsData> | null = null;

export function getReviews(): Promise<ReviewsData> {
  if (!cached) cached = fetchReviews();
  return cached;
}

async function fetchReviews(): Promise<ReviewsData> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    console.warn(
      "[reviews] GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID not set — using placeholder reviews"
    );
    return PLACEHOLDER;
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;
    const res = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "displayName,rating,userRatingCount,reviews,googleMapsUri",
      },
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[reviews] Places API ${res.status}: ${body}`);
      return PLACEHOLDER;
    }

    const data = (await res.json()) as PlacesResponse;

    const reviews: Review[] = (data.reviews ?? [])
      .filter((r) => (r.text?.text ?? r.originalText?.text ?? "").trim().length > 0)
      .slice(0, MAX_REVIEWS)
      .map((r) => ({
        author: r.authorAttribution?.displayName ?? "Google reviewer",
        rating: r.rating ?? 5,
        text: r.text?.text ?? r.originalText?.text ?? "",
        date: formatMonthYear(r.publishTime),
        reviewUrl: r.googleMapsUri,
      }));

    if (reviews.length === 0) {
      console.warn("[reviews] Places API returned 0 reviews — using placeholder");
      return PLACEHOLDER;
    }

    return {
      reviews,
      overallRating: data.rating ?? PLACEHOLDER.overallRating,
      reviewCount: data.userRatingCount ?? PLACEHOLDER.reviewCount,
      googleReviewsUrl: data.googleMapsUri ?? PLACEHOLDER.googleReviewsUrl,
    };
  } catch (err) {
    console.error("[reviews] fetch failed:", err);
    return PLACEHOLDER;
  }
}

function formatMonthYear(isoString?: string): string {
  if (!isoString) return "Recent";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "Recent";
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}

// Subset of the Places API (v1) response we use.
type PlacesResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: Array<{
    rating?: number;
    publishTime?: string;
    text?: { text?: string };
    originalText?: { text?: string };
    authorAttribution?: { displayName?: string };
    googleMapsUri?: string;
  }>;
};
