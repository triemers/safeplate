// AllergenInput — three modes: type, pick from common, upload list.
// Renders the saved allergens beneath as a list (the live "your allergens" card).

const COMMON = [
  { id: 'milk', label: 'Milk / Dairy', category: 'Food' },
  { id: 'eggs', label: 'Eggs', category: 'Food' },
  { id: 'fish', label: 'Fish', category: 'Food' },
  { id: 'shellfish', label: 'Shellfish', category: 'Food' },
  { id: 'tree-nuts', label: 'Tree Nuts', category: 'Food' },
  { id: 'peanuts', label: 'Peanuts', category: 'Food' },
  { id: 'wheat', label: 'Wheat / Gluten', category: 'Food' },
  { id: 'soy', label: 'Soy', category: 'Food' },
  { id: 'sesame', label: 'Sesame', category: 'Food' },
  { id: 'fragrance', label: 'Fragrance / Parfum', category: 'Fragrance' },
  { id: 'parabens', label: 'Parabens', category: 'Preservatives' },
  { id: 'sls', label: 'SLS / SLES', category: 'Surfactants' },
  { id: 'lanolin', label: 'Lanolin', category: 'Emollients' },
  { id: 'nickel', label: 'Nickel', category: 'Metals' },
  { id: 'latex', label: 'Latex', category: 'Latex & Rubber' },
];

const CATEGORY_TINT = {
  Food: 'food',
  Fragrance: 'cosmetic',
  Preservatives: 'cosmetic',
  Surfactants: 'cosmetic',
  Emollients: 'cosmetic',
  Metals: 'cosmetic',
  'Latex & Rubber': 'cosmetic',
  Custom: 'custom',
};

const CATEGORY_DOT = {
  Food: '#4BD79A',
  Fragrance: '#4C84A3',
  Preservatives: '#4C84A3',
  Surfactants: '#4C84A3',
  Emollients: '#4C84A3',
  Metals: '#4C84A3',
  'Latex & Rubber': '#4C84A3',
  Custom: '#E29B6E',
};

const AllergenInput = ({ allergens, onAdd, onRemove, onClear }) => {
  const [tab, setTab] = React.useState('type');
  const [draft, setDraft] = React.useState('');

  const isAdded = (id) => allergens.some(a => a.id === id);

  const submit = (e) => {
    e.preventDefault();
    const term = draft.trim();
    if (!term) return;
    const lc = term.toLowerCase();
    const match = COMMON.find(a => a.label.toLowerCase() === lc || a.id === lc);
    if (match) {
      onAdd(match);
    } else {
      onAdd({ id: `custom-${lc}`, label: term, category: 'Custom', custom: true });
    }
    setDraft('');
  };

  return (
    <Card data-screen-label="Allergen input">
      <header style={{display:'flex', flexDirection:'column', gap:6}}>
        <h3 className="card-title">Your allergens</h3>
        <p className="card-sub">
          {allergens.length === 0
            ? 'Tell us what to look out for.'
            : `${allergens.length} ${allergens.length === 1 ? 'thing' : 'things'} you avoid · saved this session`}
        </p>
      </header>

      <div className="tabs" role="tablist" aria-label="Input mode">
        <button role="tab" className="tab" aria-selected={tab === 'type'} onClick={() => setTab('type')}>
          <Icon name="type" size={14}/>Type
        </button>
        <button role="tab" className="tab" aria-selected={tab === 'pick'} onClick={() => setTab('pick')}>
          <Icon name="list" size={14}/>Pick common
        </button>
        <button role="tab" className="tab" aria-selected={tab === 'upload'} onClick={() => setTab('upload')}>
          <Icon name="file" size={14}/>Upload list
        </button>
      </div>

      {tab === 'type' && (
        <form onSubmit={submit} style={{display:'flex', gap:8}}>
          <div style={{flex:1}}>
            <Field>
              <Icon name="search" size={18}/>
              <input
                value={draft}
                onChange={e => setDraft(e.target.value)}
                placeholder="Try “sesame”, “SLS”, or “EDA”…"
              />
            </Field>
          </div>
          <Button variant="primary" type="submit" icon="plus">Add</Button>
        </form>
      )}

      {tab === 'pick' && (
        <div className="allergen-picker">
          {COMMON.map(a => (
            <button
              key={a.id}
              className="pick-btn"
              aria-pressed={isAdded(a.id)}
              onClick={() => isAdded(a.id) ? onRemove(a.id) : onAdd(a)}
            >
              {isAdded(a.id) ? '✓ ' : ''}{a.label}
            </button>
          ))}
        </div>
      )}

      {tab === 'upload' && (
        <div style={{display:'flex', flexDirection:'column', gap:10}}>
          <div className="capture" style={{aspectRatio:'auto', minHeight:140, padding:20}}>
            <Icon name="upload" size={32} className="capture__icon"/>
            <div className="capture__title">Drop your allergy list</div>
            <div className="capture__sub">PDF, image, DOCX, TXT, or CSV. Parsed in your browser — never uploaded.</div>
            <div className="capture__cta">
              <Button variant="primary" size="sm" icon="file" onClick={() => alert('File picker would open. (Demo)')}>Choose file</Button>
            </div>
          </div>
          <p className="caption" style={{textAlign:'center'}}>You'll review the parsed allergens before any are added.</p>
        </div>
      )}

      {/* Saved list */}
      {allergens.length > 0 && (
        <div className="fade-in">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4}}>
            <span className="field-label" style={{margin:0}}>Saved</span>
            <button
              onClick={onClear}
              style={{background:'none', border:'none', color:'var(--fg-3)', fontSize:12, cursor:'pointer', textDecoration:'underline'}}
            >
              Clear all
            </button>
          </div>
          {allergens.map(a => (
            <div className="allergen-row" key={a.id}>
              <div className="allergen-row__left">
                <span className="dot" style={{background: CATEGORY_DOT[a.category] || '#999'}}></span>
                <span>
                  <div className="name">{a.label}{a.custom && <span style={{fontSize:11,color:'var(--fg-3)',fontWeight:400,marginLeft:6}}>· custom</span>}</div>
                  <div className="cat">{a.category}</div>
                </span>
              </div>
              <button className="icon-btn" aria-label={`Remove ${a.label}`} onClick={() => onRemove(a.id)}>
                <Icon name="x" size={14}/>
              </button>
            </div>
          ))}
        </div>
      )}

      {allergens.length === 0 && tab === 'type' && (
        <div className="empty">
          <Icon name="leaf" size={32} className="ico"/>
          <h3>Start by telling us what you avoid.</h3>
          <p>Type, pick from common allergens, or upload your allergy list.</p>
        </div>
      )}
    </Card>
  );
};

window.AllergenInput = AllergenInput;
window.COMMON_ALLERGENS = COMMON;
