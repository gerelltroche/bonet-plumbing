// Netlify Forms attributes on <form>. Netlify reads them at deploy time to
// detect the form; they're not standard HTML, so teach the type checker.
declare namespace astroHTML.JSX {
  interface FormHTMLAttributes {
    netlify?: boolean;
    "netlify-honeypot"?: string;
  }
}
