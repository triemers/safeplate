// Words too generic to use as partial-match signals on their own
const BLOCKLIST = new Set([
  'acid', 'oxide', 'sodium', 'potassium', 'calcium', 'magnesium', 'ammonium',
  'hydroxy', 'methyl', 'ethyl', 'butyl', 'propyl', 'chloride', 'sulfate',
  'sulphate', 'phosphate', 'carbonate', 'gluconate', 'acetate', 'citrate',
  'stearate', 'palmitate', 'laurate', 'extract', 'water', 'aqua', 'glycerin',
  'alcohol', 'ester', 'ether', 'resin', 'wax', 'oil', 'butter', 'powder',
])

const SIGNIFICANT_WORD_MIN = 6

function tokenize(term) {
  return term
    .toLowerCase()
    .split(/[\s\-\/,()]+/)
    .filter(w => w.length >= SIGNIFICANT_WORD_MIN && !BLOCKLIST.has(w))
}

function abbreviate(term) {
  const abbr = term
    .split(/[\s\-\/]+/)
    .filter(w => w.length > 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
  return abbr.length >= 2 ? abbr : null
}

// Matches abbreviation as a whole word to avoid e.g. "EDA" matching "CEDAR"
function containsWholeWord(text, word) {
  return new RegExp(`(?<![a-z])${word.toLowerCase()}(?![a-z])`).test(text)
}

export function useAllergenMatcher() {
  /**
   * Returns { found: AllergenEntry[], maybe: AllergenEntry[] }
   * found  — definite match (curated alias or exact custom term)
   * maybe  — partial signal only (abbreviation or significant word from custom entry)
   *
   * Curated allergens (custom: false) only produce 'found' results — we trust the alias list.
   * Custom allergens (custom: true) can produce 'found' or 'maybe'.
   */
  function match(text, allergens) {
    const normalizedText = text.toLowerCase()
    const found = []
    const maybe = []

    for (const allergen of allergens) {
      const aliases = allergen.aliases ?? []

      if (!allergen.custom) {
        // Curated: exact alias match only
        if (aliases.some(alias => normalizedText.includes(alias.toLowerCase()))) {
          found.push(allergen)
        }
        continue
      }

      // Custom allergen: exact match first
      if (aliases.some(alias => normalizedText.includes(alias.toLowerCase()))) {
        found.push(allergen)
        continue
      }

      // Custom allergen: abbreviation match
      const abbr = abbreviate(allergen.label)
      if (abbr && containsWholeWord(normalizedText, abbr)) {
        maybe.push(allergen)
        continue
      }

      // Custom allergen: significant word match
      const words = tokenize(allergen.label)
      if (words.some(w => normalizedText.includes(w))) {
        maybe.push(allergen)
      }
    }

    return { found, maybe }
  }

  return { match }
}
