// Single place for the business contact details used by every CTA.
export const PHONE_DISPLAY = "407-734-3968";
export const PHONE_HREF = "tel:+14077343968";
const SMS_NUMBER = "+14077343968";

/** BBB Business Profile (accredited since Aug 2026). Also in the JSON-LD sameAs. */
export const BBB_PROFILE_URL = "https://www.bbb.org/us/fl/orlando/profile/plumber/bonet-plumbing-0733-235982501";

// `?&body=` is the cross-platform form: older iOS wants `&`, Android wants `?`.
// The body text comes from the locale dictionary (ui.sms.body).
export function smsHref(body: string): string {
  return `sms:${SMS_NUMBER}?&body=${encodeURIComponent(body)}`;
}
