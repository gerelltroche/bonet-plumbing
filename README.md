# Bonet Plumbing

Marketing site for Bonet Plumbing LLC (bonetplumbing.com): a static Astro 7 +
Tailwind v4 site, hosted on Netlify, in English and Spanish.

## Commands

Requires Node 22.12+ (pinned in `.nvmrc`).

| Command                   | Does                                                         |
| :------------------------ | :----------------------------------------------------------- |
| `npm install`             | Install dependencies                                         |
| `npm run dev`             | Dev server at `localhost:4321`                               |
| `npm run build`           | `astro check` (types) then build to `dist/`; Netlify runs this |
| `npm run preview`         | Serve the built `dist/` locally                              |
| `npm run reviews:refresh` | Pull Google reviews into `src/data/reviews.json` (see below) |

Pushing to `main` deploys. A type error fails the build, and so the deploy.

## How the site fits together

**Pages.** One file per URL in `src/pages/`. The site sells high-ticket
residential work only: two service pages (`repiping`, `water-heater-services`)
and six city pages (`*-plumber`). Everything else that used to exist is 301'd
to the closest kept page in `netlify.toml`. Prefer improving these pages over
adding new ones.

**City pages.** Five of the six are data: the copy for each (both languages)
is in `src/content/cities/<city>.yaml`, and `src/components/city/CityPage.astro`
renders it. The page files are one-line wrappers. Edit the YAML to change a
city's copy; edit the template (or `ui.city` in `src/i18n/ui.ts` for the
shared strings and service cards) to change all of them at once. The schema
in `src/content.config.ts` fails the build if a city is missing a field in
either language. Avalon Park has its own water-heater-focused body, so its
page is hand-written, but it uses the same hero, "What You Get" box and
buttons from `src/components/city/`.

**English and Spanish.** English is unprefixed, Spanish lives under `/es/` with
the same slugs, so every page has a twin at `src/pages/es/<same path>`. Change
one, change the other. Shared components take their strings from
`src/i18n/ui.ts` (`es` is typed against `en`, so a missing key fails the
build) and pick the locale from the URL via `useI18n(Astro.url)` in
`src/i18n/index.ts`. Layout emits hreflang alternates for each pair.

**Layout and SEO.** `src/layouts/Layout.astro` owns the `<head>`: canonical,
hreflang, Open Graph, the `Plumber` JSON-LD (rating from reviews.json, service
areas from `src/data/service-areas.ts`), plus optional breadcrumb and FAQ
JSON-LD passed in as props. Conversion pages (`/success/`, `/quote/...`) are
noindexed and left out of the sitemap. Sitemap `<lastmod>` comes from each
page file's last commit (see `astro.config.mjs`).

**Contact details.** The phone number and SMS link live in
`src/lib/contact.ts`. Some older pages still hardcode the number.

**Quote forms.** Three forms post to the same Netlify Form, `contact`:
`ContactCTA` (full form on most pages), `QuickQuote` (short form on the home
page) and `QuotePage` (`/quote/`, the target for Google Business Profile and
ads). Netlify detects fields from the HTML, so every form carries the same
field set, with hidden empty inputs for the fields it doesn't show. Add a
field to all three or Netlify may drop it. Submissions land on `/success/` or
`/quote/thank-you/`.

**Analytics.** GA4 is set up in Layout. Key events: `call_click` and
`text_click` (any `tel:`/`sms:` tap) and `generate_lead` (fired by the success
page only after a real form submission).

**Reviews.** `src/data/reviews.json` is the only source of review data; the
Reviews section, the form rating line and the JSON-LD all read it through
`src/lib/reviews.ts`. The build never calls Google. A GitHub Action
(`.github/workflows/refresh-reviews.yml`) refreshes it every Monday and commits
only when something changed, which triggers a deploy. To run it locally, put
`GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` in `.env`.

**Fonts.** Inter (body) and Playfair Display (headings) are self-hosted with
the Astro Fonts API, configured in `astro.config.mjs` and mapped into Tailwind
in `src/styles/global.css`.

## Other notes

- `todo.md` tracks open business and site tasks.
- Netlify's "Pretty URLs" handles the trailing slash. Don't add a catch-all
  slash redirect in `netlify.toml`; the comment there explains the loop it
  causes.
