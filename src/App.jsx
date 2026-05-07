import { useState } from 'react'
import AllergenInput from './components/AllergenInput'
import ImageCapture from './components/ImageCapture'
import ResultsDisplay from './components/ResultsDisplay'

export default function App() {
  const [allergens, setAllergens] = useState([])
  const [results, setResults] = useState(null)

  function addAllergen(allergen) {
    setAllergens(prev =>
      prev.find(a => a.id === allergen.id) ? prev : [...prev, allergen]
    )
  }

  function removeAllergen(id) {
    setAllergens(prev => prev.filter(a => a.id !== id))
  }

  return (
    <main>
      <h1>Safeplate</h1>
      <AllergenInput
        allergens={allergens}
        onAdd={addAllergen}
        onRemove={removeAllergen}
        onClear={() => setAllergens([])}
      />
      <ImageCapture onCapture={setResults} />
      {results && <ResultsDisplay results={results} allergens={allergens} />}
    </main>
  )
}
