# Snap Allergy — Design System

**Snap Allergy** is a friendly, privacy-first allergen scanner. Users build a personal allergen list, then snap or upload a product label — food, cosmetics, cleaning products, anything with an ingredients panel — and get an immediate **Safe / Maybe / Found** verdict. Everything runs client-side (Tesseract.js OCR, pdfjs, mammoth) — files and photos never leave the device.

The brand is warm, reassuring, and direct. Pastel mint primary, slate-blue secondary, tangerine tertiary. Generous white space, rounded corners, no shadows. Poppins SemiBold for headings, Inter for body.

---

## Sources used to build this system

| Source | What we got from it |
|---|---|
| `uploads/Design guidelines (basic.png` | **Source of truth** for the visual system: palette (#4BD79A / #4C84A3 / #E29B6E + greys), Poppins SemiBold headings, Inter body, **8px grid base, flat design (no shadows), 8px border radius**. |
| `triemers/safeplate` GitHub repo | Functional spec ([PROJECT.md](./PROJECT.md)): MVP flow, allergen taxonomy, three-tier match confidence (**Found / Maybe / No match**), accessibility requirements, privacy disclaimer. **Note:** the repo's `src/components/` are stub placeholders — the UI in this kit is designed *fresh* from the brand guidelines and the functional spec, not copied from existing component code. The repo's accent colour (`#aa3bff`) and starter favicon belong to the upstream Vite template and have **not** been used. |
| `data/commonAllergens.json` | The curated allergen taxonomy used in inputs and results (FDA Big 9 + EU 14 + cosmetics sensitisers). Imported verbatim. |

---

## Quick index

```
.
├── README.md                ← you are here — brand overview + content + visual + iconography
├── SKILL.md                 ← Agent-Skills entry point
├── colors_and_type.css      ← CSS custom properties: palette, type scale, spacing, radii
├── PROJECT.md               ← functional spec from the upstream repo
├── data/
│   └── commonAllergens.json ← curated allergen list with aliases
├── assets/
│   ├── snap-allergy-logo.svg   ← horizontal lockup (mark + wordmark)
│   ├── snap-allergy-mark.svg   ← square mark only
│   └── favicon.svg
├── preview/                 ← Design System tab cards (one .html per concept)
├── ui_kits/
│   └── webapp/              ← React UI kit for the web app: index.html + JSX components
└── slides/                  ← (none — no template was provided)
```

---

## CONTENT FUNDAMENTALS

The voice is **a calm, allergy-savvy friend**. We talk to the user (`you` / `your`), never about them in the third person. We never sound clinical or alarmed — but we never undersell risk either. Plain English over chemistry jargon, except when naming the actual allergen (then we use the canonical INCI / FDA name).

### Tone rules

- **Warm, not cute.** "Looks safe" — not "Yay, you're good!"
- **Direct, not hedging.** "Contains peanuts" — not "May possibly contain peanuts."
- **Honest about uncertainty.** When OCR confidence or alias matching is fuzzy we say so out loud, with a "Maybe" verdict and a prompt to verify.
- **Never medical advice.** We are a checking aid, not a doctor. The disclaimer is permanent in the UI.

### Casing

- **Sentence case for everything** — buttons, headings, labels, menu items.
  - ✅ `Add allergen` ✅ `Scan a label`
  - ❌ `Add Allergen` ❌ `SCAN A LABEL`
- Allergen names follow the source: `Milk / Dairy`, `Sodium Lauryl Sulfate (SLS / SLES)`, `Methylisothiazolinone (MIT / MCI)`. Slashes and parentheses are preserved.
- Verdicts use Title Case as a single-word badge: `Safe`, `Found`, `Maybe`.

### Person

- Always **second person** ("your allergens", "you scanned").
- Never first-person plural for the product ("we found"). Use the result voice: "Found 2 allergens in this label."
- The disclaimer is the only place "Snap Allergy" refers to itself by name.

### Punctuation & symbols

- No exclamation marks. The product is reassuring, not perky.
- Em-dashes (—) are fine for asides; avoid colons in headings.
- Ellipses are reserved for live status: `Reading label…`, `Extracting allergens…`.

### Emoji

- **No emoji in product UI.** Verdicts use real iconography (✓ ✕ ! drawn as SVG, not emoji codepoints) plus colour plus text — accessibility requires that no signal lives in colour alone.
- Emoji *may* appear in marketing material (landing-page hero, social) sparingly, e.g. one emoji per section heading.

### Numbers

- Numerals inline (`2 allergens`, `9 of 14 EU groups`), even below ten.
- Always pluralise correctly: `1 allergen flagged`, `3 allergens flagged`.

### Examples — voice in the wild

| Surface | Copy |
|---|---|
| Empty state — no allergens yet | **Start by telling us what you avoid.** Type, pick from common allergens, or upload your allergy list. |
| Verdict — clean | **Looks safe.** No allergens from your list were found in this label. |
| Verdict — found | **Contains 2 of your allergens.** Milk / Dairy and Soy were found in the ingredients. |
| Verdict — maybe | **Possible match — please verify.** "EDA" might refer to Ethylenediamine Dihydrochloride. Check the full label below. |
| Did-you-mean | Imidazolidinyl urea is listed under **Formaldehyde-releasing preservatives**, which also covers DMDM hydantoin and 6 others. Add that group instead? |
| Disclaimer (permanent) | Snap Allergy is a checking aid, not a substitute for reading labels yourself. OCR is imperfect — always verify with the manufacturer if you have a severe allergy. |
| Privacy reassurance | Your files and photos never leave your device. |

---

## VISUAL FOUNDATIONS

### Palette

The brand uses three saturated-but-soft hues plus a five-step grey ramp. All hex values are taken **verbatim** from the design guidelines image.

| Token | Hex | Role |
|---|---|---|
| `--color-primary` | `#4BD79A` | Mint green. Brand-positive. **Safe** verdict. CTA buttons. |
| `--color-secondary` | `#4C84A3` | Slate blue. Information, navigation, secondary CTAs, links. |
| `--color-tertiary` | `#E29B6E` | Tangerine. Warmth + caution. **Maybe** verdict. Empty-state warmth. |
| `--color-grey-1` | `#F2F2F2` | Surface tint, panel backgrounds. |
| `--color-grey-2` | `#D2D2D2` | Hairlines, dividers, disabled. |
| `--color-grey-3` | `#999999` | Captions, muted text. |
| `--color-grey-4` | `#666666` | Secondary text. |
| `--color-text` | `#444444` | Primary text. **Not pure black** — keeps the warmth. |

**Soft tints** (`*-soft`, `*-tint`) are derived in `colors_and_type.css` and used for verdict backgrounds, hover surfaces, and full-bleed panels. They are *always* lighter than the base hue — we never go darker (no muddy presses, no heavy shadows).

**Found / red** for definite-allergen verdicts is `#D9534F` on `#FBE5E4` — added because the brand palette has no red but the three-tier confidence model in PROJECT.md needs one.

### Typography

- **Headings — Poppins SemiBold (600)**, letter-spacing `-0.01em`. Used for h1 / h2 / h3, button labels, and verdict badges.
- **Body — Inter Regular (400) / Medium (500)**. 16px / 1.5 line height for body, 14px for labels.
- **Mono** — system mono stack for INCI codes and file names only (`E220`, `imidazolidinyl-urea.pdf`).
- **Scale** (defined in `colors_and_type.css`): 44 / 32 / 22 / 16 / 14 / 13.

### Spacing

8px grid base. Tokens are `--space-1` (4px) through `--space-8` (96px). Section padding uses `--space-5` (32px) at minimum; cards use `--space-4` (24px). **Generous whitespace is part of the brand** — when in doubt, add space.

### Backgrounds

- **Plain white** is the default canvas — no full-bleed photography, no gradients.
- **Tinted panels** (`--color-grey-1` for neutral, `*-soft` for branded) are how we group content.
- **No repeating patterns or textures.** No grain. No noise.
- The only image we ship is the user's own captured photo (label preview); we never use stock photography.

### Animation

Motion is restrained and serves status, not decoration.

- **Easing**: `cubic-bezier(0.2, 0.8, 0.2, 1)` for everything (var `--ease-soft`). One curve.
- **Durations**: `120ms` (state changes), `200ms` (panel open / button press), `320ms` (verdict reveal).
- **Fades + small position shifts only**. No bounces, no rotations, no spring overshoot.
- **Live OCR status** uses a horizontal indeterminate progress bar (mint), not a spinner.

### States

| State | Treatment |
|---|---|
| Hover (button / link) | Background lightens **toward white** by ~6% — never darkens. Mint primary becomes a slightly warmer mint. Cursor: pointer. |
| Press / active | Subtle inset feel via slightly **darker** brand tint (~6%) and `transform: translateY(1px)`. No scale-down. |
| Focus | 2px outer ring in `--color-secondary` (slate blue), 2px offset, fully visible — never `outline: none`. |
| Disabled | `--color-grey-2` background, `--color-grey-3` text, `cursor: not-allowed`, no hover. |
| Error | `--color-flag` border, message in `--color-flag` directly under the field. |

### Borders & shadows

- **Borders are 1px hairlines** in `--border-1` (`#D2D2D2`). On tinted panels, we drop the border entirely and let the tint do the work.
- **Per the guidelines, this system is "flat — no shadows."** The one exception is floating UI (popovers, dropdown menus) where we use a single soft shadow `0 4px 20px rgba(20,30,40,0.06)` to lift it off the page. Cards, buttons, and modals are flat.

### Corners & radii

- **8px is the base radius** (`--radius-md`) — applied to buttons, inputs, cards, badges, tooltips.
- 16px (`--radius-lg`) for larger cards and the camera-capture frame.
- 24px (`--radius-xl`) for full-bleed panels and the verdict hero.
- Pills (`--radius-pill`) for chips, tags, and the verdict badge.

### Cards

A Snap Allergy card is: white background, 1px hairline border, 8–16px radius, 24px internal padding, **no shadow**. When grouped on a tinted page background (`--color-grey-1`), the card switches to no border and relies on the surface contrast.

### Transparency & blur

- **Rarely used.** Solid surfaces only.
- The one place we allow it: a 60% white overlay on the live camera preview to dim it while OCR runs.

### Layout rules

- **Single-column, max-width 720px** for primary flows on mobile / tablet.
- **Two-column 1120px max** for the desktop scanner view (allergen list left, capture + result right).
- The page header is always sticky at the top, 64px tall, white background, hairline bottom border.
- The disclaimer banner sits at the bottom of every page on a `--color-grey-1` strip — never dismissed, never collapsed.

### Imagery vibe

The only image we render is **the user's own product photo**. It's shown at native colour with a 1px hairline border and 16px radius — no filters, no warm/cool shift, no grain, no b&w. The OCR text overlay (when shown) uses a 60% white scrim and slate-blue underlines over matched terms.

---

## ICONOGRAPHY

Snap Allergy uses a **single, consistent icon set: Lucide** (lucide.dev). It's open-source, MIT-licensed, has stroke-style outlines that match our friendly-but-precise tone, and ships every icon we need (camera, upload, check, x, alert-triangle, search, sparkles, leaf, shield-check, etc).

We load Lucide via the official ESM CDN and render icons as inline SVG so they pick up `currentColor` from CSS. No PNG icons. No emoji as icons. No Unicode codepoints for icons (we use `✓`-style glyphs only inside text content, not as standalone iconography).

### Standards

- **Stroke**: 1.75 (Lucide default is 2 — we run slightly lighter to match Inter's stroke).
- **Sizes**: 16 / 20 / 24px. 16 inline with text, 20 in buttons, 24 in headers and capture controls.
- **Colour**: always inherits `currentColor` so a green button's icon is white, a slate-blue link's icon is slate-blue, etc.
- **Stroke linecap & linejoin**: `round` everywhere.

### Substitution flag

We do **not** ship a custom icon set in this design system — none was provided in the source materials, and the upstream repo ships only social-media glyphs (Bluesky / Discord / GitHub / X) belonging to the unrelated Vite starter template. **Lucide is a substitution.** If Snap Allergy adopts a custom icon library later, swap the CDN load in `ui_kits/webapp/index.html` for local sprites and update this section.

### Logo

The Snap Allergy mark (`assets/snap-allergy-mark.svg`) is a 12px-radius rounded square in `--color-primary`, with a white check drawn through it. It nods to "scan + safe." The horizontal lockup (`assets/snap-allergy-logo.svg`) places the wordmark in Poppins SemiBold beside the mark with 12px clear space.

> **Note:** The mark in this kit is purpose-drawn for the design system. The upstream repo's favicon (a purple lightning bolt) is the Vite-starter default and is not used.

### Emoji

Not used in product UI. Optional in long-form marketing copy, never decorative — a section heading may carry one leading emoji if it earns its place.

### Unicode glyphs in text

- `→` is allowed in inline copy ("Type → Review → Add").
- `•` allowed for inline lists when a `<ul>` would be heavy-handed.
- `✓ / ✕ / !` are *never* used inline — use the SVG icons.
