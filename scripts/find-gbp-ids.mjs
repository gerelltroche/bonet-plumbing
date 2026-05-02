#!/usr/bin/env node
// One-time helper: lists your Google Business Profile accounts and locations
// so you can grab GBP_ACCOUNT_ID and GBP_LOCATION_ID for the env vars.
//
// Usage:
//   GBP_CLIENT_ID=... GBP_CLIENT_SECRET=... GBP_REFRESH_TOKEN=... \
//     node scripts/find-gbp-ids.mjs

const { GBP_CLIENT_ID, GBP_CLIENT_SECRET, GBP_REFRESH_TOKEN } = process.env;

if (!GBP_CLIENT_ID || !GBP_CLIENT_SECRET || !GBP_REFRESH_TOKEN) {
  console.error(
    "Missing one of GBP_CLIENT_ID, GBP_CLIENT_SECRET, GBP_REFRESH_TOKEN"
  );
  process.exit(1);
}

async function getAccessToken() {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GBP_CLIENT_ID,
      client_secret: GBP_CLIENT_SECRET,
      refresh_token: GBP_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) {
    console.error("Token refresh failed:", res.status, await res.text());
    process.exit(1);
  }
  const data = await res.json();
  return data.access_token;
}

const token = await getAccessToken();

// Accounts
const accountsRes = await fetch(
  "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
  { headers: { Authorization: `Bearer ${token}` } }
);
if (!accountsRes.ok) {
  console.error(
    "List accounts failed:",
    accountsRes.status,
    await accountsRes.text()
  );
  process.exit(1);
}
const { accounts = [] } = await accountsRes.json();

if (accounts.length === 0) {
  console.error("No accounts found on this Google account.");
  process.exit(1);
}

console.log("\nAccounts + locations:");
for (const acct of accounts) {
  const accountId = String(acct.name).split("/").pop();
  console.log(`\n  ${acct.accountName ?? "(unnamed)"}`);
  console.log(`    GBP_ACCOUNT_ID=${accountId}`);

  const locsUrl = new URL(
    `https://mybusinessbusinessinformation.googleapis.com/v1/${acct.name}/locations`
  );
  locsUrl.searchParams.set("readMask", "name,title,storefrontAddress");
  locsUrl.searchParams.set("pageSize", "100");

  const locsRes = await fetch(locsUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!locsRes.ok) {
    console.log(
      `    [list locations failed: ${locsRes.status} ${await locsRes.text()}]`
    );
    continue;
  }
  const { locations = [] } = await locsRes.json();
  for (const loc of locations) {
    const locationId = String(loc.name).split("/").pop();
    const addr = loc.storefrontAddress?.locality
      ? ` — ${loc.storefrontAddress.locality}`
      : "";
    console.log(`    └── ${loc.title ?? "(unnamed)"}${addr}`);
    console.log(`        GBP_LOCATION_ID=${locationId}`);
  }
}
