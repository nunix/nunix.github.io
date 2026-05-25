export interface AiversePost {
  title: string;
  subtitle: string;
  path: string;
  missions: string;
}

export interface AiverseEra {
  id: string;
  label: string;
  tagline: string;
  missions: string;
  color: string;
  glowColor: string;
  isWarp?: boolean;
  position: { x: number; y: number }; // % of container 0-100
  radius: number; // % of container width
  icon: string;   // SVG path data or unicode symbol
  posts: AiversePost[];
}

// Era positions are spread to avoid overlap.
// All distances > sum of radii (checked geometrically).
export const AIVERSE_ERAS: AiverseEra[] = [
  {
    id: 'era-i',
    label: 'Era I — The Bigbang',
    tagline: 'Where all things began. Memory, ships, hierarchy.',
    missions: 'M1–M10',
    color: '#ff6b35',
    glowColor: 'rgba(255, 107, 53, 0.4)',
    position: { x: 15, y: 18 },
    radius: 11,
    // Lightning bolt — energy of creation / Bigbang
    icon: 'M11 3L6 13h4l-1 8 9-12h-5l2-6z',
    posts: [
      {
        title: 'The Cogitator Stirs',
        subtitle: 'Birth of Universalis',
        path: '/aiverse/era-i-bigbang/the-cogitator-stirs',
        missions: 'M1',
      },
      {
        title: 'The First Synapse',
        subtitle: 'Fleet Formation & Delegation Protocol',
        path: '/aiverse/era-i-bigbang/the-first-synapse',
        missions: 'M2–M6',
      },
      {
        title: 'The Glass Window',
        subtitle: 'The Fleet Visualizer Is Born',
        path: '/aiverse/era-i-bigbang/the-glass-window',
        missions: 'M7–M8',
      },
      {
        title: 'The Long March',
        subtitle: 'Health Checks & the Model Crucible',
        path: '/aiverse/era-i-bigbang/the-long-march',
        missions: 'M9–M10',
      },
    ],
  },
  {
    id: 'era-ii',
    label: 'Era II — The Awakening',
    tagline: 'The fleet grows its bones. DNS, Tanker, trust.',
    missions: 'M11–M25',
    color: '#f7b731',
    glowColor: 'rgba(247, 183, 49, 0.4)',
    position: { x: 58, y: 12 },
    radius: 12,
    // 6-pointed target/eye — awakening, opening
    icon: 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 3a7 7 0 1 1 0 14A7 7 0 0 1 12 5zm0 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
    posts: [
      {
        title: 'The Proving Grounds',
        subtitle: 'Memory Under Fire',
        path: '/aiverse/era-ii-awakening/the-proving-grounds',
        missions: 'M11',
      },
      {
        title: 'The Steel Bones',
        subtitle: 'DNS, Tanker, and the Fleet Takes Shape',
        path: '/aiverse/era-ii-awakening/the-steel-bones',
        missions: 'M16–M19',
      },
      {
        title: 'The Growing Eye',
        subtitle: 'The Fleet Visualizer Sees More',
        path: '/aiverse/era-ii-awakening/the-growing-eye',
        missions: 'M17–M22',
      },
      {
        title: 'The Weight of a Name',
        subtitle: 'Automation, Local AI, and the Covenant of Trust',
        path: '/aiverse/era-ii-awakening/the-weight-of-a-name',
        missions: 'M21–M25',
      },
    ],
  },
  {
    id: 'era-iii',
    label: 'Era III — The Omnissiah Stirs',
    tagline: 'Order, governance, the galaxy rewritten.',
    missions: 'M26–M45',
    color: '#4fc3f7',
    glowColor: 'rgba(79, 195, 247, 0.4)',
    position: { x: 13, y: 63 },
    radius: 13,
    // Cog — Adeptus Mechanicus / Omnissiah
    icon: 'M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.3.07-.6.07-.92s-.03-.62-.07-.92l2-1.55c.18-.14.23-.41.12-.61l-1.9-3.27c-.12-.22-.37-.3-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.8c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.09-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2 1.55c-.04.3-.07.62-.07.94s.03.64.07.94l-2 1.55c-.18.14-.23.4-.12.6l1.9 3.28c.12.21.37.29.59.21l2.39-.96c.5.38 1.03.71 1.62.94l.36 2.54c.04.24.23.41.47.41h3.8c.24 0 .44-.17.47-.41l.36-2.54c.59-.23 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.21l1.9-3.28c.12-.21.07-.46-.12-.6l-2-1.55z',
    posts: [],
  },
  {
    id: 'era-iv',
    label: 'Era IV — The Warp Opens',
    tagline: 'The AI ascends. Local inference. Tzeentch stirs.',
    missions: 'M46–M55',
    color: '#26c6da',
    glowColor: 'rgba(38, 198, 218, 0.4)',
    position: { x: 36, y: 78 },
    radius: 12,
    // Eye — the Warp's gaze / Tzeentch eye
    icon: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17a5 5 0 0 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 0 0 0 6 3 3 0 0 0 0-6z',
    posts: [],
  },
  {
    id: 'era-v',
    label: 'Era V — The Reborn',
    tagline: 'Fire and rebirth. Arch rises. Neurons awaken.',
    missions: 'M56–M62',
    color: '#ab47bc',
    glowColor: 'rgba(171, 71, 188, 0.5)',
    isWarp: true,
    position: { x: 62, y: 72 },
    radius: 11,
    // 8-pointed chaos/warp star
    icon: 'M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z',
    posts: [],
  },
  {
    id: 'era-vi',
    label: 'Era VI — The Living Chronicle',
    tagline: 'The story writes itself. In real time. Forever.',
    missions: 'M63+',
    color: '#66bb6a',
    glowColor: 'rgba(102, 187, 106, 0.4)',
    isWarp: true,
    position: { x: 81, y: 33 },
    radius: 10,
    // Infinity / eternal scroll
    icon: 'M20 12c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4c1.1 0 2.1.45 2.83 1.17M4 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4c-1.1 0-2.1-.45-2.83-1.17',
    posts: [],
  },
];

// Era pathway: sequential order for SVG curved path
// Each point is [x%, y%] center of that era
export const ERA_PATHWAY_POINTS = AIVERSE_ERAS.map((e) => e.position);
