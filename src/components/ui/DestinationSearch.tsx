import { useRef, useEffect } from 'react'
import { useAppStore } from '../../store/appStore'
import { destinations } from '../../data/destinations'
import type { DestinationId } from '../../data/destinations'

const categoryFilters = [
  { id: 'all', label: 'All' },
  { id: 'history', label: 'History' },
  { id: 'food', label: 'Food' },
  { id: 'faith', label: 'Faith' },
  { id: 'nature', label: 'Nature' },
] as const

export function DestinationSearch() {
  const { searchQuery, setSearchQuery, categoryFilter, setCategoryFilter, setSearchOpen, selectDestination } = useAppStore()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const filtered = destinations.filter((d) => {
    const matchCat = categoryFilter === 'all' || d.category === categoryFilter
    const q = searchQuery.toLowerCase()
    const matchQ = !q || d.name.toLowerCase().includes(q) || d.tagline.toLowerCase().includes(q) || d.category.includes(q)
    return matchCat && matchQ
  })

  const handleSelect = (id: DestinationId) => {
    selectDestination(id)
    setSearchOpen(false)
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setSearchOpen(false)
  }

  return (
    <div
      className="search-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Search destinations"
      onClick={handleOverlayClick}
    >
      <div className="search-modal" role="search">
        {/* Input row */}
        <div className="search-input-row">
          <svg className="search-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            className="search-input"
            type="search"
            placeholder="Search destinations…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search destinations"
          />
          <button
            className="search-close-btn"
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
          >
            ✕
          </button>
        </div>

        {/* Category filters */}
        <div className="search-filters" role="group" aria-label="Filter by category">
          {categoryFilters.map((f) => (
            <button
              key={f.id}
              className={`search-filter-btn${categoryFilter === f.id ? ' active' : ''}`}
              onClick={() => setCategoryFilter(f.id)}
              aria-pressed={categoryFilter === f.id}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="search-results" role="listbox" aria-label="Destination results">
          {filtered.length === 0 && (
            <p style={{ padding: 'var(--space-4)', color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
              No destinations match your search.
            </p>
          )}
          {filtered.map((dest) => (
            <div
              key={dest.id}
              className="search-result-item"
              role="option"
              aria-selected={false}
              onClick={() => handleSelect(dest.id)}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(dest.id) } }}
            >
              <div
                className="search-result-icon"
                style={{ background: `${dest.color}22` }}
                aria-hidden="true"
              >
                {dest.icon}
              </div>
              <div>
                <div className="search-result-name">{dest.name}</div>
                <div className="search-result-tagline">{dest.tagline}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
