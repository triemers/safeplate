// ResultsDisplay — the verdict hero + per-allergen breakdown.
// Three states: safe / maybe / found, with copy that matches CONTENT FUNDAMENTALS.

const ResultsDisplay = ({ result, onRescan, onClose }) => {
  if (!result) return null;

  // Derive verdict tier from the matches
  const hasFound = result.matches.some(m => m.confidence === 'found');
  const hasMaybe = result.matches.some(m => m.confidence === 'maybe');
  const tier = hasFound ? 'found' : hasMaybe ? 'maybe' : 'safe';

  const COPY = {
    safe: {
      badge: 'Safe',
      icon: 'check',
      h: 'Looks safe.',
      sub: 'No allergens from your list were found in this label.',
    },
    maybe: {
      badge: 'Maybe',
      icon: 'alert',
      h: result.matches.length === 1
        ? 'Possible match — please verify.'
        : `${result.matches.length} possible matches — please verify.`,
      sub: 'OCR isn\'t certain. Check the full label below before deciding.',
    },
    found: {
      badge: 'Found',
      icon: 'x',
      h: result.matches.length === 1
        ? 'Contains 1 of your allergens.'
        : `Contains ${result.matches.length} of your allergens.`,
      sub: result.matches.slice(0, 3).map(m => m.label).join(', ')
        + (result.matches.length > 3 ? ` and ${result.matches.length - 3} more` : '')
        + ' were found in the ingredients.',
    },
  };

  const copy = COPY[tier];

  return (
    <div
      className={`verdict verdict--${tier} fade-in`}
      role="status"
      aria-live="polite"
      data-screen-label={`Verdict · ${tier}`}
    >
      <span className="verdict__badge">
        <span className="icon-bubble"><Icon name={copy.icon} size={14} stroke={2.4}/></span>
        {copy.badge}
      </span>
      <h2 className="verdict__h">{copy.h}</h2>
      <p className="verdict__sub">{copy.sub}</p>

      {result.matches.length > 0 && (
        <div className="verdict__body">
          {result.matches.map(m => (
            <div className="item" key={m.id}>
              <div>
                <div className="item-name">{m.label}</div>
                <div className="item-trace">{m.trace}</div>
              </div>
              <span className={`verdict__pill verdict__pill--${m.confidence}`}>
                {m.confidence === 'found' ? 'Found' : 'Maybe'}
              </span>
            </div>
          ))}
        </div>
      )}

      <details style={{marginTop:'var(--space-3)'}}>
        <summary style={{cursor:'pointer',color:'var(--color-secondary)',fontFamily:'var(--font-heading)',fontWeight:600,fontSize:13}}>
          Show extracted label text
        </summary>
        <pre style={{
          marginTop:8,
          padding:'12px 14px',
          background:'rgba(255,255,255,0.7)',
          borderRadius:8,
          fontSize:12,
          fontFamily:'var(--font-mono)',
          color:'var(--fg-2)',
          whiteSpace:'pre-wrap',
          lineHeight:1.5,
        }}>{result.text}</pre>
      </details>

      <div className="verdict__actions">
        <Button variant="primary" icon="rotate" onClick={onRescan}>Scan another</Button>
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};

window.ResultsDisplay = ResultsDisplay;
