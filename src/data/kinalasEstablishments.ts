export interface KinalasEstablishment {
  id: string
  name: string
  area: string
  knownFor: string
  priceRange: '₱' | '₱₱' | '₱₱₱'
  type: 'carindería' | 'restaurant' | 'market-stall'
  tags: string[]
  note: string
}

// IMPORTANT: The establishments below are SAMPLE / PLACEHOLDER entries only.
// Real restaurant names, addresses, ratings, prices, and reviews have NOT been
// verified. Do not present this data as authoritative business listings.
// Users should verify current operating establishments through local tourism
// offices, Google Maps, or the Naga City local government website.
export const kinalasEstablishments: KinalasEstablishment[] = [
  {
    id: 'sample-1',
    name: 'Sample Carindería A',
    area: 'Public Market District',
    knownFor: 'Traditional dark broth kinalas',
    priceRange: '₱',
    type: 'market-stall',
    tags: ['traditional', 'market', 'early-morning'],
    note: 'SAMPLE DATA — Verify actual establishments with local tourism office.',
  },
  {
    id: 'sample-2',
    name: 'Sample Carindería B',
    area: 'City Center',
    knownFor: 'Kinalas with tokwa and pork slices',
    priceRange: '₱',
    type: 'carindería',
    tags: ['classic', 'city-center', 'lunch'],
    note: 'SAMPLE DATA — Verify actual establishments with local tourism office.',
  },
  {
    id: 'sample-3',
    name: 'Sample Restaurant C',
    area: 'Near Naga River',
    knownFor: 'Kinalas and other Bicolano dishes',
    priceRange: '₱₱',
    type: 'restaurant',
    tags: ['sit-down', 'bicolano', 'family'],
    note: 'SAMPLE DATA — Verify actual establishments with local tourism office.',
  },
]

export const kinalasCategories = [
  { id: 'all', label: 'All' },
  { id: 'carindería', label: 'Carinderías' },
  { id: 'restaurant', label: 'Restaurants' },
  { id: 'market-stall', label: 'Market Stalls' },
]
