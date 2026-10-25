export type DestinationId = 'robredo' | 'kinalas' | 'basilica' | 'isarog' | 'quincemart'

export interface Destination {
  id: DestinationId
  name: string
  tagline: string
  category: 'history' | 'food' | 'faith' | 'nature' | 'landmark'
  icon: string
  color: string
  accentColor: string
  coords: { lat: number; lng: number }
  scene3dPos: [number, number, number]
  sceneLookAt: [number, number, number]
  description: string
  highlights: string[]
  practicalInfo: string
  image?: string
}

export const destinations: Destination[] = [
  {
    id: 'quincemart',
    name: 'Plaza Quince Martires',
    tagline: 'Heart of Naga City',
    category: 'landmark',
    icon: '🗽',
    color: '#7B3038',
    accentColor: '#C29A51',
    coords: { lat: 13.6214, lng: 123.1945 },
    scene3dPos: [0, 0, 0],
    sceneLookAt: [0, 1.0, 0],
    description:
      'Plaza Quince Martires is the historic central square of Naga City, named in honor of fifteen Filipino martyrs who perished during the Spanish colonial period. At its heart stands the Quince Martires Monument — a multi-tiered marble pedestal crowned with bronze allegorical figures and an eagle, symbolizing courage and the aspiration for freedom. Since the colonial era, this plaza has served as the civic, cultural, and spiritual center of Naga, flanked by the Naga City Hall and surrounded by the old colonial streetscape.',
    highlights: [
      'Named for fifteen Filipino martyrs',
      'Historic bronze and marble monument',
      'Colonial-era civic square',
      'Anchor of Naga City cultural life',
    ],
    practicalInfo:
      'Plaza Quince Martires is an open public space in the heart of Naga City, accessible year-round. It serves as a gathering ground for civic events, festivals, and public ceremonies throughout the year.',
    image: '/images/plaza-quince-martires.jpg',
  },
  {
    id: 'robredo',
    name: 'Jesse M. Robredo Heritage Site',
    tagline: 'The Heart of Servant Leadership',
    category: 'history',
    icon: '🏛️',
    color: '#302E2A',
    accentColor: '#C29A51',
    coords: { lat: 13.6217, lng: 123.1936 },
    scene3dPos: [-7, 0, -6],
    sceneLookAt: [-7, 0.5, -6],
    description:
      'Jesse M. Robredo (May 26, 1958 – August 18, 2012) served as Mayor of Naga City from 1988 to 1998, transforming it into a model of participatory governance. A Ramon Magsaysay Award recipient (2000) and former Secretary of the Interior and Local Government, his legacy lives in Naga\'s community-driven institutions.',
    highlights: [
      'Participatory budgeting pioneer',
      'Ramon Magsaysay Award 2000',
      'People\'s Council governance model',
      'Naga City People\'s Council founder',
    ],
    practicalInfo:
      'The Robredo heritage site is located in the civic center of Naga City. Verify current operating hours, admission details, and exhibit availability with local tourism offices before your visit.',
    image: '/images/museo-robredo.jpg',
  },
  {
    id: 'kinalas',
    name: 'Kinalas Food Trail',
    tagline: 'The Taste of Naga',
    category: 'food',
    icon: '🍜',
    color: '#B96848',
    accentColor: '#C29A51',
    coords: { lat: 13.6226, lng: 123.1951 },
    scene3dPos: [-7, 0, 6],
    sceneLookAt: [-7, 0.5, 6],
    description:
      'Kinalas is Naga City\'s signature noodle dish — thick egg noodles in a dark, savory broth made from slow-cooked pork head and spices. The name derives from the Bicolano word meaning "to scrape," referring to the process of scraping meat from the bone. It is served at carinderías across the city, most famously near the public market. The dish is topped with chicharon, green onions, and a hard-boiled egg, with calamansi squeezed in for brightness.',
    highlights: [
      'Dark broth from slow-cooked pork head',
      'Thick egg noodles with chicharon topping',
      'Try it at Cua Kim Kinalas — a Naga institution',
      'Bicolano carindería street food heritage',
    ],
    practicalInfo:
      'The most famous spot is Cua Kim Kinalas, one of Naga City\'s longest-running kinalas stalls near the public market area. Also look for Barak\'s Kinalas along Panganiban Drive. Best enjoyed early morning when the broth is freshest. Most stalls open from 5 AM until sold out.',
    image: '/images/kinalas-bowl.jpg',
  },
  {
    id: 'basilica',
    name: 'Basilica Minore of Our Lady of Peñafrancia',
    tagline: 'Ina, Our Lady of Peñafrancia',
    category: 'faith',
    icon: '⛪',
    color: '#7B3038',
    accentColor: '#C29A51',
    coords: { lat: 13.6219, lng: 123.1999 },
    scene3dPos: [7, 0, 6],
    sceneLookAt: [7, 0.5, 6],
    description:
      'The devotion to Our Lady of Peñafrancia was introduced to Naga City by Fr. Miguel Robles de Cobarrubias around 1710. The miraculous image of "Ina" (Mother) is venerated at the Basilica Minore along the Naga River. Each September, the Peñafrancia Festival draws over a million devotees for the Traslacion and the Fluvial Procession — one of the largest Marian festivals in Asia.',
    highlights: [
      'Founded c. 1710 by Fr. Cobarrubias',
      'Annual September Peñafrancia Festival',
      'Traslacion & Fluvial Procession',
      'One of Asia\'s largest Marian festivals',
    ],
    practicalInfo:
      'The Basilica Minore is open to visitors throughout the year. The annual Peñafrancia Festival takes place in September. Visitors should observe proper dress code and church protocols.',
    image: '/images/penfrancia-ina.jpg',
  },
  {
    id: 'isarog',
    name: 'Mount Isarog Natural Park',
    tagline: 'The Green Highlands',
    category: 'nature',
    icon: '🌿',
    color: '#315B43',
    accentColor: '#75845A',
    coords: { lat: 13.649, lng: 123.2868 },
    scene3dPos: [0, 0, -26],
    sceneLookAt: [0, 4, -28],
    description:
      'Mount Isarog (1,966 m) is an active stratovolcano and the centerpiece of the Mount Isarog Natural Park, declared a national park in 1938. It rises dramatically from the foothills north of Naga City and serves as the headwaters of the Naga River. The park shelters significant biodiversity including endemic and rare species of flora and fauna found nowhere else on earth.\n\nWaterfalls inside Mt. Isarog Natural Park:\n• Malabsay Falls — the most famous, a multi-tiered cascade in Panicuason barangay that plunges into a cool emerald pool\n• Nabuntolan Falls — a serene cascade tucked deep within the montane forest\n• Consocep Falls — hidden gem accessible through jungle trails in the Consocep area\n• Patag Falls — a refreshing drop surrounded by lush forest canopy\n• Tinago Falls — lesser-known but rewarding, requiring a longer trail hike',
    highlights: [
      '1,966 m active stratovolcano',
      'National Park since 1938',
      'Malabsay Falls — multi-tiered cascade',
      'Naga River headwaters',
      'DENR-administered biodiversity reserve',
    ],
    practicalInfo:
      'Trekking Mount Isarog and visiting Malabsay Falls requires permits from the DENR Camarines Sur office and a registered local guide. Access via Panicuason barangay, Naga City. Verify trail conditions, access points, and permit requirements before your visit. No solo trekking is permitted.',
    image: '/images/mt-isarog.jpg',
  },
]

export const destinationMap = Object.fromEntries(
  destinations.map((d) => [d.id, d])
) as Record<DestinationId, Destination>
