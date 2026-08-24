// BBB Accredited Business seal.
//
// The seal is BBB's trademark. Only an accredited (dues-paying) business may
// display it, and only through the snippet BBB generates for that specific
// business — a hand-made lookalike is a false trust claim. So nothing renders
// until the values below are supplied, and the site never shows an
// accreditation it doesn't actually hold.
//
// To turn the seal on, set these on Netlify (Site settings → Environment
// variables) and redeploy — no code change needed:
//
//   BBB_PROFILE_URL      — the href from BBB's seal snippet (ends in #sealclick)
//   BBB_SEAL_IMAGE_URL   — the <img src> from that snippet (seal-*.bbb.org/…png)
//   BBB_ACCREDITED_SINCE — optional, the year from the BBB profile ("2026")
//   BBB_SEAL_WIDTH       — optional, seal image width in px  (default 200)
//   BBB_SEAL_HEIGHT      — optional, seal image height in px (default 42)
//
// The snippet lives behind the BBB Business Login → "Get Your BBB Seal". Copy
// the two URLs out of it rather than guessing — the seal image path encodes the
// business ID, and a wrong one renders a broken image.

export type BbbAccreditation = {
  profileUrl: string;
  sealImageUrl: string;
  accreditedSince?: string;
  sealWidth: number;
  sealHeight: number;
};

const DEFAULT_SEAL_WIDTH = 200;
const DEFAULT_SEAL_HEIGHT = 42;

function toPx(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const profileUrl = process.env.BBB_PROFILE_URL?.trim();
const sealImageUrl = process.env.BBB_SEAL_IMAGE_URL?.trim();
const accreditedSince = process.env.BBB_ACCREDITED_SINCE?.trim();

// Both URLs are required — a seal image with no profile link behind it is not
// the badge BBB asks accredited businesses to display.
export const bbb: BbbAccreditation | null =
  profileUrl && sealImageUrl
    ? {
        profileUrl,
        sealImageUrl,
        accreditedSince: accreditedSince || undefined,
        sealWidth: toPx(process.env.BBB_SEAL_WIDTH, DEFAULT_SEAL_WIDTH),
        sealHeight: toPx(process.env.BBB_SEAL_HEIGHT, DEFAULT_SEAL_HEIGHT),
      }
    : null;

// The #sealclick fragment is BBB's click-tracking anchor. Schema.org sameAs
// wants the plain profile URL.
export const bbbProfileUrlForSchema = bbb
  ? bbb.profileUrl.replace(/#sealclick\/?$/, "")
  : null;
