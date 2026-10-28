import { useAppStore } from '../../store/appStore'

export function Header() {
  const { breadcrumb, closeDestination, historyOpen, setHistoryOpen, penafranciaModeActive, setPenafranciaModeActive } = useAppStore()

  return (
    <header className="site-header" role="banner">
      {/* Brand + Breadcrumb */}
      <button
        className="header-logo"
        onClick={closeDestination}
        aria-label="LAKAW NAGA — Return to map"
        style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}
      >
        <div className="header-logo-mark" aria-hidden="true">L</div>
        <div className="header-logo-text">
          <span className="header-logo-city">LAKAW NAGA</span>
          <span className="header-logo-tagline">Explore Naga City</span>
        </div>
      </button>

      {breadcrumb.length > 1 && (
        <nav className="breadcrumb" aria-label="Location breadcrumb">
          {breadcrumb.map((crumb, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0 }}>
              {i > 0 && <span className="breadcrumb-sep" aria-hidden="true">›</span>}
              <span className="breadcrumb-item">{crumb}</span>
            </span>
          ))}
        </nav>
      )}

      {/* Controls */}
      <div className="header-nav">
        {/* Naga City History */}
        <button
          className={`history-btn${historyOpen ? ' active' : ''}`}
          onClick={() => setHistoryOpen(!historyOpen)}
          aria-label="Naga City History"
          aria-pressed={historyOpen}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          History
        </button>

        {/* Penafrancia Festival toggle */}
        <button
          className={`history-btn${penafranciaModeActive ? ' active' : ''}`}
          onClick={() => setPenafranciaModeActive(!penafranciaModeActive)}
          aria-label="Penafrancia Festival mode"
          aria-pressed={penafranciaModeActive}
          style={penafranciaModeActive ? {
            background: 'linear-gradient(135deg, #7B3038, #8B2A18)',
            borderColor: '#C29A51',
            color: '#F0C040',
          } : undefined}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          Penafrancia
        </button>
      </div>
    </header>
  )
}
