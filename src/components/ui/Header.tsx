import { useAppStore } from '../../store/appStore'

export function Header() {
  const { breadcrumb, closeDestination, setSearchOpen, searchOpen, historyOpen, setHistoryOpen } = useAppStore()

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
        {/* Search */}
        <button
          className="search-toggle-btn"
          onClick={() => setSearchOpen(!searchOpen)}
          aria-label="Search destinations"
          aria-expanded={searchOpen}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </button>

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
      </div>
    </header>
  )
}
