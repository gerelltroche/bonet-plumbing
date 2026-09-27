// Refresh src/data/reviews-snapshot.json from the Places API.
//
//   npm run reviews:snapshot
//
// Reads GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID from the environment (or
// .env via --env-file-if-exists in the npm script). Commit the result.
import { writeFile } from "node:fs/promises";
import { fetchPlaceReviews } from "../src/lib/places.mjs";

const apiKey = process.env.GOOGLE_PLACES_API_KEY;
const placeId = process.env.GOOGLE_PLACE_ID;
if (!apiKey || !placeId) {
  console.error("GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID must be set.");
  process.exit(1);
}

const data = await fetchPlaceReviews({ apiKey, placeId });
if (!data) process.exit(1);

const out = {
  _comment:
    "Last known-good Places API result. Used only when GOOGLE_PLACES_API_KEY/GOOGLE_PLACE_ID are missing or the API call fails, so a degraded build never publishes fake sample reviews or a wrong count. Refresh with: npm run reviews:snapshot",
  fetchedAt: new Date().toISOString().slice(0, 10),
  ...data,
};

const path = new URL("../src/data/reviews-snapshot.json", import.meta.url);
await writeFile(path, JSON.stringify(out, null, 2) + "\n");
console.log(`Wrote ${data.reviewCount} reviews (${data.overallRating}★) to src/data/reviews-snapshot.json`);
