# SEO & analytics playbook — Hi-Tech uPVC

On-site technical SEO lives in the Next.js app. Rankings also need Google Business Profile, citations, and backlinks. This doc covers both.

---

## 1. Unblock “Data collection isn’t active” (GTM / GA4)

The site already loads container **`GTM-5TP729V4`** and pushes SPA `page_view` events (`page_path`, `page_title`, `page_location`). Code alone does not activate GA4.

### GTM (tagmanager.google.com)

1. Open container **GTM-5TP729V4**.
2. **Tags → New → Google Tag** (GA4 Configuration) with the Measurement ID from GA4 → Admin → Data streams.
3. **Trigger**: Custom Event, event name **`page_view`** (matches `lib/analytics.ts`).
4. Map event parameters: `page_path`, `page_title`, `page_location`.
5. Turn **off** a duplicate GA4 “All Pages” page_view if you use only the SPA custom event.
6. Optional conversion tags: `click_whatsapp`, `click_quote`, `generate_lead`.
7. **Submit → Publish** the container (unpublished workspace = no collection).

### Verify

1. GTM **Preview** on the production URL — confirm `page_view` and the GA4 tag fire.
2. GA4 **Reports → Realtime** while clicking internal links (disable ad blockers).
3. Search Console: verify the property, submit `https://YOUR_DOMAIN/sitemap.xml`, link the property in GA4.

### Env (Vercel)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical production origin (e.g. `https://www.example.com`) |
| `NEXT_PUBLIC_GTM_ID` | Override GTM id (default `GTM-5TP729V4`) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console HTML-tag token |

---

## 2. Target keywords (entity + local)

Brand spellings live in `BRAND_ALIASES` (`lib/seo.ts`) and feed Organization `alternateName`. Every page's keywords pass through `mergeKeywords()`, which adds the core brand terms.

| Page | Primary search intent |
|------|----------------------|
| `/` | uPVC windows & doors Kathmandu, Nepal; Hi-Tech / Hitech uPVC |
| `/products/windows` | uPVC windows Kathmandu / Nepal / price |
| `/products/doors` | uPVC doors Kathmandu / Nepal / price |
| `/products/panels` | uPVC wall panels Kathmandu / Nepal |
| `/products/*/[slug]` | `<product> uPVC <type>, Kathmandu` |
| `/service-areas/*` | uPVC windows & doors in Kathmandu / Lalitpur / Bhaktapur / Pokhara |
| `/why-upvc` | uPVC vs wood / aluminium, best windows for Kathmandu |
| `/guides` + `/guides/[slug]` | Long-tail Q&A: price, vs aluminium/wood, climate, lifespan, door choice |
| `/get-quote` | uPVC window / door price Nepal |
| `/about` | uPVC manufacturer / company Kathmandu; Hi-Tech Group Nepal |

Titles use the `%s | Hi-Tech uPVC` template — keep the page part under ~45 characters. Keep **uPVC** spelling consistent in titles, schema, and visible copy; misspellings (Hitech, High Tech) belong only in `alternateName`, keywords, and the footer brand line.

---

## 3. Google Business Profile & NAP

1. Claim / optimize GBP for **Head Office & Factory — Bihani Chowk, Tarakeshwar**.
2. Name, address, phone must match [data/company.json](../data/company.json) and on-page LocalBusiness JSON-LD.
3. Categories: window installation service / door supplier (as available).
4. Photos: factory, installs, finished openings; link website + WhatsApp.

---

## 4. Citations & social

- Instagram bio (@hitechgroupnepal): same website URL + primary phone.
- Nepal directories / maps listings: identical NAP.
- Prefer one canonical domain (set `NEXT_PUBLIC_SITE_URL`); redirect www ↔ apex.

---

## 5. Backlinks (quality over volume)

- Architect / contractor project features.
- Supplier or industry association mentions.
- Local news or home-improvement features with Tarakeshwar / Kathmandu angle.
- Avoid paid link farms and irrelevant directories.

---

## 6. Internal linking

Every major page should reach:

- `/products`, `/why-upvc`, `/service-areas/kathmandu`, `/service-areas/pokhara`, `/get-quote`, `/contact`

Footer and about/contact already surface service areas after deploy.

---

## 7. Validation checklist

- [ ] Lighthouse SEO ≥ 90 on `/`, `/products/windows`, `/contact`
- [ ] Rich Results Test: home LocalBusiness, product Product, contact ContactPage
- [ ] `/sitemap.xml` includes `/gallery` and `/service-areas/*`
- [ ] `/llms.txt` returns 200 on production
- [ ] GA4 Realtime after GTM publish
