// ============================================
// DEEP OCEAN INTELLIGENCE ARCHIVE - DATA
// ============================================

export interface DepthZone {
  id: string;
  name: string;
  nameLat: string;
  depthRange: [number, number];
  description: string;
  color: string;
  bgGradient: string;
  pressure: string;
  temperature: string;
  facts: string[];
}

export interface Creature {
  id: string;
  commonName: string;
  scientificName: string;
  depthRange: [number, number];
  zone: string;
  description: string;
  size: string;
  diet: string;
  conservationStatus: 'LC' | 'NT' | 'VU' | 'EN' | 'CR' | 'DD';
  funFact: string;
  bioluminescent: boolean;
  firstDiscovered: string;
  emoji: string;
  color: string;
}

export interface Expedition {
  id: string;
  name: string;
  vehicle: string;
  year: number;
  maxDepth: number;
  description: string;
  achievement: string;
  country: string;
}

export interface PressureObject {
  id: string;
  name: string;
  icon: string;
  effects: Record<number, string>;
  collapseDepth: number;
}

export const DEPTH_ZONES: DepthZone[] = [
  {
    id: 'sunlight',
    name: 'Sunlight Zone',
    nameLat: 'Epipelagic Zone',
    depthRange: [0, 200],
    description: 'Where light still penetrates. The ocean\'s most vibrant and life-filled region. Photosynthesis fuels entire food chains here, from microscopic phytoplankton to massive whale sharks.',
    color: '#0E4D64',
    bgGradient: 'linear-gradient(180deg, #0A3D4F 0%, #0E4D64 30%, #0A1628 100%)',
    pressure: '1-20 atm',
    temperature: '15-30°C',
    facts: [
      'Contains over 90% of all marine life',
      'Photosynthesis occurs up to 200m deep',
      'Coral reefs exist primarily in this zone',
      'Home to the fastest fish — the sailfish at 110 km/h',
    ],
  },
  {
    id: 'twilight',
    name: 'Twilight Zone',
    nameLat: 'Mesopelagic Zone',
    depthRange: [200, 1000],
    description: 'Light fades to near-darkness. Creatures here have evolved enormous eyes, translucent bodies, and the first sparks of bioluminescence. The largest animal migration on Earth happens here daily.',
    color: '#071828',
    bgGradient: 'linear-gradient(180deg, #0A1628 0%, #071828 40%, #050A0E 100%)',
    pressure: '20-100 atm',
    temperature: '5-15°C',
    facts: [
      'The daily vertical migration moves billions of animals',
      'Many creatures are transparent to avoid detection',
      'First bioluminescent organisms appear here',
      'The "sound channel" — where whale songs travel farthest',
    ],
  },
  {
    id: 'midnight',
    name: 'Midnight Zone',
    nameLat: 'Bathypelagic Zone',
    depthRange: [1000, 4000],
    description: 'Absolute darkness. No sunlight has ever reached here. Life survives on "marine snow" — organic debris falling from above. Bioluminescence is the only light, evolved for hunting, mating, and deception.',
    color: '#050A0E',
    bgGradient: 'linear-gradient(180deg, #050A0E 0%, #030508 50%, #020305 100%)',
    pressure: '100-400 atm',
    temperature: '2-4°C',
    facts: [
      'Zero natural light penetrates this zone',
      'Creatures can withstand 400x surface pressure',
      'Many fish have no swim bladder — they\'re built for pressure',
      'Giant squid were only filmed alive here in 2004',
    ],
  },
  {
    id: 'abyssal',
    name: 'Abyssal Zone',
    nameLat: 'Abyssopelagic Zone',
    depthRange: [4000, 6000],
    description: 'The abyss. Three-quarters of the ocean floor lies in this zone. Hydrothermal vents create oasis ecosystems powered by chemosynthesis — life from chemical energy, independent of sunlight entirely.',
    color: '#020305',
    bgGradient: 'linear-gradient(180deg, #020305 0%, #010203 50%, #010102 100%)',
    pressure: '400-600 atm',
    temperature: '1-2°C',
    facts: [
      'Covers 83% of the ocean floor',
      'Hydrothermal vents reach 400°C but surrounding water is near freezing',
      'Life here was thought impossible until 1977',
      'Some organisms here can live for over 1000 years',
    ],
  },
  {
    id: 'hadal',
    name: 'Hadal Zone',
    nameLat: 'Hadopelagic Zone',
    depthRange: [6000, 11000],
    description: 'The deepest places on Earth. Named after Hades, god of the underworld. Only found in ocean trenches — the Mariana Trench reaches 10,935m. Even here, life persists in unimaginable conditions.',
    color: '#010102',
    bgGradient: 'linear-gradient(180deg, #010102 0%, #000000 50%, #000000 100%)',
    pressure: '600-1100 atm',
    temperature: '1-4°C',
    facts: [
      'Only 3% of the seafloor is hadal',
      'Pressure equals 50 jumbo jets stacked on a person',
      'The Mariana Trench is deeper than Mount Everest is tall',
      'Supergiant amphipods grow 20x larger than shallow cousins',
    ],
  },
];

export const CREATURES: Creature[] = [
  // Sunlight Zone
  {
    id: 'blue-whale',
    commonName: 'Blue Whale',
    scientificName: 'Balaenoptera musculus',
    depthRange: [0, 200],
    zone: 'sunlight',
    description: 'The largest animal ever to have lived on Earth. Their hearts are the size of a small car, and their tongues weigh as much as an elephant. A blue whale\'s call can be heard from over 1,600 km away.',
    size: 'Up to 30m (98ft)',
    diet: 'Krill — up to 3,600 kg per day',
    conservationStatus: 'EN',
    funFact: 'A baby blue whale gains about 90 kg per day during its first year.',
    bioluminescent: false,
    firstDiscovered: 'Described by Linnaeus, 1758',
    emoji: '🐋',
    color: '#4A90D9',
  },
  {
    id: 'sea-turtle',
    commonName: 'Green Sea Turtle',
    scientificName: 'Chelonia mydas',
    depthRange: [0, 110],
    zone: 'sunlight',
    description: 'Ancient mariners that have navigated Earth\'s oceans for 110 million years. They can hold their breath for up to 5 hours by slowing their heart rate to one beat every 9 minutes.',
    size: 'Up to 1.5m (5ft)',
    diet: 'Seagrasses, algae (adults are herbivores)',
    conservationStatus: 'EN',
    funFact: 'They navigate using Earth\'s magnetic field, returning to the exact beach where they hatched.',
    bioluminescent: false,
    firstDiscovered: 'Known to ancient civilizations',
    emoji: '🐢',
    color: '#2D8B46',
  },
  {
    id: 'mola-mola',
    commonName: 'Ocean Sunfish',
    scientificName: 'Mola mola',
    depthRange: [0, 200],
    zone: 'sunlight',
    description: 'The heaviest bony fish in the world. With a flattened body and no true tail, they look like a giant swimming head. They produce the most eggs of any vertebrate — up to 300 million at once.',
    size: 'Up to 3.3m (10.8ft), 2,300 kg',
    diet: 'Jellyfish, salps, zooplankton',
    conservationStatus: 'VU',
    funFact: 'Their skin can be up to 7.6cm thick, covered in mucus to protect against parasites.',
    bioluminescent: false,
    firstDiscovered: 'First described in 1758',
    emoji: '🐟',
    color: '#7B8FA1',
  },
  // Twilight Zone
  {
    id: 'giant-squid',
    commonName: 'Giant Squid',
    scientificName: 'Architeuthis dux',
    depthRange: [300, 1000],
    zone: 'twilight',
    description: 'Legendary creatures of the deep, once thought to be sea monsters. With eyes the size of dinner plates — the largest in the animal kingdom — they hunt in total darkness using their sophisticated vision.',
    size: 'Up to 13m (43ft) for females',
    diet: 'Deep-sea fish and other squid',
    conservationStatus: 'LC',
    funFact: 'They were never filmed alive in their natural habitat until 2004 by Japanese researchers.',
    bioluminescent: false,
    firstDiscovered: 'First scientifically described in 1857',
    emoji: '🦑',
    color: '#8B3A62',
  },
  {
    id: 'hatchetfish',
    commonName: 'Hatchetfish',
    scientificName: 'Sternoptychidae',
    depthRange: [200, 800],
    zone: 'twilight',
    description: 'Paper-thin fish with silvery bodies that act as mirrors. Their flat shape makes them nearly invisible from below, blending with the faint light above. They use photophores on their bellies to counter-illuminate.',
    size: '2-12cm (0.8-4.7in)',
    diet: 'Zooplankton, small crustaceans',
    conservationStatus: 'LC',
    funFact: 'Their tube-shaped eyes point upward to spot predators silhouetted against faint surface light.',
    bioluminescent: true,
    firstDiscovered: 'Family described in the 1800s',
    emoji: '刃',
    color: '#C0C8D4',
  },
  {
    id: 'swordfish',
    commonName: 'Swordfish',
    scientificName: 'Xiphias gladius',
    depthRange: [200, 800],
    zone: 'twilight',
    description: 'Apex predators of the mesopelagic, they use their sword-like bills to slash through schools of fish. They have special organs near their eyes that heat their brain and eyes by up to 15°C for sharper vision in cold depths.',
    size: 'Up to 4.5m (14.8ft), 650 kg',
    diet: 'Fish, squid',
    conservationStatus: 'VU',
    funFact: 'They can heat their eyes and brain to 15°C above ambient water temperature.',
    bioluminescent: false,
    firstDiscovered: 'Known since antiquity',
    emoji: '🗡',
    color: '#4A6B8A',
  },
  // Midnight Zone
  {
    id: 'anglerfish',
    commonName: 'Anglerfish',
    scientificName: 'Lophiiformes',
    depthRange: [1000, 4000],
    zone: 'midnight',
    description: 'Iconic deep-sea predators with a bioluminescent lure dangling from their head like a fishing rod. In some species, the male is a tiny parasite that fuses permanently to the female\'s body, sharing her blood supply.',
    size: '20-100cm (8-39in)',
    diet: 'Fish, crustaceans — attracted by their glowing lure',
    conservationStatus: 'LC',
    funFact: 'Male anglerfish permanently fuse with females, becoming a parasitic appendage that produces sperm.',
    bioluminescent: true,
    firstDiscovered: 'First described by Albert Günther, 1864',
    emoji: '🎣',
    color: '#FFB347',
  },
  {
    id: 'viperfish',
    commonName: 'Viperfish',
    scientificName: 'Chauliodus sloani',
    depthRange: [500, 2500],
    zone: 'midnight',
    description: 'One of the most ferocious-looking deep-sea fish, with fangs so long they don\'t fit inside its mouth. They curve back toward the eyes. Their photophores along their belly create a faint glow to attract prey.',
    size: '30-60cm (12-24in)',
    diet: 'Small fish, crustaceans',
    conservationStatus: 'LC',
    funFact: 'Their hinged skull allows them to swallow prey larger than themselves.',
    bioluminescent: true,
    firstDiscovered: 'First described by Solander, 1763',
    emoji: '🐍',
    color: '#2A4A6B',
  },
  {
    id: 'giant-isopod',
    commonName: 'Giant Isopod',
    scientificName: 'Bathynomus giganteus',
    depthRange: [500, 2500],
    zone: 'midnight',
    description: 'Massive deep-sea crustaceans that look like oversized pillbugs. They can grow up to 76cm and survive for over 5 years without eating. When food arrives, they gorge themselves to the point of immobility.',
    size: 'Up to 76cm (30in)',
    diet: 'Scavenger — fish, whales, squid carcasses',
    conservationStatus: 'LC',
    funFact: 'They can survive over 5 years without any food — the ultimate survival strategy.',
    bioluminescent: false,
    firstDiscovered: 'First described by Alphonse Milne-Edwards, 1879',
    emoji: '🪲',
    color: '#8B7355',
  },
  {
    id: 'barreleye',
    commonName: 'Barreleye Fish',
    scientificName: 'Macropinna microstoma',
    depthRange: [600, 2500],
    zone: 'midnight',
    description: 'Perhaps the strangest fish alive — its tubular eyes are enclosed in a transparent, fluid-filled dome on top of its head. The eyes can rotate to look straight up through its own forehead to spot prey above.',
    size: 'Up to 15cm (6in)',
    diet: 'Siphonophores, small jellyfish',
    conservationStatus: 'LC',
    funFact: 'Its transparent head shield was unknown until 2004 when live specimens were first observed.',
    bioluminescent: false,
    firstDiscovered: 'First described in 1939, first filmed alive 2004',
    emoji: '👁',
    color: '#3A6B8A',
  },
  // Abyssal Zone
  {
    id: 'dumbo-octopus',
    commonName: 'Dumbo Octopus',
    scientificName: 'Grimpoteuthis',
    depthRange: [3000, 7000],
    zone: 'abyssal',
    description: 'Named for their ear-like fins that resemble Disney\'s Dumbo, these are the deepest-living octopuses known. They hover above the seafloor, pouncing on worms and snails. They swallow prey whole, unlike other octopuses.',
    size: '20-30cm (8-12in)',
    diet: 'Worms, snails, crustaceans',
    conservationStatus: 'DD',
    funFact: 'They can swim by flapping their "ears" or crawl on the seafloor with their tentacles.',
    bioluminescent: false,
    firstDiscovered: 'First described in the 1900s',
    emoji: '🐙',
    color: '#D4A5C0',
  },
  {
    id: 'sea-pig',
    commonName: 'Sea Pig',
    scientificName: 'Scotoplanes',
    depthRange: [3000, 5000],
    zone: 'abyssal',
    description: 'Bizarre deep-sea sea cucumbers that look like translucent pink pigs with legs. They roam the abyssal plain in herds of hundreds, using tube feet to walk and feeding on organic particles in the mud.',
    size: '5-15cm (2-6in)',
    diet: 'Detritus, organic particles in mud',
    conservationStatus: 'LC',
    funFact: 'They always face the same direction — into the current — to catch drifting food particles.',
    bioluminescent: false,
    firstDiscovered: 'First described by Hjalmar Théel, 1882',
    emoji: '🐷',
    color: '#E8B4C8',
  },
  {
    id: 'deep-sea-coral',
    commonName: 'Deep-Sea Coral',
    scientificName: 'Lophelia pertusa',
    depthRange: [200, 6000],
    zone: 'abyssal',
    description: 'Unlike tropical corals, deep-sea corals don\'t need sunlight. They form vast reefs in cold, dark waters that can be thousands of years old. Some deep coral colonies have been dated to over 4,000 years old.',
    size: 'Colonies can span hundreds of meters',
    diet: 'Filter feeder — zooplankton, organic particles',
    conservationStatus: 'VU',
    funFact: 'Deep coral reefs can be older than the pyramids of Egypt.',
    bioluminescent: false,
    firstDiscovered: 'Known since the 1700s, full extent discovered 1990s',
    emoji: '🪸',
    color: '#FF7F7F',
  },
  // Hadal Zone
  {
    id: 'mariana-snailfish',
    commonName: 'Mariana Snailfish',
    scientificName: 'Pseudoliparis swirei',
    depthRange: [6000, 8200],
    zone: 'hadal',
    description: 'The deepest-living fish ever discovered. Small, pink, and scaleless, they look almost tadpole-like. They survive at pressures that would crush other animals instantly, their bodies adapted with flexible bones and special proteins.',
    size: 'Up to 28cm (11in)',
    diet: 'Amphipods, small crustaceans',
    conservationStatus: 'DD',
    funFact: 'At their depth, the pressure is over 800 times atmospheric — like having 50 jumbo jets on your chest.',
    bioluminescent: false,
    firstDiscovered: 'Discovered in 2014 in the Mariana Trench',
    emoji: '🐟',
    color: '#FFB6C1',
  },
  {
    id: 'hadal-amphipod',
    commonName: 'Supergiant Amphipod',
    scientificName: 'Alicella gigantea',
    depthRange: [5000, 11000],
    zone: 'hadal',
    description: 'Deep-sea crustaceans that grow 20 times larger than their shallow-water relatives — a phenomenon called "deep-sea gigantism." These "supergiants" can reach up to 34cm, making them the largest amphipods in the world.',
    size: 'Up to 34cm (13.4in)',
    diet: 'Scavenger — detritus, whale falls',
    conservationStatus: 'DD',
    funFact: 'Their extreme size at depth is one of science\'s most puzzling mysteries.',
    bioluminescent: false,
    firstDiscovered: 'First collected in the 1890s',
    emoji: '🦐',
    color: '#C8A882',
  },
  {
    id: 'xenophyophore',
    commonName: 'Xenophyophore',
    scientificName: 'Xenophyophorea',
    depthRange: [6000, 11000],
    zone: 'hadal',
    description: 'Among the largest single-celled organisms on Earth, reaching up to 20cm across. These giant protozoans build elaborate "tests" (shells) from sand, sediment, and the shells of dead foraminifera on the ocean floor.',
    size: 'Up to 20cm (8in)',
    diet: 'Organic particles, bacteria',
    conservationStatus: 'DD',
    funFact: 'They are single cells — one of nature\'s most extreme examples of cellular gigantism.',
    bioluminescent: false,
    firstDiscovered: 'First described in the late 1800s',
    emoji: '🫧',
    color: '#8B9DC3',
  },
];

export const EXPEDITIONS: Expedition[] = [
  {
    id: 'trieste',
    name: 'Project Nekton',
    vehicle: 'Trieste Bathyscaphe',
    year: 1960,
    maxDepth: 10916,
    description: 'The first crewed descent to the bottom of the Mariana Trench. Lt. Don Walsh and Jacques Piccard spent 20 minutes at the bottom, observing flatfish and shrimp through a small acrylic window.',
    achievement: 'First humans to reach the deepest point on Earth — Challenger Deep',
    country: '🇺🇸🇨🇭 US/Switzerland',
  },
  {
    id: 'alvin',
    name: 'Hydrothermal Vent Discovery',
    vehicle: 'DSV Alvin',
    year: 1977,
    maxDepth: 2500,
    description: 'Discovered the first hydrothermal vents and their thriving ecosystems at the Galápagos Rift. Found towering chimneys of minerals, tube worms, and clams — life powered by chemistry, not sunlight.',
    achievement: 'Discovery of chemosynthetic ecosystems — rewrote our understanding of life',
    country: '🇺🇸 United States',
  },
  {
    id: 'kaiko',
    name: 'Kaiko Deep Dive',
    vehicle: 'ROV Kaikō',
    year: 1995,
    maxDepth: 10911,
    description: 'Uncrewed Japanese submersible that reached the bottom of the Challenger Deep, collecting sediment samples and photographing deep-sea life. It made 296 dives before being lost in a typhoon.',
    achievement: 'Deepest uncrewed dive, collected invaluable sediment samples',
    country: '🇯🇵 Japan',
  },
  {
    id: 'deepsea-challenger',
    name: 'Deepsea Challenger Mission',
    vehicle: 'Deepsea Challenger',
    year: 2012,
    maxDepth: 10908,
    description: 'Filmmaker James Cameron became the first solo person to reach the Challenger Deep. He spent 3 hours at the bottom, collecting samples and filming in 3D. The vehicle was designed and built in secret in Australia.',
    achievement: 'First solo descent to the deepest point on Earth',
    country: '🇺🇸🇦🇺 US/Australia',
  },
  {
    id: 'titan',
    name: 'Titan Submersible',
    vehicle: 'Titan',
    year: 2023,
    maxDepth: 3800,
    description: 'Tourist submersible that imploded during a descent to the Titanic wreck site, killing all five aboard. The disaster highlighted the dangers of deep-sea exploration and regulatory gaps in the industry.',
    achievement: 'Tragic reminder of the ocean\'s unforgiving power',
    country: '🇺🇸🇬🇧 US/UK',
  },
];

export const PRESSURE_OBJECTS: PressureObject[] = [
  {
    id: 'styrofoam-cup',
    name: 'Styrofoam Cup',
    icon: '☕',
    effects: {
      0: 'Normal size — about 12cm tall.',
      1000: 'Noticeably compressed. About 70% of original size.',
      3000: 'Dramatically shrunken. About 40% of original size.',
      6000: 'Tiny and dense. About 25% of original size.',
      11000: 'Minuscule dense lump. About 15% of original size.',
    },
    collapseDepth: 0,
  },
  {
    id: 'human-body',
    name: 'Human Body',
    icon: '🧍',
    effects: {
      0: 'Perfectly comfortable at 1 atmosphere.',
      200: 'Max safe diving depth for trained scuba divers.',
      500: 'Compression sickness risk. Nitrogen narcosis begins.',
      1000: 'Human lungs would collapse without protection.',
      3000: 'Specialized submersible required. Hull groans audibly.',
      6000: 'Pressure equals 6,000 kg per square centimeter.',
      11000: 'Pressure equivalent to 50 jumbo jets stacked on a person.',
    },
    collapseDepth: 300,
  },
  {
    id: 'submarine',
    name: 'Military Submarine',
    icon: '🚢',
    effects: {
      0: 'Surface operations. Full crew capacity.',
      300: 'Standard crush depth for most military submarines.',
      500: 'Beyond test depth. Hull deformation detectable.',
      700: 'Approaching collapse depth. Continuous monitoring.',
      900: 'Structural failure likely. Hull begins to buckle.',
      1100: 'Complete catastrophic implosion.',
    },
    collapseDepth: 730,
  },
  {
    id: 'aluminum-can',
    name: 'Aluminum Soda Can',
    icon: '🥫',
    effects: {
      0: 'Normal — holds 355ml of liquid.',
      200: 'Slight denting from external pressure.',
      1000: 'Heavily crushed. About 30% of original volume.',
      3000: 'Flat aluminum disc. Completely unrecognizable.',
      6000: 'Compressed into an incredibly dense metal puck.',
      11000: 'Molecularly compressed. Could theoretically become a new alloy.',
    },
    collapseDepth: 200,
  },
];

export const SOUNDSCAPES = [
  { id: 'whale-song', name: 'Humpback Whale Song', frequency: 120, type: 'whale' as const },
  { id: 'sonar-ping', name: 'Submarine Sonar', frequency: 2000, type: 'sonar' as const },
  { id: 'earthquake', name: 'Tectonic Shift', frequency: 20, type: 'quake' as const },
  { id: 'ice-cracking', name: 'Polar Ice Cracking', frequency: 800, type: 'ice' as const },
  { id: 'dolphin', name: 'Dolphin Echolocation', frequency: 4000, type: 'dolphin' as const },
  { id: 'volcano', name: 'Underwater Volcano', frequency: 50, type: 'volcano' as const },
];

export function getZoneForDepth(depth: number): DepthZone | undefined {
  return DEPTH_ZONES.find(z => depth >= z.depthRange[0] && depth < z.depthRange[1]);
}

export function getCreaturesForZone(zoneId: string): Creature[] {
  return CREATURES.filter(c => c.zone === zoneId);
}

export function getConservationLabel(status: string): string {
  const labels: Record<string, string> = {
    LC: 'Least Concern',
    NT: 'Near Threatened',
    VU: 'Vulnerable',
    EN: 'Endangered',
    CR: 'Critically Endangered',
    DD: 'Data Deficient',
  };
  return labels[status] || status;
}

export function getConservationColor(status: string): string {
  const colors: Record<string, string> = {
    LC: '#4CAF50',
    NT: '#FFC107',
    VU: '#FF9800',
    EN: '#FF5722',
    CR: '#FF0000',
    DD: '#9E9E9E',
  };
  return colors[status] || '#9E9E9E';
}

export function calculatePressure(depth: number): number {
  // Pressure increases by approximately 1 atm per 10m of seawater
  return Math.round(1 + (depth / 10));
}

export function calculateTemperature(depth: number): number {
  // Simplified temperature profile
  if (depth <= 200) return 25 - (depth / 200) * 15;
  if (depth <= 1000) return 10 - ((depth - 200) / 800) * 7;
  return Math.max(1, 3 - ((depth - 1000) / 10000) * 2);
}
