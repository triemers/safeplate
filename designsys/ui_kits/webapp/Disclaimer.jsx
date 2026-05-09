const Disclaimer = () => (
  <div className="disclaimer" data-screen-label="Disclaimer">
    <Icon name="shield" size={18} />
    <p>
      <strong>Snap Allergy is a checking aid, not medical advice.</strong>{' '}
      OCR is imperfect — blurry photos or curved bottles may produce inaccurate
      results. Always verify with the manufacturer if you have a severe allergy.
      Your files and photos never leave your device.
    </p>
  </div>
);

window.Disclaimer = Disclaimer;
