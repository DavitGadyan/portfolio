# davidgadyan.com

Bilingual (EN at `/`, ES at `/es/`) static portfolio for **David Gadyan — EXPERT-VETTED AI Engineer | Data Scientist | AI Agent | Generative AI | SaaS**, built with
Next.js 16 (App Router, static export), React 19, Tailwind CSS 4 and MDX content. Deployed to GitHub Pages.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server at http://localhost:3000 (images served un-optimised) |
| `npm run build` | Content parity check → `next build` (static export to `out/`) → image optimisation (WebP + blur) → `postbuild` (404.html, .nojekyll, CNAME, required files) → `verify-out` (lang, h1, canonical, hreflang, sitemap) |
| `npm run serve` | Serve `out/` at http://localhost:4173 |
| `npm run lint` / `npm run typecheck` / `npm test` | ESLint, `tsc --noEmit`, Vitest unit tests |
| `npm run test:e2e` | Playwright tests against `out/` (run `npm run build` first; first time `npx playwright install chromium`) |
| `npm run lh` | Mobile Lighthouse on the key URLs (needs Chrome) |
| `npm run check:bundle` | Gzip size of the home page JavaScript vs. budget |
| `node scripts/validate-content.mjs projects\|blog all` | Validate content files without building |
| `node scripts/make-share-cards.mjs` | Regenerate the EN/ES Open Graph share cards in `public/` |
- `node scripts/clean-portrait.mjs <in.png> <out.png> [preview-dir]` cleans a background-removed portrait (halo removal, light feather, trim, 1040 px, max PNG compression) before it goes into `assets/images/backgrounds/`.
- `node scripts/prepare-logos.mjs` turns the brand logos dropped into `assets/logos/` into trimmed 160 px PNGs under `public/logos/` (used by the capability graph) and fetches the few missing marks from Simple Icons (CC0). Brand marks belong to their respective owners.

## Environment variables

| Variable | On davidgadyan.com | While on github.io |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://davidgadyan.com` | `https://davitgadyan.github.io/portfolio` |
| `NEXT_PUBLIC_BASE_PATH` | *(empty)* | `/portfolio` |
| `CUSTOM_DOMAIN` | `davidgadyan.com` (writes `out/CNAME`) | *(empty)* |
| `VERIFY_STRICT_ES` | `1` once all Spanish content is translated | *(empty)* |

Locally, copy `.env.example` to `.env.local`. In GitHub, set them as **repository variables** (`Settings → Secrets and
variables → Actions → Variables`): `SITE_URL`, `BASE_PATH`, `CUSTOM_DOMAIN`, `VERIFY_STRICT_ES`.

## Deploying

1. `Settings → Pages → Source: GitHub Actions`. Every push to `main` runs `.github/workflows/pages.yml`.
2. **Interim (github.io URL):** variables `BASE_PATH=/portfolio`, `SITE_URL=https://davitgadyan.github.io/portfolio`, `CUSTOM_DOMAIN` empty.
3. **Cut-over to davidgadyan.com** (after the Namecheap transfer):
   - DNS at Namecheap: `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
     (and `AAAA` → `2606:50c0:8000::153`, `8001::153`, `8002::153`, `8003::153`); `CNAME` for `www` → `davitgadyan.github.io`.
   - `Settings → Pages → Custom domain: davidgadyan.com`, wait for the DNS check, tick **Enforce HTTPS**.
   - Set variables `BASE_PATH` = *(empty)*, `SITE_URL=https://davidgadyan.com`, `CUSTOM_DOMAIN=davidgadyan.com`; re-run the workflow.
   - Optional: add meta-refresh/canonical stubs in the old `portfolio_app` repo pointing at the new domain.

## Content

```
content/en/projects/<slug>.mdx   full front matter (source of truth for date, cover, categories, stack, links, featured, order)
content/es/projects/<slug>.mdx   ONLY title, coverAlt, summary, description, outcomes + Spanish body
content/en/blog/<slug>.mdx       posts (date, lastmod, cover, tags, articleSection, author + localized fields)
content/es/blog/<slug>.mdx       ONLY title, description, summary, coverAlt, about, takeaways, faq + Spanish body
content/{en,es}/pages/           cookies.mdx, privacy.mdx
data/*.ts                        services, categories, capability map, skills, experience, testimonials, FAQ, fun facts, site
messages/{en,es}.json            UI strings
```

Rules enforced at build time (`lib/content/validate.ts`): same slug in both locales; ES files never redeclare invariants;
descriptions 100–185 chars (projects) / 80–230 (posts); 1–3 categories from `data/categories.ts`; all six `stack` layers
present; ISO dates; bodies start at `##`; no raw `{`, `}` or `<` in prose (use `&lt;`). Embeds: `<YouTube id="…" />`,
`<Loom id="…" />` (click-to-load facades). Cover images live in `public/images/portfolio/` and are optimised at build time.

## Architecture notes

- Two root layouts: `app/(en)` renders English at `/`, `app/[locale]` renders Spanish at `/es/`. No middleware (static export).
- Images: `next-image-export-optimizer` generates WebP variants + blur placeholders at build time; everything goes through `components/ui/Img.tsx`.
- Consent: Google Consent Mode v2 defaults are set by an inline head script; gtag.js loads **only after "Accept all cookies"**
  (`components/analytics/Analytics.tsx`). Choice stored in the `dg_consent` cookie + localStorage for 12 months.
- Tracking: `lib/track.ts` (delegated clicks, Calendly messages, gclid capture, `generate_lead` dedup), consent-gated.
- Third parties load only on interaction: Calendly (button), YouTube/Loom (play), Formspree (submit).
- SEO: per-page canonical + hreflang (en/es/x-default), JSON-LD graph (`lib/seo/jsonld.ts`), `sitemap.xml` with alternates,
  `robots.txt` allowing AI crawlers, `llms.txt` / `llms-full.txt` in both languages (route handlers).
