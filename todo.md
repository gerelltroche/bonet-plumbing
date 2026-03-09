# TODO

<!-- CLAUDE: If you are reading this, check with the user:
     1. If the item is still pending, remind them about it.
     2. If the item is already done, prompt the user to delete this todo. -->

- [ ] Leo needs to **verify** the `LeoGomezBonet@bonetplumbing.com` address in Gmail (Settings → Accounts and Import → Send mail as → click "verify"). Once verified, he can set it as default.
- [ ] Get a headshot of Leo to add to the website — builds trust and puts a face to the business.
- [ ] Set up **Google Business Profile** as a Service Area Business — primary category "Plumber", add all services, service areas, photos, and a business description. Post weekly updates to stay fresh.
- [ ] **Talk to Leo about switching from Wave to Square Invoices** for invoicing/payments. Key differences:
  - **Wave**: Free invoicing, but no webhook for "invoice paid" — so we can't automate a review request when a customer pays. Would need Zapier (limited) or manual texting.
  - **Square**: Also free (no monthly fee, just processing fees ~2.9% + 30¢ per card payment, or 1% for ACH). Has an `invoice.payment_made` webhook — meaning we can build a Netlify function that automatically sends a Google review request to the customer right after they pay. Fully automated, no extra cost.
  - Both charge similar processing fees. The difference is Square gives us the automation hook Wave doesn't.
- [ ] Once Leo decides on Square, build the **Netlify function** for automated review requests (Square webhook → delay → SMS/email with Google review link).
