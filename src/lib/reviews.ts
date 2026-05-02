// Google reviews fetcher.
//
// Build-time data flow:
//   1. Try Google Business Profile API (returns all reviews) via OAuth refresh token.
//   2. Fetch Places API in parallel — its "most relevant" 5 are used to reorder
//      the GBP results so the Places-favored ones appear first.
//   3. If GBP fails, fall back to Places API alone (5 reviews).
//   4. If both fail, fall back to placeholder data so the build never breaks.
//
// Required env vars (set on Netlify):
//   GOOGLE_PLACES_API_KEY   Places API (New) key
//   GOOGLE_PLACE_ID         Place ID, "ChIJ..." form
//   GBP_CLIENT_ID           OAuth 2.0 client ID
//   GBP_CLIENT_SECRET       OAuth 2.0 client secret
//   GBP_REFRESH_TOKEN       Long-lived refresh token (one-time generated)
//   GBP_ACCOUNT_ID          Numeric account ID (digits only)
//   GBP_LOCATION_ID         Numeric location ID (digits only)

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

let cached: Promise<ReviewsData> | null = null;

export function getReviews(): Promise<ReviewsData> {
  if (!cached) cached = fetchReviews();
  return cached;
}

async function fetchReviews(): Promise<ReviewsData> {
  const [gbpResult, placesResult] = await Promise.all([
    fetchGbpReviews().catch((err) => {
      console.error("[reviews] GBP fetch failed:", err);
      return null;
    }),
    fetchPlacesReviews().catch((err) => {
      console.error("[reviews] Places fetch failed:", err);
      return null;
    }),
  ]);

  if (gbpResult && gbpResult.reviews.length > 0) {
    const reordered = placesResult
      ? reorderByPlaces(gbpResult.reviews, placesResult.reviews)
      : gbpResult.reviews;
    return {
      reviews: reordered,
      overallRating: gbpResult.overallRating || placesResult?.overallRating || 5,
      reviewCount: gbpResult.reviewCount || reordered.length,
      googleReviewsUrl:
        placesResult?.googleReviewsUrl ?? PLACEHOLDER.googleReviewsUrl,
    };
  }

  if (placesResult && placesResult.reviews.length > 0) {
    return placesResult;
  }

  console.warn("[reviews] no API data available — using placeholder");
  return PLACEHOLDER;
}

function makeMatchKey(r: Review): string {
  return `${r.author.toLowerCase().trim()}|${r.text.slice(0, 80).toLowerCase().replace(/\s+/g, " ").trim()}`;
}

function reorderByPlaces(all: Review[], featured: Review[]): Review[] {
  const featuredKeys = new Set<string>();
  const head: Review[] = [];

  for (const f of featured) {
    const key = makeMatchKey(f);
    const match = all.find((r) => makeMatchKey(r) === key);
    if (match && !featuredKeys.has(key)) {
      head.push(match);
      featuredKeys.add(key);
    }
  }

  const tail = all.filter((r) => !featuredKeys.has(makeMatchKey(r)));
  return [...head, ...tail];
}

// ---------------------------------------------------------------------------
// Google Business Profile API
// ---------------------------------------------------------------------------

const STAR_RATING_MAP: Record<string, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

async function fetchGbpReviews(): Promise<ReviewsData | null> {
  const clientId = process.env.GBP_CLIENT_ID;
  const clientSecret = process.env.GBP_CLIENT_SECRET;
  const refreshToken = process.env.GBP_REFRESH_TOKEN;
  const accountId = process.env.GBP_ACCOUNT_ID;
  const locationId = process.env.GBP_LOCATION_ID;

  if (!clientId || !clientSecret || !refreshToken || !accountId || !locationId) {
    console.warn("[reviews] GBP env vars incomplete — skipping GBP fetch");
    return null;
  }

  const accessToken = await refreshAccessToken(clientId, clientSecret, refreshToken);

  const all: GbpReview[] = [];
  let pageToken: string | undefined;
  let averageRating: number | undefined;
  let totalReviewCount: number | undefined;

  do {
    const url = new URL(
      `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews`
    );
    url.searchParams.set("pageSize", "50");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      throw new Error(
        `GBP reviews list ${res.status}: ${(await res.text()).slice(0, 200)}`
      );
    }

    const data = (await res.json()) as GbpReviewsResponse;
    all.push(...(data.reviews ?? []));
    averageRating = data.averageRating ?? averageRating;
    totalReviewCount = data.totalReviewCount ?? totalReviewCount;
    pageToken = data.nextPageToken;
  } while (pageToken);

  const reviews = all
    .filter((r) => (r.comment ?? "").trim().length > 0)
    .map(gbpToReview);

  return {
    reviews,
    overallRating: averageRating ?? 5,
    reviewCount: totalReviewCount ?? reviews.length,
    googleReviewsUrl: PLACEHOLDER.googleReviewsUrl,
  };
}

async function refreshAccessToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string
): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    throw new Error(
      `Token refresh ${res.status}: ${(await res.text()).slice(0, 200)}`
    );
  }

  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("Token refresh: no access_token returned");
  return data.access_token;
}

function gbpToReview(r: GbpReview): Review {
  return {
    author: r.reviewer?.displayName ?? "Google reviewer",
    rating: STAR_RATING_MAP[r.starRating ?? "FIVE"] ?? 5,
    text: (r.comment ?? "").trim(),
    date: formatMonthYear(r.createTime),
  };
}

type GbpReview = {
  reviewId?: string;
  reviewer?: { displayName?: string; profilePhotoUrl?: string };
  starRating?: keyof typeof STAR_RATING_MAP | "STAR_RATING_UNSPECIFIED";
  comment?: string;
  createTime?: string;
  updateTime?: string;
};

type GbpReviewsResponse = {
  reviews?: GbpReview[];
  averageRating?: number;
  totalReviewCount?: number;
  nextPageToken?: string;
};

// ---------------------------------------------------------------------------
// Places API (New) — used as fallback and to seed relevance ordering
// ---------------------------------------------------------------------------

async function fetchPlacesReviews(): Promise<ReviewsData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    console.warn("[reviews] Places env vars missing — skipping Places fetch");
    return null;
  }

  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;
  const res = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "displayName,rating,userRatingCount,reviews,googleMapsUri",
    },
  });

  if (!res.ok) {
    throw new Error(
      `Places API ${res.status}: ${(await res.text()).slice(0, 200)}`
    );
  }

  const data = (await res.json()) as PlacesResponse;

  const reviews: Review[] = (data.reviews ?? [])
    .filter(
      (r) => (r.text?.text ?? r.originalText?.text ?? "").trim().length > 0
    )
    .map((r) => ({
      author: r.authorAttribution?.displayName ?? "Google reviewer",
      rating: r.rating ?? 5,
      text: r.text?.text ?? r.originalText?.text ?? "",
      date: formatMonthYear(r.publishTime),
      reviewUrl: r.googleMapsUri,
    }));

  if (reviews.length === 0) return null;

  return {
    reviews,
    overallRating: data.rating ?? 5,
    reviewCount: data.userRatingCount ?? reviews.length,
    googleReviewsUrl: data.googleMapsUri ?? PLACEHOLDER.googleReviewsUrl,
  };
}

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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatMonthYear(isoString?: string): string {
  if (!isoString) return "Recent";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "Recent";
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}
