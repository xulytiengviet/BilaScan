# Cloudflare Pages for BilaScan

The existing repo xulytiengviet/BilaScan can be deployed with Cloudflare Pages Git integration. This repository does not create a Cloudflare account or reserve a pages.dev name.

## Dashboard configuration

1. Open https://dash.cloudflare.com/ → Workers & Pages.
2. Create application → Pages → Connect to Git (or Import existing Git repository).
3. Authorize the GitHub app for xulytiengviet/BilaScan.
4. Repository: xulytiengviet/BilaScan.
5. Project name: bilascan (only if available).
6. Production branch: main.
7. Framework preset: None.
8. Root directory: / (default).
9. Build command: node scripts/build-pages.mjs
10. Build output directory: dist
11. Environment variables: none.
12. Save and Deploy; confirm the actual pages.dev URL in Cloudflare dashboard.

## Offline validation

Run:
    node scripts/security-audit.mjs
    node scripts/build-pages.mjs

The build publishes only the HTML page, application JS, pinned CVNSS4 codec with license, a minimal 404, robots.txt and _headers with restrictive CSP. It does not publish .github, scripts, or development fixtures.

This is a read-only simulation (100 fake transactions, 16 mock wallets and 4 mock contracts), not a real Solana scanner. No RPC access, wallet connection, credential collection, secret key or Solang compilation.

Do not use changing a hostname to avoid investigating a Google Safe Browsing report. Resolve any content/security issue and request review in Search Console.

Official setup: https://developers.cloudflare.com/pages/get-started/git-integration/
Security headers: https://developers.cloudflare.com/pages/configuration/headers/
