// Single source of truth for review data across the whole site.
//
// Every page that renders <Reviews /> awaits getReviews(), which is memoized so
// the Places API is hit exactly once per build. That guarantees the rating,
// review count and review cards are identical on every page of a given deploy.
//
// Required env vars on Netlify:
//   GOOGLE_PLACES_API_KEY  — Places API key from Google Cloud
//   GOOGLE_PLACE_ID        — Place ID for Bonet Plumbing
//
// If either is missing or the API call fails, the build falls back to
// src/data/reviews-snapshot.json — the last known-good API result — so a
// degraded build still shows real reviews and the real count instead of
// sample data. Refresh the snapshot with `npm run reviews:snapshot`.

import snapshot from "../data/reviews-snapshot.json";
import { fetchPlaceReviews } from "./places.mjs";

export type Review = {
  author: string;
  rating: number;
  text: string;
  date: string;
  location?: string;
  reviewUrl?: string;
  avatarUrl?: string;
};

export type ReviewsData = {
  reviews: Review[];
  overallRating: number;
  reviewCount: number;
  googleReviewsUrl: string;
};

const SNAPSHOT: ReviewsData = {
  reviews: snapshot.reviews,
  overallRating: snapshot.overallRating,
  reviewCount: snapshot.reviewCount,
  googleReviewsUrl: snapshot.googleReviewsUrl,
};

let cached: Promise<ReviewsData> | null = null;

export function getReviews(): Promise<ReviewsData> {
  if (!cached) cached = loadReviews();
  return cached;
}

async function loadReviews(): Promise<ReviewsData> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    console.warn(
      `[reviews] GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID not set — using snapshot from ${snapshot.fetchedAt}`
    );
    return SNAPSHOT;
  }

  const live = await fetchPlaceReviews({ apiKey, placeId });
  if (!live) {
    console.warn(`[reviews] falling back to snapshot from ${snapshot.fetchedAt}`);
    return SNAPSHOT;
  }
  return live;
}
