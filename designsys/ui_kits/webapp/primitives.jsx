// Primitives — Button, Chip, Field, Card, Icon
// Imported via window globals from index.html.

const Icon = ({ name, size = 18, stroke = 1.75, ...rest }) => {
  const paths = {
    camera: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7l1.5-2h3L15 7"/><circle cx="12" cy="13.5" r="3.5"/></>,
    upload: <><path d="M12 3v12"/><path d="M7 8l5-5 5 5"/><path d="M5 21h14"/></>,
    check: <polyline points="20 6 9 17 4 12"/>,
    x: <><path d="M18 6 6 18"/><path d="M6 6l12 12"/></>,
    alert: <><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.86a2 2 0 0 1 3.4 0l8.5 14.7A2 2 0 0 1 20.5 22h-17a2 2 0 0 1-1.7-3.45z"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>,
    shield: <><path d="M12 22s8-4 8-12V4l-8-2-8 2v6c0 8 8 12 8 12z"/><polyline points="9 12 11 14 15 10"/></>,
    sparkle: <path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7z"/>,
    plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    rotate: <><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></>,
    type: <><path d="M5 7V5h14v2"/><path d="M9 19h6"/><path d="M12 5v14"/></>,
    list: <><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></>,
    leaf: <path d="M14 4c-2 4-6 5-9 5 0 7 4 11 9 11 5 0 9-4 9-11-3 0-7-1-9-5z"/>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 8h.01"/><path d="M11 12h1v4h1"/></>,
  };
  return (
    <svg
      className="icon"
      width={size} height={size}
      viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
};

const Button = ({ variant = 'ghost', size, icon, children, className = '', ...rest }) => {
  const cls = [
    'btn',
    `btn--${variant}`,
    size ? `btn--${size}` : '',
    className,
  ].filter(Boolean).join(' ');
  return (
    <button className={cls} {...rest}>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  );
};

const Chip = ({ variant = 'cosmetic', onRemove, children, asAdd, ...rest }) => {
  if (asAdd) {
    return (
      <button className="chip chip--add" {...rest}>
        <Icon name="plus" size={14} />
        {children}
      </button>
    );
  }
  return (
    <span className={`chip chip--${variant}`} {...rest}>
      {children}
      {onRemove && (
        <button className="chip__x" onClick={onRemove} aria-label={`Remove ${children}`}>
          <Icon name="x" size={12} stroke={2.5} />
        </button>
      )}
    </span>
  );
};

const Field = ({ label, help, icon, children, ...rest }) => (
  <div>
    {label && <label className="field-label">{label}</label>}
    <div className="field">
      {icon && <Icon name={icon} size={18} />}
      {children || <input {...rest} />}
    </div>
    {help && <div className="field-help">{help}</div>}
  </div>
);

const Card = ({ title, sub, tinted, children, className = '', ...rest }) => (
  <section className={`card ${tinted ? 'tinted' : ''} ${className}`} {...rest}>
    {(title || sub) && (
      <header style={{display: 'flex', flexDirection: 'column', gap: 2}}>
        {title && <h3 className="card-title">{title}</h3>}
        {sub && <p className="card-sub">{sub}</p>}
      </header>
    )}
    {children}
  </section>
);

Object.assign(window, { Icon, Button, Chip, Field, Card });
