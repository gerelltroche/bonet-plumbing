// Temporary closure (vacation, etc.). The one place to set it.
//
// While active, every page shows a banner (ClosureBanner), the quote forms and
// success page swap "usually within the hour" for "when we reopen", and the
// Plumber JSON-LD gets specialOpeningHoursSpecification marking the days closed.
// Mirror the same dates in the Google Business Profile's special hours.
//
// It turns itself off: Layout ships a tiny inline script that checks the
// visitor's clock against these instants, so the banner disappears at
// `reopensAt` even if no deploy happens. Set CLOSURE to null afterwards to
// remove the leftovers from the HTML.
//
// Instants carry the Eastern offset (EST is -05:00, EDT is -04:00).

export interface Closure {
  /** First moment closed. */
  startsAt: string;
  /** First moment open again. */
  reopensAt: string;
}

export const CLOSURE: Closure | null = {
  startsAt: "2026-11-04T00:00:00-05:00",
  reopensAt: "2026-11-16T00:00:00-05:00",
};

const TZ = "America/New_York";

/** True when `now` falls inside the closure. */
export function isClosed(closure: Closure | null, now = new Date()): boolean {
  if (!closure) return false;
  const t = now.getTime();
  return t >= Date.parse(closure.startsAt) && t < Date.parse(closure.reopensAt);
}

/** "Monday, November 16" / "lunes 16 de noviembre". */
export function formatReopen(closure: Closure, locale: "en" | "es"): string {
  const s = new Intl.DateTimeFormat(locale === "es" ? "es-US" : "en-US", {
    timeZone: TZ,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(closure.reopensAt));
  return locale === "es" ? s.replace(",", "") : s;
}

/** YYYY-MM-DD in Eastern time, for schema.org validFrom / validThrough. */
export function easternDate(instant: string | number): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(
    new Date(instant),
  );
}
