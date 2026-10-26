export interface KinalasSpot {
  id: string
  name: string
  area: string
  knownFor: string
  note: string
}

// Known kinalas spots in Naga City.
// Addresses and hours change — verify with Google Maps or local tourism before visiting.
export const kinalasSpots: KinalasSpot[] = [
  {
    id: 'reys',
    name: "Rey's Kinalas",
    area: 'Near Naga City Public Market',
    knownFor: 'Rich, dark broth with thick egg noodles, chicharon, and shredded pork',
    note: 'One of the most iconic and long-standing kinalas carinderías in Naga — a landmark for locals and visitors.',
  },
  {
    id: 'josies',
    name: "Josie's Kinalas",
    area: 'City Center / Public Market District',
    knownFor: 'Classic Nagueño kinalas served generously, best paired with puto',
    note: 'A crowd favorite open early in the morning — arrive before the lunch rush.',
  },
  {
    id: 'mias',
    name: "Mia's Kinalas",
    area: 'CBD / Elias Angeles Street',
    knownFor: 'Smooth, deeply flavored broth with perfectly soft noodles',
    note: 'Popular among students and office workers in the central business district.',
  },
  {
    id: 'aling-nena',
    name: "Aling Nena's Kinalas",
    area: 'Old Market, Naga City',
    knownFor: 'Traditional home-style kinalas with extra pork toppings',
    note: 'A no-frills carindería that has kept the old Bicol recipe unchanged for decades.',
  },
  {
    id: 'bobs',
    name: "Bob's Kinalas",
    area: 'Magsaysay Avenue',
    knownFor: 'Hearty kinalas with chili vinegar on the side',
    note: 'Known for big portions and the option to customize toppings — great for first-timers.',
  },
  {
    id: 'tita-luz',
    name: "Tita Luz Kinalas",
    area: 'Near Peñafrancia Basilica',
    knownFor: 'Festival-style kinalas — especially popular during the Peñafrancia fiesta',
    note: 'Sets up early and sells out fast; a pilgrimage staple for devotees visiting the Basilica.',
  },
  {
    id: 'karamihan',
    name: 'Kinalas sa Karamihan',
    area: 'Concepcion Pequeña District',
    knownFor: 'Community-style serving with communal seating and puso rice',
    note: 'A neighborhood staple beloved for its affordable price and authentic Bicol flavors.',
  },
  {
    id: 'rufo',
    name: "Rufo's Kinalas",
    area: 'Triangulo, Naga City',
    knownFor: 'Pork and beef mixed broth with crispy chicharon topping',
    note: 'Late-morning spot that draws a loyal following for its consistently deep broth.',
  },
  {
    id: 'nanay-caring',
    name: "Nanay Caring's Kinalas",
    area: 'Igualdad Street',
    knownFor: 'Old-school Naga kinalas with soft-boiled egg and green onion',
    note: 'Family-run for over 30 years; the matriarch still oversees the kitchen daily.',
  },
  {
    id: 'plaza-kinalas',
    name: 'Plaza Kinalas',
    area: 'Near Plaza Quince Martires',
    knownFor: 'Tourist-friendly serving with English menu and Bicol heritage display',
    note: 'Conveniently located for visitors exploring the heritage district — open all day.',
  },
]

// Keep old export for backward compat during refactor
export const kinalasEstablishments = kinalasSpots.map(s => ({
  ...s,
  priceRange: '₱' as const,
  type: 'carindería' as const,
  tags: [],
}))
export const kinalasCategories = [
  { id: 'all', label: 'All' },
  { id: 'carindería', label: 'Carinderías' },
  { id: 'restaurant', label: 'Restaurants' },
  { id: 'market-stall', label: 'Market Stalls' },
]
