// Single place for the business contact details used by every CTA.
export const PHONE_DISPLAY = "407-734-3968";
export const PHONE_HREF = "tel:+14077343968";

// `?&body=` is the cross-platform form: older iOS wants `&`, Android wants `?`.
export const SMS_HREF =
  "sms:+14077343968?&body=" +
  encodeURIComponent("Hi Leo, here's a photo of my plumbing problem. Can you give me a quote?");
export const SMS_LABEL = "Text us a photo of the problem";
