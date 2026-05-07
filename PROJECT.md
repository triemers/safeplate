# Safeplate — Project Outline

## What it does

Safeplate lets users build a personal allergen list and check product labels against it using photos, camera capture, or uploaded files. It works across **any product type** — food, shampoo, cleaning products, cosmetics, etc. No account required for the MVP — nothing is stored between sessions.

---

## Tech stack

| Layer | Tool |
|---|---|
| Frontend | React 19 + Vite |
| OCR (images) | Tesseract.js (client-side) |
| PDF parsing | pdfjs-dist (client-side) |
| Spreadsheet parsing | Native CSV parsing (no library — plain text split) |
| Docx parsing | mammoth.js (client-side) |
| HEIC conversion | heic2any (client-side, converts to JPEG before OCR) |
| Auth + DB (post-MVP) | Supabase |
| Hosting | Vercel |

---

## MVP scope (no login, no storage)

- User builds an allergen list via:
  - Typing allergens manually
  - Selecting from a common allergen list (FDA Big 9 + EU 14)
  - Uploading a file containing their allergy list (see supported formats below)
- User scans a product label (food, personal care, cleaning products, cosmetics, etc.) via:
  - File upload (JPG, PNG, WebP, HEIC, PDF)
  - "Open camera" button — uses `capture="environment"` to launch the device's native camera app directly, no in-browser camera UI needed
- Both paths (photo of full product OR photo of just the ingredients/components panel) use OCR on the label itself — no product database lookup
- App extracts text and flags any allergens from the user's list
- Everything lives in React state — cleared on page refresh, intentionally

### Supported allergen list upload formats

| Format | Library | Notes |
|---|---|---|
| Image (JPG, PNG, WebP) | Tesseract.js | OCR text extraction |
| Image (HEIC) | heic2any → Tesseract.js | Converted to JPEG client-side before OCR |
| PDF | pdfjs-dist | Text layer extraction; OCR fallback for scanned PDFs |
| Spreadsheet (CSV) | Native parsing | First column used; XLS/XLSX not supported — export as CSV from Excel or Google Sheets |
| Document (DOCX, TXT) | mammoth.js / plain text | Line-by-line extraction; .doc not supported |

After extraction, user always reviews and confirms the parsed allergens before they are added to their list (no silent auto-add).

---

## Post-MVP scope

### v2 (higher priority)
- User accounts (email magic link via Supabase Auth)
- Persistent allergen list stored per user
- Product scan history: save products as safe or flagged
- All user data private by default — enforced at DB layer via Supabase Row Level Security, not just app logic
- **Product search by name** — user searches a product database (e.g. Open Food Facts API) and selects from results; app retrieves the stored ingredient list rather than requiring a photo. Higher priority than alternate products.

### v3
- **Alternate product suggestions** — on an ALLERGENS FOUND result, suggest similar products that don't contain the flagged allergens. Requires a product database with allergen data.

---

## Security & privacy considerations

### Allergen list uploads — what we extract and what we discard

- **Only allergen names are extracted from uploaded files.** No other content (names, dates, doctor notes, medical record numbers, insurance info) is parsed, stored, or transmitted.
- **Uploaded files are never saved.** The file object is read into memory, parsed, and then released. No copy is written to disk, localStorage, or any server.
- **All parsing happens client-side.** PDFs, images, spreadsheets, and documents are processed entirely in the browser using client-side libraries. Files are never sent to a backend or third-party API during the MVP phase.
- When we add Google Cloud Vision for improved OCR accuracy (post-MVP), we will send product label images only — never allergen list files — and will document this clearly in the UI.

### Product label images

- Product label images are processed client-side by Tesseract.js and discarded after text extraction.
- Only the extracted text and match results are used; the image is not stored.

### Post-MVP data storage

- Allergen lists are stored per authenticated user and are never publicly accessible.
- Row Level Security (RLS) policies in Supabase ensure users can only read and write their own rows — this is enforced at the database layer, not just the application layer.
- Product scan history stores only: product name, brand, and whether it was flagged or marked safe. Raw images and extracted ingredient text are not persisted.
- No allergen or health data is ever shared between users, exposed in public APIs, or used for analytics.

### General

- No third-party analytics, tracking scripts, or ad networks.
- No cookies or localStorage in the MVP — there is nothing to store.
- Add a visible in-app notice confirming client-side processing: *"Your files and photos never leave your device."*

---

## Allergen data

### Common allergen list (`src/data/commonAllergens.json`)

Curated list used for the "select" input path. Each entry has an `id`, `label`, `category`, and `aliases` array. Categories:

| Category | Examples |
|---|---|
| Food | FDA Big 9 + EU 14 (milk, eggs, peanuts, wheat, etc.) |
| Fragrance | parfum, linalool, limonene, and 26 EU-listed fragrance allergens |
| Preservatives | parabens, formaldehyde-releasers, MIT/MCI, phenoxyethanol |
| Surfactants | SLS, SLES |
| Solvents & Humectants | propylene glycol, butylene glycol |
| Emollients | lanolin and derivatives |
| Metals | nickel, cobalt, chromium |
| Latex & Rubber | natural rubber / hevea |
| UV Filters | benzophenone, oxybenzone, avobenzone |
| Dyes & Colorants | PPD / p-phenylenediamine (hair dye) |

### Custom allergens (not on the common list)

Users can add any allergen by typing it manually. Custom allergens are stored with a `custom: true` flag and matched using a three-tier confidence system.

#### Match confidence tiers

| Confidence | How it's determined | Shown as |
|---|---|---|
| **Found** | Exact alias match (curated entries), or exact typed term match (custom entries) | Definite flag — red |
| **Maybe** | Custom entry only: abbreviation matched as a whole word (e.g. "EDA" for "Ethylenediamine Dihydrochloride"), or a significant word (≥6 chars, not a generic chemistry word) found in label text | Uncertain flag — yellow, with prompt to verify |
| **No match** | Nothing found | Not shown |

Curated allergens only ever produce **Found** or no match — the alias list is trusted and partial matching is not applied to it.

#### "Did you mean?" on custom input

When a user types a custom allergen, the input checks whether the typed term matches any alias already in `commonAllergens.json`. If it does, it surfaces the curated entry:

> *"Imidazolidinyl urea is listed under Formaldehyde / Formaldehyde-releasing preservatives, which also covers DMDM hydantoin, quaternium-15, and 6 other related ingredients. Add that instead?"*

This catches cases where a user knows a specific ingredient name but doesn't realise it's covered by a broader curated entry with better alias coverage.

#### Limitations to surface in UI

- Maybe matches are signals, not confirmations. Always show the raw extracted label text (collapsible) so users can verify manually.
- OCR errors (e.g. "peanuts" scanned as "peanurs") can cause misses even on exact matches. Encourage clear, well-lit photos.
- Abbreviation matching uses whole-word boundaries to reduce false positives (e.g. "EDA" won't match "CEDAR"), but edge cases exist.

## Component map

```
src/
  components/
    AllergenInput.jsx       — allergen list: type, select, or upload
    AllergenReview.jsx      — review/confirm OCR-extracted allergens before adding
    ImageCapture.jsx        — product label: upload or camera
    ResultsDisplay.jsx      — pass/fail summary + flagged allergens
  hooks/
    useOCR.js               — Tesseract.js wrapper
    useAllergenMatcher.js   — alias-based text matching
  data/
    commonAllergens.json    — FDA Big 9 + EU 14 with aliases
```

---

## Accessibility requirements

- Pass/fail result must not rely on color alone — use icon + text alongside color
- Camera input requires a file upload fallback for desktop
- OCR loading state must use an ARIA live region so screen readers announce completion
- All interactive elements must be keyboard navigable
- Disclaimer text must meet WCAG AA contrast

---

## Disclaimer (to appear in UI)

> Safeplate is a checking aid, not a substitute for reading labels yourself. It works on any product — food, personal care, cleaning products, and more — but OCR is imperfect. Blurry photos, curved bottles, or dense label text may produce inaccurate results. Always verify with the manufacturer if you have a severe allergy or sensitivity.
