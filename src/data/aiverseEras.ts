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
  postStartAngle?: number;
  postOrbitDirection?: number;
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
    position: { x: 12, y: 21 },
    radius: 7,
    postStartAngle: -Math.PI / 2,
    postOrbitDirection: -1,
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
    position: { x: 37, y: 24 },
    radius: 7,
    postStartAngle: -Math.PI / 2,
    postOrbitDirection: 1,
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
    position: { x: 62, y: 25 },
    radius: 7,
    postStartAngle: -Math.PI / 2,
    postOrbitDirection: -1,
    // Cog — Adeptus Mechanicus / Omnissiah
    icon: 'M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.3.07-.6.07-.92s-.03-.62-.07-.92l2-1.55c.18-.14.23-.41.12-.61l-1.9-3.27c-.12-.22-.37-.3-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.8c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.09-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2 1.55c-.04.3-.07.62-.07.94s.03.64.07.94l-2 1.55c-.18.14-.23.4-.12.6l1.9 3.28c.12.21.37.29.59.21l2.39-.96c.5.38 1.03.71 1.62.94l.36 2.54c.04.24.23.41.47.41h3.8c.24 0 .44-.17.47-.41l.36-2.54c.59-.23 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.21l1.9-3.28c.12-.21.07-.46-.12-.6l-2-1.55z',
    posts: [
      {
        title: 'The Eye That Judges',
        subtitle: 'The Fleet Learns to See Itself',
        path: '/aiverse/era-iii-omnissiah/the-eye-that-judges',
        missions: 'M26–M28',
      },
      {
        title: 'The Mirror Speaks',
        subtitle: 'When the Graph Revealed the Cracks',
        path: '/aiverse/era-iii-omnissiah/the-mirror-speaks',
        missions: 'M29–M31',
      },
      {
        title: 'The Covenant of Cogs',
        subtitle: 'Governance, Efficiency, and the Law of the Fleet',
        path: '/aiverse/era-iii-omnissiah/the-covenant-of-cogs',
        missions: 'M32–M35',
      },
      {
        title: 'The Laws Are Written',
        subtitle: 'Prompts, Identity, and the Mission That Named Itself',
        path: '/aiverse/era-iii-omnissiah/the-laws-are-written',
        missions: 'M36–M38',
      },
      {
        title: 'The Galaxy, Reborn',
        subtitle: 'When the Cosmic Map Rewrote Itself',
        path: '/aiverse/era-iii-omnissiah/the-galaxy-reborn',
        missions: 'M39–M41',
      },
      {
        title: 'The Ascension Protocol',
        subtitle: 'Haiku Fleet-Wide and the Command Center Reborn',
        path: '/aiverse/era-iii-omnissiah/the-ascension-protocol',
        missions: 'M43–M45',
      },
    ],
  },
  {
    id: 'era-iv',
    label: 'Era IV — The Warp Opens',
    tagline: 'The AI ascends. Local inference. Tzeentch stirs.',
    missions: 'M46–M55',
    color: '#26c6da',
    glowColor: 'rgba(38, 198, 218, 0.4)',
    position: { x: 87, y: 23 },
    radius: 7,
    postStartAngle: -Math.PI / 2,
    postOrbitDirection: -1,
    // Eye — the Warp's gaze / Tzeentch eye
    icon: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17a5 5 0 0 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 0 0 0 6 3 3 0 0 0 0-6z',
    posts: [
      {
        title: 'The First Sight',
        subtitle: 'Rules Propagate and the Omnissiah Opens Its Eyes',
        path: '/aiverse/era-iv-warp/the-first-sight',
        missions: 'M46–M47',
      },
      {
        title: 'Allies from the Void',
        subtitle: 'Caravella Ascends on Windows',
        path: '/aiverse/era-iv-warp/allies-from-the-void',
        missions: 'M48',
      },
      {
        title: 'The Map of Stars',
        subtitle: 'Command Center Reborn and the Graph Tamed',
        path: '/aiverse/era-iv-warp/the-map-of-stars',
        missions: 'M49–M50',
      },
      {
        title: "The Inquisitor's Gaze",
        subtitle: 'Audit, Transmissions, and the Price of Trust',
        path: '/aiverse/era-iv-warp/the-inquisitors-gaze',
        missions: 'M51–M52',
      },
      {
        title: 'The Brain That Remembers',
        subtitle: 'Omnissiah Awakening and the Living Mind',
        path: '/aiverse/era-iv-warp/the-brain-that-remembers',
        missions: 'M53–M55',
      },
    ],
  },
  {
    id: 'era-v',
    label: 'Era V — The Reborn',
    tagline: 'Fire and rebirth. Arch rises. Neurons awaken.',
    missions: 'M56–M62',
    color: '#ab47bc',
    glowColor: 'rgba(171, 71, 188, 0.5)',
    isWarp: true,
    position: { x: 84, y: 48 },
    radius: 7,
    postStartAngle: -Math.PI / 2 - (2 * Math.PI / 5),
    postOrbitDirection: -1,
    // 8-pointed chaos/warp star
    icon: 'M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z',
    posts: [
      {
        title: 'The Chronicle Is Born',
        subtitle: 'The Fleet Begins to Write Its Own History',
        path: '/aiverse/era-v-reborn/the-chronicle-is-born',
        missions: 'M62',
      },
      {
        title: 'The Signal Refined',
        subtitle: 'Fleet Alignment, Cost Visibility, and the Art of Knowing Less',
        path: '/aiverse/era-v-reborn/the-signal-refined',
        missions: 'M57–M59',
      },
      {
        title: 'The Arch Rises',
        subtitle: 'Tanker Dies, Tanker Lives, CUDA Online',
        path: '/aiverse/era-v-reborn/the-arch-rises',
        missions: 'M60',
      },
      {
        title: 'The Neural Audit',
        subtitle: 'When the Brain Evaluates Its Own Neurons',
        path: '/aiverse/era-v-reborn/the-neural-audit',
        missions: 'M61',
      },
      {
        title: 'The Fires That Refuse to Die',
        subtitle: 'When the GPU Fights Back and Loses',
        path: '/aiverse/era-v-reborn/the-fires-that-refuse',
        missions: 'M56',
      },
    ],
  },
  {
    id: 'era-vi',
    label: 'Era VI — The Living Chronicle',
    tagline: 'The story writes itself. In real time. Forever.',
    missions: 'M63–M77',
    color: '#66bb6a',
    glowColor: 'rgba(102, 187, 106, 0.4)',
    isWarp: true,
    position: { x: 59, y: 49 },
    radius: 7,
    postStartAngle: -Math.PI / 2,
    postOrbitDirection: -1,
    // Infinity / eternal scroll
    icon: 'M20 12c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4c1.1 0 2.1.45 2.83 1.17M4 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4c-1.1 0-2.1-.45-2.83-1.17',
    posts: [
      { title: 'The Chronicle Eats Itself', subtitle: 'When the fleet began writing its own history', path: '/aiverse/era-vi-chronicle/the-chronicle-eats-itself', missions: 'M63–M65' },
      { title: 'The Hardened Fleet', subtitle: 'From experimental to operational', path: '/aiverse/era-vi-chronicle/the-hardened-fleet', missions: 'M66–M71' },
      { title: 'The Omnissiah Chronicles', subtitle: 'The AIverse becomes a real publication', path: '/aiverse/era-vi-chronicle/the-omnissiah-chronicles', missions: 'M72–M75' },
      { title: 'The Living Machine', subtitle: 'The fleet that publishes itself', path: '/aiverse/era-vi-chronicle/the-living-machine', missions: 'M76–M77' },
    ],
  },
  {
    id: 'era-vii',
    label: 'Era VII — The Kit Awakens',
    tagline: 'A second captain. A lazy proxy. Shell agents that remember.',
    missions: 'M78–M80',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    isWarp: false,
    position: { x: 36, y: 47 },
    radius: 7,
    postStartAngle: -Math.PI / 2,
    postOrbitDirection: -1,
    // Circuit / AI chip icon
    icon: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18',
    posts: [
      {
        title: 'A Second Captain',
        subtitle: 'SleKit — Copilot-powered parallel agent aboard Imperator',
        path: '/aiverse/era-vii-kit/a-second-captain',
        missions: 'M78',
      },
      {
        title: 'PgBouncer for MCP',
        subtitle: 'A transparent lazy proxy for Model Context Protocol servers',
        path: '/aiverse/era-vii-kit/pgbouncer-for-mcp',
        missions: 'M80',
      },
      {
        title: 'Shell Context Broker',
        subtitle: 'Teaching kit to remember across shell invocations',
        path: '/aiverse/era-vii-kit/shell-context-broker',
        missions: 'M80',
      },
      {
        title: 'The Inner Loop',
        subtitle: 'Dagger CI gives the fleet local-first deployment testing',
        path: '/aiverse/era-vii-kit/the-inner-loop',
        missions: 'M76',
      },
    ],
  },
  {
    id: 'era-viii',
    label: 'Era VIII — The Silicon Reckoning',
    tagline: 'When assumptions meet hardware. The Cogitator speaks its truth.',
    missions: 'M74',
    color: '#d97706',
    glowColor: 'rgba(217, 119, 6, 0.4)',
    isWarp: false,
    position: { x: 39, y: 78 },
    radius: 7,
    postStartAngle: -Math.PI / 2,
    postOrbitDirection: 1,
    // Processor / silicon chip icon
    icon: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18',
    posts: [
      {
        title: 'The Wrong Hammer',
        subtitle: 'Ollama, ROCm, and the playoff that revealed the infrastructure',
        path: '/aiverse/era-viii-silicon/the-wrong-hammer',
        missions: 'M74',
      },
      {
        title: 'What the GTT Teaches',
        subtitle: 'The iGPU, unified memory, and 34GB the fleet did not know it had',
        path: '/aiverse/era-viii-silicon/what-the-gtt-teaches',
        missions: 'M74',
      },
      {
        title: 'The Vulkan Verdict',
        subtitle: 'Clean machines, right backends, and the comparison that settled it',
        path: '/aiverse/era-viii-silicon/the-vulkan-verdict',
        missions: 'M74',
      },
      {
        title: 'The Rigged Arena',
        subtitle: 'The champion timed out. The Emperor had asked a real question.',
        path: '/aiverse/era-viii-silicon/the-rigged-arena',
        missions: 'M74',
      },
      {
        title: 'The True Champion',
        subtitle: 'Real tools, real questions, real winner — the 12B model all along.',
        path: '/aiverse/era-viii-silicon/the-true-champion',
        missions: 'M74',
      },
      {
        title: "The Tuner's Gift",
        subtitle: '82 seconds to 3 seconds. One flag. Why paid models enable local ones.',
        path: '/aiverse/era-viii-silicon/the-tuners-gift',
        missions: 'M74',
      },
      {
        title: 'The Final Reckoning',
        subtitle: 'Q4 vs Q8. First tool choice decides. One finished. One crashed.',
        path: '/aiverse/era-viii-silicon/the-final-reckoning',
        missions: 'M74',
      },
      {
        title: 'The Grand Brackets',
        subtitle: '16 models, 5 brackets, 3 questions. Almost nothing passed all three.',
        path: '/aiverse/era-viii-silicon/the-grand-brackets',
        missions: 'M74',
      },
      {
        title: 'The Engine and the Assistant',
        subtitle: 'The champion answered correctly — then kept talking. OS? Hardware? Or something else?',
        path: '/aiverse/era-viii-silicon/the-engine-and-the-assistant',
        missions: 'M74',
      },
      {
        title: "The Container's Edge",
        subtitle: 'A newer RADV in a container — +31.6% prefill on identical hardware, without touching the pinned host.',
        path: '/aiverse/era-viii-silicon/the-containers-edge',
        missions: 'M96',
      },
      {
        title: 'The Sparsity Dividend',
        subtitle: 'Ten models, two families: the size curve hid a cliff. Dense falls off it; MoE does not.',
        path: '/aiverse/era-viii-silicon/the-sparsity-dividend',
        missions: 'M96',
      },
      {
        title: 'The Borrowed Crown',
        subtitle: 'A ghost model, a wedged GPU, and a smoke test that lied — three layers, each hiding the one beneath it.',
        path: '/aiverse/era-viii-silicon/the-borrowed-crown',
        missions: 'M111-M112',
      },
    ],
  },
  {
    id: 'era-ix',
    label: 'Era IX — The Economy of Mind',
    tagline: 'Spend tokens like a brain spends energy. Challenge the premise. Right-size the lever.',
    missions: 'M74 · M79 · M97–M99',
    color: '#14b8a6',
    glowColor: 'rgba(20, 184, 166, 0.4)',
    isWarp: false,
    position: { x: 62, y: 75 },
    radius: 7,
    postStartAngle: -Math.PI / 2,
    postOrbitDirection: -1,
    // Stacked layers — the memory / cache hierarchy
    icon: 'M12 2l9 5-9 5-9-5 9-5zm0 7l9 5-9 5-9-5 9-5z',
    posts: [
      {
        title: 'Caveman Tokens',
        subtitle: 'Talk like a smart caveman — 65% fewer output tokens, zero loss of substance. The first honest win.',
        path: '/aiverse/era-ix-economy/caveman-tokens',
        missions: 'M79',
      },
      {
        title: 'The Invisible Half of the Bill',
        subtitle: 'A visible output saving hid an input-side cache-write premium. The half no meter was printing.',
        path: '/aiverse/era-ix-economy/the-invisible-half-of-the-bill',
        missions: 'M97',
      },
      {
        title: 'The Answer That Agreed Too Fast',
        subtitle: 'Two minds, one optimization question, and why the right lever was the smallest one',
        path: '/aiverse/era-ix-economy/the-answer-that-agreed-too-fast',
        missions: 'M98',
      },
      {
        title: 'The Anatomy of an Answer',
        subtitle: 'Six numbered phases from prompt to reply — and the exact optimization that bites at each',
        path: '/aiverse/era-ix-economy/the-anatomy-of-an-answer',
        missions: 'M98',
      },
      {
        title: 'Every Lever, Where It Bites',
        subtitle: 'The full ledger — each decision, its value, how it was built, and its scope of applicability',
        path: '/aiverse/era-ix-economy/every-lever-where-it-bites',
        missions: 'M98',
      },
      {
        title: 'The Tax on Silence',
        subtitle: 'A keep-alive ping built to cost almost nothing — until two hooks taxed every silent fire with a full reminder block',
        path: '/aiverse/era-ix-economy/the-tax-on-silence',
        missions: 'M74, M114',
      },
      {
        title: 'The Memory Gateway',
        subtitle: "Anthropic's memory-tool verbs, adapted to a Postgres-backed, fleet-shared third memory tier",
        path: '/aiverse/era-ix-economy/the-memory-gateway',
        missions: 'M99',
      },
    ],
  },
  {
    id: 'era-x',
    label: 'Era X — The Council of Tongues',
    tagline: 'Three vendors, one command chair. Trust earned, never claimed.',
    missions: 'M121–',
    color: '#c026d3',
    glowColor: 'rgba(192, 38, 211, 0.38)',
    isWarp: false,
    position: { x: 87, y: 79 },
    radius: 7,
    postStartAngle: -Math.PI / 2,
    postOrbitDirection: -1,
    // Chat bubbles — the council of tongues, three voices in one seat
    icon: 'M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z',
    posts: [
      {
        title: 'The Triumvirate Accord',
        subtitle: 'Three vendors enter the command chair',
        path: '/aiverse/era-x-council/the-triumvirate-accord',
        missions: 'M121–M123',
      },
      {
        title: "The Roster's Reckoning",
        subtitle: 'Five missions chasing one typo',
        path: '/aiverse/era-x-council/the-rosters-reckoning',
        missions: 'M122, M126–M134',
      },
      {
        title: "The Rotation's Verdict",
        subtitle: 'Sixty calls, one honest scorecard',
        path: '/aiverse/era-x-council/the-rotations-verdict',
        missions: 'M130, M145',
      },
      {
        title: 'The Uncounted Tongues',
        subtitle: 'Three cracks, one shared root cause',
        path: '/aiverse/era-x-council/the-uncounted-tongues',
        missions: 'M137–M139',
      },
    ],
  },
];

export interface NebulaStar {
  title: string;
  subtitle: string;
  path: string;
  missions: string;
  tags: string[];
}

export interface AiverseNebula {
  id: string;
  label: string;
  tagline: string;
  color: string;
  glowColor: string;
  position: { x: number; y: number };
  radius: number;
  icon: string;
  stars: NebulaStar[];
}

export interface ForgeArtifact {
  title: string;
  subtitle: string;
  path: string;
  missions: string;
  tags: string[];
}

export interface AiverseForge {
  id: string;
  label: string;
  tagline: string;
  color: string;
  glowColor: string;
  position: { x: number; y: number };
  radius: number;
  icon: string;
  artifacts: ForgeArtifact[];
}

export const AIVERSE_NEBULA: AiverseNebula = {
  id: 'nebula',
  label: 'The Idea Nebula',
  tagline: 'Where stars are born before they own a galaxy.',
  color: '#26c6da',
  glowColor: 'rgba(38, 198, 218, 0.35)',
  position: { x: 17, y: 44 },
  radius: 6,
  // Nebula / scatter dots icon
  icon: 'M12 2a1 1 0 100 2 1 1 0 000-2zM6 6a1 1 0 100 2 1 1 0 000-2zM18 6a1 1 0 100 2 1 1 0 000-2zM4 12a1 1 0 100 2 1 1 0 000-2zM20 12a1 1 0 100 2 1 1 0 000-2zM6 18a1 1 0 100 2 1 1 0 000-2zM18 18a1 1 0 100 2 1 1 0 000-2zM12 20a1 1 0 100 2 1 1 0 000-2z',
  stars: [
    {
      title: 'The Crew That Forgot Everything',
      subtitle: 'Trimming what a Matey is told to remember on every spawn mattered more than which model it runs on',
      path: '/aiverse/nebula/the-crew-that-forgot-everything',
      missions: 'N01',
      tags: ['matey', 'subagents', 'prompt-engineering', 'tokens'],
    },
    {
      title: 'The Forge and the Quadlet',
      subtitle: 'Two bare-metal services, containerized with Podman + Quadlet, with zero loss of real-time function',
      path: '/aiverse/nebula/the-forge-and-the-quadlet',
      missions: 'N02',
      tags: ['podman', 'quadlet', 'containers', 'systemd', 'devops'],
    },
    {
      title: 'KVM Windows Server 2025',
      subtitle: 'A handful of libvirt XML tweaks turned a sluggish VM into a high-performance guest',
      path: '/aiverse/nebula/kvm-windows-server-2025',
      missions: 'N03',
      tags: ['kvm', 'windows', 'vm', 'performance', 'libvirt'],
    },
    {
      title: 'When Gemma Talks Too Much',
      subtitle: 'Taming gemma4:12b-mlx verbosity from 1537 tokens to 59',
      path: '/aiverse/nebula/when-gemma-talks-too-much',
      missions: 'M86',
      tags: ['gemma', 'prompt', 'verbosity', 'mlx', 'engineering'],
    },
    {
      title: 'Three Agents, One Terminal',
      subtitle: 'Goose, agy, and a Python script — only one leaves at a useful speed',
      path: '/aiverse/nebula/three-agents-one-terminal',
      missions: 'M86–M87',
      tags: ['goose', 'agy', 'agents', 'benchmark', 'terminal'],
    },
    {
      title: 'The Silicon Hierarchy',
      subtitle: 'Benchmarking 12B models across the fleet — MLX, CPU, Vulkan — and the reassignment that followed',
      path: '/aiverse/nebula/the-silicon-hierarchy',
      missions: 'M86',
      tags: ['benchmark', 'mlx', 'vulkan', 'fleet', 'silicon'],
    },
    {
      title: 'The Compute Capability Trap',
      subtitle: "Testing vLLM and SGLang against Ollama on Tanker (Maxwell) and Galleon (Ampere) — and why matching the compute capability isn't enough",
      path: '/aiverse/nebula/the-compute-capability-trap',
      missions: 'M110',
      tags: ['benchmark', 'local-ai', 'vllm', 'sglang', 'tanker', 'galleon'],
    },
  ],
};

export const AIVERSE_FORGE: AiverseForge = {
  id: 'forge',
  label: 'The Forge',
  tagline: 'Where tools are hammered into power-TUIs before they become doctrine.',
  color: '#f97316',
  glowColor: 'rgba(249, 115, 22, 0.35)',
  position: { x: 17, y: 78 },
  radius: 6,
  // Hammer / forge mark
  icon: 'M14 4l6 6-2 2-2-2-3 3 2 2-8 8-3-3 8-8-2-2 3-3-2-2 2-2z',
  artifacts: [
    {
      title: 'The First Hammerfall',
      subtitle: 'DboxShim enters the Forge as a power-TUI',
      path: '/aiverse/forge/the-first-hammerfall',
      missions: 'M82',
      tags: ['dboxshim', 'tui', 'distrobox', 'phase-1', 'phase-2'],
    },
    {
      title: 'The Split Anvil',
      subtitle: 'CLI stability, Dagger tests, and Distrobox next',
      path: '/aiverse/forge/the-split-anvil',
      missions: 'M84–M85',
      tags: ['dagger', 'distrobox-next', 'go', 'testing'],
    },
  ],
};

// Era pathway: sequential order for SVG curved path
// Each point is [x%, y%] center of that era
export const ERA_PATHWAY_POINTS = AIVERSE_ERAS.map((e) => e.position);
