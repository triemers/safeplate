// ImageCapture — the "snap a label" target.
// In the real app this hooks Tesseract.js. Here it's a mocked OCR animation
// that returns a fixture result after ~1.6s.

const FIXTURES = [
  // Cycle: safe → maybe → found
  {
    state: 'safe',
    photo: 'https://images.unsplash.com/photo-1556767576-cf0a4a80e5ea?w=600&q=70',
    text: `INGREDIENTS: WATER, SUGAR, RICE FLOUR, NATURAL FLAVOR,
SEA SALT, CITRIC ACID, ASCORBIC ACID (VITAMIN C).`,
    matches: [],
  },
  {
    state: 'maybe',
    photo: 'https://images.unsplash.com/photo-1559963110-71b394e7494d?w=600&q=70',
    text: `Aqua, Glycerin, Cetearyl Alcohol, Caprylyl Glycol,
EDA, Phenoxyethanol, Tocopherol, Citric Acid.`,
    matches: [
      { id: 'custom-eda', label: 'EDA', category: 'Custom', confidence: 'maybe', trace: '"EDA" matches your custom term as a whole word.' },
      { id: 'phenoxyethanol', label: 'Phenoxyethanol', category: 'Preservatives', confidence: 'found', trace: 'Found "phenoxyethanol".' },
    ],
  },
  {
    state: 'found',
    photo: 'https://images.unsplash.com/photo-1505575972945-280edb627879?w=600&q=70',
    text: `INGREDIENTS: WHOLE WHEAT FLOUR, SUGAR, COCOA,
SOYBEAN OIL, MILK POWDER, EGGS, SALT, BAKING SODA,
NATURAL FLAVOR (CONTAINS PEANUTS).`,
    matches: [
      { id: 'milk', label: 'Milk / Dairy', category: 'Food', confidence: 'found', trace: 'Found "milk powder".' },
      { id: 'soy', label: 'Soy', category: 'Food', confidence: 'found', trace: 'Found "soybean oil".' },
      { id: 'peanuts', label: 'Peanuts', category: 'Food', confidence: 'found', trace: 'Found "peanuts".' },
      { id: 'wheat', label: 'Wheat / Gluten', category: 'Food', confidence: 'found', trace: 'Found "wheat flour".' },
      { id: 'eggs', label: 'Eggs', category: 'Food', confidence: 'found', trace: 'Found "eggs".' },
    ],
  },
];

const ImageCapture = ({ allergens, onResult, cycleIndex }) => {
  const [phase, setPhase] = React.useState('idle'); // idle | scanning
  const [photo, setPhoto] = React.useState(null);

  const start = () => {
    if (allergens.length === 0) {
      alert('Add at least one allergen first. (Demo)');
      return;
    }
    const fix = FIXTURES[cycleIndex % FIXTURES.length];
    setPhoto(fix.photo);
    setPhase('scanning');
    setTimeout(() => {
      // Filter the fixture matches against the user's actual allergen list.
      // Custom matches are always passed through; named matches must be on the list.
      const allergenIds = new Set(allergens.map(a => a.id));
      const userHasCustom = allergens.some(a => a.id === 'custom-eda');
      const filtered = fix.matches.filter(m => {
        if (m.id.startsWith('custom-')) return userHasCustom;
        return allergenIds.has(m.id);
      });
      onResult({ ...fix, matches: filtered });
      setPhase('idle');
    }, 1600);
  };

  if (phase === 'scanning') {
    return (
      <div className="capture capture--filled" data-screen-label="Capture · scanning">
        {photo && <div className="capture__photo" style={{backgroundImage:`url(${photo})`}}></div>}
        <div className="capture__scrim">
          <div className="scan-bar"></div>
          <div className="capture__status">Reading label…</div>
          <div className="caption">Processing on your device</div>
        </div>
      </div>
    );
  }

  return (
    <div className="capture" data-screen-label="Capture · idle">
      <Icon name="camera" size={40} className="capture__icon"/>
      <div className="capture__title">Snap a label</div>
      <div className="capture__sub">Point at the ingredients panel — we'll do the rest.</div>
      <div className="capture__cta">
        <Button variant="primary" icon="camera" onClick={start}>Open camera</Button>
        <Button variant="ghost" icon="upload" onClick={start}>Upload file</Button>
      </div>
    </div>
  );
};

window.ImageCapture = ImageCapture;
