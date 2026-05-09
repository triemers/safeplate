// App — orchestrates state and demoes the full scan flow.

const App = () => {
  // Seed with two common allergens + one custom so the demo cycles through verdicts cleanly.
  const [allergens, setAllergens] = React.useState([
    { id: 'milk', label: 'Milk / Dairy', category: 'Food' },
    { id: 'peanuts', label: 'Peanuts', category: 'Food' },
    { id: 'soy', label: 'Soy', category: 'Food' },
    { id: 'wheat', label: 'Wheat / Gluten', category: 'Food' },
    { id: 'eggs', label: 'Eggs', category: 'Food' },
    { id: 'phenoxyethanol', label: 'Phenoxyethanol', category: 'Preservatives' },
    { id: 'custom-eda', label: 'EDA', category: 'Custom', custom: true },
  ]);
  const [result, setResult] = React.useState(null);
  const [cycleIndex, setCycleIndex] = React.useState(0);

  const addAllergen = (a) => setAllergens(prev =>
    prev.find(x => x.id === a.id) ? prev : [...prev, a]
  );
  const removeAllergen = (id) => setAllergens(prev => prev.filter(a => a.id !== id));
  const clearAllergens = () => setAllergens([]);

  const handleResult = (r) => {
    setResult(r);
    setCycleIndex(i => i + 1);
  };
  const rescan = () => setResult(null);

  return (
    <div className="page">
      <Header />
      <main className="page-main">
        <div className="col">
          <AllergenInput
            allergens={allergens}
            onAdd={addAllergen}
            onRemove={removeAllergen}
            onClear={clearAllergens}
          />
        </div>
        <div className="col">
          {!result ? (
            <Card title="Scan a product label" sub="Food, cosmetic, cleaning — anything with an ingredients panel.">
              <ImageCapture
                allergens={allergens}
                onResult={handleResult}
                cycleIndex={cycleIndex}
              />
              <p className="caption" style={{textAlign:'center'}}>
                JPG, PNG, WebP, HEIC, or PDF · processed on your device
              </p>
            </Card>
          ) : (
            <ResultsDisplay result={result} onRescan={rescan} onClose={rescan} />
          )}
        </div>
      </main>
      <Disclaimer />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
