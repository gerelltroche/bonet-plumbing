// The quote request form, shared by ContactCTA, QuickQuote and QuotePage.
//
// All three post to one Netlify form. Netlify learns that form's fields from
// the HTML at deploy time, so every <form name="contact"> must declare the
// same set; a field one form forgets can be silently dropped from
// submissions. <QuoteForm> enforces this: it emits a hidden empty input for
// each field below that the form doesn't show, and fails the build if a form
// shows a field that isn't listed here. To add a field, add it here first.
export const QUOTE_FORM_NAME = "contact";

export const QUOTE_FIELDS = ["name", "phone", "service", "language", "email", "message", "photo"] as const;
export type QuoteField = (typeof QUOTE_FIELDS)[number];

/** Classes for the forms' text inputs and selects. */
export const FIELD_CLASS =
  "w-full px-4 py-3 border border-border rounded-lg bg-background text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors";
