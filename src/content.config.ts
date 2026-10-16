// Content collections. Validated at build time: a city file missing any field
// (in either language) fails the build.
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// One language's copy for a city page. EN and ES use the same schema, so a
// field added for one must be added for the other.
const cityCopy = z.object({
  title: z.string(),
  description: z.string(),
  /** Last breadcrumb item, e.g. "Oviedo Plumber". */
  breadcrumb: z.string(),
  /** Display name used in the section headings, e.g. "Alafaya & UCF". */
  place: z.string(),
  h1: z.string(),
  intro: z.string(),
  /** "What We See Most" paragraphs: the local, city-specific content. */
  localIssues: z.array(z.string()).min(1),
  /** Overrides ui.city.ctaHeading(place). */
  ctaHeading: z.string().optional(),
  /** Middle "What You Get" bullet; the other two are shared. */
  sameDayBullet: z.string(),
  /** Overrides ui.city.nearbyHeading. */
  nearbyHeading: z.string().optional(),
  /** Link text overrides for `nearby`, by city id. Default: the footer's area name. */
  nearbyLabels: z.record(z.string(), z.string()).optional(),
});

// src/content/cities/<id>.yaml → /<id>-plumber/ and /es/<id>-plumber/.
// Avalon Park isn't here: its page has its own body (see avalon-park-plumber.astro).
const cities = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/cities" }),
  schema: z.object({
    geo: z.object({ placename: z.string(), lat: z.number(), lng: z.number() }),
    /** City ids for the "We Also Serve" links, in order. */
    nearby: z.array(z.string()).min(1),
    en: cityCopy,
    es: cityCopy,
  }),
});

export const collections = { cities };
