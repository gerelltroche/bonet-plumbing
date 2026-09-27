// Single source of truth for review data across the whole site.
//
// Everything that shows a rating or review count — the <Reviews /> section on
// every page and the AggregateRating in the organization JSON-LD emitted by
// Layout.astro — reads from src/data/reviews.json through this module. The
// build never calls the Places API, so every page of a deploy shows the same
// numbers and a change in the count is visible in a diff.
//
// Refresh the file from Google with `npm run reviews:refresh` (needs
// GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID in .env), then commit it.

import data from "../data/reviews.json";

export type Review = {
  author: string;
  rating: number;
  /** Language the reviewer wrote in ("en", "es", ...). */
  lang: string;
  /** Text by language: `text[lang]` is the original, other keys are Google's translation. */
  text: Record<string, string>;
  /** ISO date (YYYY-MM-DD) the review was posted. */
  publishedAt: string;
  location?: string;
  reviewUrl?: string;
  avatarUrl?: string;
};

export type ReviewsData = {
  reviews: Review[];
  overallRating: number;
  reviewCount: number;
  googleReviewsUrl: string;
  /** ISO date the file was last refreshed from Google. */
  fetchedAt: string;
};

export const reviewsData: ReviewsData = {
  reviews: data.reviews,
  overallRating: data.overallRating,
  reviewCount: data.reviewCount,
  googleReviewsUrl: data.googleReviewsUrl,
  fetchedAt: data.fetchedAt,
};

/** Kept async-shaped so existing `await getReviews()` call sites keep working. */
export function getReviews(): Promise<ReviewsData> {
  return Promise.resolve(reviewsData);
}
