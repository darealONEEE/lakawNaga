export type DestinationId = 'robredo' | 'kinalas' | 'basilica' | 'isarog'

export interface Destination {
  id: DestinationId
  name: string
  tagline: string
  category: 'history' | 'food' | 'faith' | 'nature'
  icon: string
  color: string
  accentColor: string
  coords: { lat: number; lng: number }
  scene3dPos: [number, number, number]
  sceneLookAt: [number, number, number]
  description: string
  highlights: string[]
  practicalInfo: string
}

export const destinations: Destination[] = [
  {
    id: 'robredo',
    name: 'Jesse M. Robredo Heritage Site',
    tagline: 'The Heart of Servant Leadership',
    category: 'history',
    icon: '🏛️',
    color: '#302E2A',
    accentColor: '#C29A51',
    // Approximate — Naga City Hall area; verify with official sources before publication
    coords: { lat: 13.6217, lng: 123.1936 },
    scene3dPos: [-4, 0, -3.5],
    sceneLookAt: [-4, 0.5, -3.5],
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
  },
  {
    id: 'kinalas',
    name: 'Kinalas Food Trail',
    tagline: 'The Taste of Naga',
    category: 'food',
    icon: '🍜',
    color: '#B96848',
    accentColor: '#C29A51',
    // Approximate — public market area; verify with official sources before publication
    coords: { lat: 13.6226, lng: 123.1951 },
    scene3dPos: [-4.5, 0, 3.5],
    sceneLookAt: [-4.5, 0.5, 3.5],
    description:
      'Kinalas is Naga City\'s signature noodle dish — thick egg noodles in a dark, savory broth made from slow-cooked pork head and spices. The name derives from the Bicolano word meaning "to scrape," referring to the process of scraping meat from the bone. It is served at carinderías across the city, most famously near the public market.',
    highlights: [
      'Dark broth from pork head',
      'Thick egg noodles',
      'Carinderíaà culture',
      'Bicolano street food heritage',
    ],
    practicalInfo:
      'Kinalas is widely available at carinderías around the Naga City public market area. Hours and specific stall locations vary. Explore the market district early morning for the freshest servings.',
  },
  {
    id: 'basilica',
    name: 'Basilica Minore of Our Lady of Peñafrancia',
    tagline: 'Ina, Our Lady of Peñafrancia',
    category: 'faith',
    icon: '⛪',
    color: '#7B3038',
    accentColor: '#C29A51',
    // Approximate — along Naga River, east of plaza; verify with official sources before publication
    coords: { lat: 13.6219, lng: 123.1999 },
    scene3dPos: [4.5, 0, 3],
    sceneLookAt: [4.5, 0.5, 3],
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
  },
  {
    id: 'isarog',
    name: 'Mount Isarog Natural Park',
    tagline: 'The Green Highlands',
    category: 'nature',
    icon: '🌿',
    color: '#315B43',
    accentColor: '#75845A',
    // Approximate — Mount Isarog summit area; verify with DENR before planning a visit
    coords: { lat: 13.649, lng: 123.2868 },
    scene3dPos: [4, 0, -4.5],
    sceneLookAt: [4, 0.5, -4.5],
    description:
      'Mount Isarog (1,966 m) is an active stratovolcano and the centerpiece of the Mount Isarog Natural Park, declared a national park in 1938 and administered by DENR. It serves as the headwaters of the Naga River and shelters significant biodiversity including endemic flora and fauna. Trekking requires coordination with DENR and registered local guides.',
    highlights: [
      '1,966 m active stratovolcano',
      'National Park since 1938',
      'Naga River headwaters',
      'DENR-administered biodiversity',
    ],
    practicalInfo:
      'Trekking Mount Isarog requires permits from the DENR Camarines Sur office and a registered local guide. Verify trail conditions, access points, and permit requirements before your visit. No solo trekking is permitted.',
  },
]

export const destinationMap = Object.fromEntries(
  destinations.map((d) => [d.id, d])
) as Record<DestinationId, Destination>
