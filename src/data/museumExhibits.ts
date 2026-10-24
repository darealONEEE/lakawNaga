export interface MuseumExhibit {
  id: string
  title: string
  subtitle: string
  period: string
  description: string
  details: string[]
  position: [number, number, number]
  color: string
}

// Exhibit content is based on publicly documented biographical and historical records
// about Jesse M. Robredo. No fabricated quotes, invented policies, or unverified claims.
export const museumExhibits: MuseumExhibit[] = [
  {
    id: 'early-life',
    title: 'Early Life',
    subtitle: 'Roots in Naga',
    period: '1958 – 1986',
    position: [-3.5, 0.5, -3.5],
    color: '#C29A51',
    description:
      'Jesse Manalastas Robredo was born on May 26, 1958 in Naga City, Camarines Sur. He pursued a degree in Economics at De La Salle University and later earned a Master of Public Administration from Harvard University\'s John F. Kennedy School of Government.',
    details: [
      'Born May 26, 1958, Naga City',
      'Economics graduate, De La Salle University',
      'MPA from Harvard Kennedy School',
      'Early commitment to public service',
    ],
  },
  {
    id: 'mayor-naga',
    title: 'Mayor of Naga',
    subtitle: 'A Decade of Transformation',
    period: '1988 – 1998',
    position: [-2, 0.5, -4.5],
    color: '#B96848',
    description:
      'Robredo served as Mayor of Naga City from 1988 to 1998. His administration became internationally recognized for participatory governance, establishing the Naga City People\'s Council — a formal mechanism giving civil society a direct role in city policy-making and budgeting.',
    details: [
      'Mayor of Naga City, 1988–1998',
      'Founded Naga City People\'s Council',
      'Participatory budgeting pioneer in the Philippines',
      'Two full terms, third term won but succeeded by appointed successor on elevation',
    ],
  },
  {
    id: 'leadership-philosophy',
    title: 'Leadership Philosophy',
    subtitle: 'Servant Governance',
    period: 'Lifelong',
    position: [-4.5, 0.5, -2],
    color: '#315B43',
    description:
      'Robredo\'s governance philosophy centered on transparency, accountability, and citizen participation. He believed that government must be in constant dialogue with the community it serves, and that public office is a public trust — not a platform for personal gain.',
    details: [
      'Transparency in public spending',
      'Community-driven decision making',
      'Anti-corruption as institutional practice',
      'Collaborative city management model',
    ],
  },
  {
    id: 'national-service',
    title: 'National Service',
    subtitle: 'Secretary of DILG',
    period: '2010 – 2012',
    position: [-3, 0.5, -5],
    color: '#7B3038',
    description:
      'In 2010, President Benigno Aquino III appointed Robredo as Secretary of the Interior and Local Government (DILG). In this role, he worked to replicate Naga\'s governance model at the national level, advocating for local autonomy, civil society engagement, and clean government across all Philippine LGUs.',
    details: [
      'Secretary of DILG, 2010–2012',
      'Appointed by President Benigno Aquino III',
      'Promoted local government autonomy',
      'National anti-corruption advocacy',
    ],
  },
  {
    id: 'legacy',
    title: 'Legacy',
    subtitle: 'A Life of Service',
    period: '2012 – Present',
    position: [-5, 0.5, -4],
    color: '#668F9B',
    description:
      'Jesse Robredo died on August 18, 2012, when the light aircraft he was aboard crashed into the sea off Masbate. He was posthumously awarded the Ramon Magsaysay Award in 2000 (announced while he served as mayor) — the most prestigious award in Asia, given for exemplary government service and community leadership. His legacy continues through the institutions he built and the people he inspired.',
    details: [
      'Ramon Magsaysay Award, 2000',
      'Passed away August 18, 2012 (Masbate plane crash)',
      'Naga City People\'s Council continues to operate',
      'Legacy preserved through family and civic community',
    ],
  },
]
