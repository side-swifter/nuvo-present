# Deploying

The site is plain static files served by **Cloudflare Workers Static Assets** at `present.getnuvo.net`, as a separate project from the main getnuvo.net site.

```bash
export CLOUDFLARE_ACCOUNT_ID=<the account that owns getnuvo.net>
npx wrangler login          # once
npx wrangler deploy         # from the repo root
```

`wrangler.jsonc` points at `./presentation` and attaches the custom domain `present.getnuvo.net`; Cloudflare creates the DNS record and certificate.

## Caching

`presentation/_headers` controls it:

- fonts, videos and press images: cached for a year (`immutable`). If you replace one of these files, **rename it** (or add a query string where it is referenced), otherwise browsers keep the old copy.
- `assets/settings.js`: `no-cache`. The pages also reference it with `?v=N`; bump `N` in `index.html` and `rtp-keynote.html` when you change it.
- team and logo images: 1 hour.
- Everything is served with `X-Robots-Tag: noindex, nofollow`, so search engines do not list it.

HTML files are revalidated on each load, so changes to the pages show up after a normal refresh.

## Checks after deploying

```bash
for u in "" rtp-keynote assets/settings.js assets/video/phone-pull.webm; do curl -s -o /dev/null -w "$u %{http_code}\n" https://present.getnuvo.net/$u; done
```

Then open the picker in a private window and run Practice for a minute.
