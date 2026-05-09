# Web App — UI Kit

A high-fidelity recreation of the Snap Allergy web-app interface, built fresh from the brand guidelines (`uploads/Design guidelines (basic.png`) and the functional spec (`PROJECT.md`). The upstream `triemers/safeplate` repo ships only stub components, so this kit is the canonical reference for what the app should look like.

## What's in here

| File | Role |
|---|---|
| `index.html` | Loads React, the design tokens, and renders `App.jsx` — opens to the full one-page scanner. |
| `App.jsx` | Orchestrates state: allergen list, scanner mode, OCR mock results. Contains the demo flow. |
| `Header.jsx` | Sticky page header with the lockup. |
| `AllergenInput.jsx` | The three-tab input (Type / Pick / Upload) and the saved-list panel. |
| `ImageCapture.jsx` | The "snap a label" target with camera + upload affordances and a mocked OCR scan animation. |
| `ResultsDisplay.jsx` | Verdict hero (Safe / Maybe / Found) + per-allergen breakdown. |
| `Disclaimer.jsx` | Permanent privacy + accuracy banner — never dismissed. |
| `primitives.jsx` | `Button`, `Chip`, `Field`, `Card`, `Icon` — the building blocks every component imports. |
| `app.css` | Component-level CSS layered on top of `colors_and_type.css`. |

## Click-through demo

The `index.html` boots straight into a working scan flow with seeded allergens. You can:

- Add / remove allergens (typing, picking from common list, or simulating an upload).
- Click **Scan a label** → watch a mock OCR pass → see a verdict.
- Re-scan to cycle between **Safe**, **Maybe**, and **Found** outcomes (the demo cycles deterministically so you can see all three states).

This is a *cosmetic* recreation — Tesseract.js, pdfjs, and mammoth are not actually loaded. OCR results are mocked from a small fixture array.
