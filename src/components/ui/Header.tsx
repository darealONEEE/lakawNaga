import { useAppStore } from '../../store/appStore'

export function Header() {
  const { mapMode, setMapMode, breadcrumb, closeDestination, setSearchOpen, searchOpen } = useAppStore()

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

        {/* Map mode toggle */}
        <div className="map-mode-toggle" role="group" aria-label="Map mode">
          <button
            className={`map-mode-btn${mapMode === '3d' ? ' active' : ''}`}
            onClick={() => setMapMode('3d')}
            aria-pressed={mapMode === '3d'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
            3D
          </button>
          <button
            className={`map-mode-btn${mapMode === 'geo' ? ' active' : ''}`}
            onClick={() => setMapMode('geo')}
            aria-pressed={mapMode === 'geo'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            Map
          </button>
        </div>
      </div>
    </header>
  )
}
