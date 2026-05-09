const Header = () => (
  <header className="app-header" data-screen-label="App header">
    <div className="lockup">
      <img src="../../assets/snap-allergy-mark.svg" alt="" />
      <span className="word">Snap Allergy</span>
    </div>
    <nav className="nav">
      <a href="#scan">Scan</a>
      <a href="#privacy">Privacy</a>
      <a href="#help">Help</a>
    </nav>
  </header>
);

window.Header = Header;
