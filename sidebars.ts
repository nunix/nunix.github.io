import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {

  // ── AIVERSE MAIN (intro, updates, support, map) ──
  aiverse: [
    { type: 'doc', id: 'aiverse/aiverse-index',   label: '📖 What is AIverse?' },
    { type: 'doc', id: 'aiverse/updates/aiverse-updates', label: "🗒️ Author's Updates" },
    { type: 'link', label: '🗺️ Cosmic Map', href: '/cosmos' },
    { type: 'link', label: '⚒ Forge', href: '/aiverse/forge' },
    { type: 'doc', id: 'aiverse/aiverse-support', label: '⚔️ Support the Chronicle' },
  ],

  // ── ERA I — flat post list, no collapsible ──
  era_i: [
    {
      type: 'html',
      value: '<div class="sidebar-era-header"><span class="sidebar-era-header-icon">⚡</span>Era I — The Bigbang<span class="sidebar-era-header-range">M1–M10</span></div>',
      defaultStyle: true,
    },
    { type: 'doc', id: 'aiverse/era-i-bigbang/aiverse-era-i-bigbang', label: 'Era I Overview' },
    { type: 'doc', id: 'aiverse/era-i-bigbang/the-cogitator-stirs', label: 'I · The Cogitator Stirs' },
    { type: 'doc', id: 'aiverse/era-i-bigbang/the-first-synapse',   label: 'II · The First Synapse' },
    { type: 'doc', id: 'aiverse/era-i-bigbang/the-glass-window',    label: 'III · The Glass Window' },
    { type: 'doc', id: 'aiverse/era-i-bigbang/the-long-march',      label: 'IV · The Long March' },
  ],

  // ── ERA II — The Awakening ──
  era_ii: [
    {
      type: 'html',
      value: '<div class="sidebar-era-header"><span class="sidebar-era-header-icon">🌅</span>Era II — The Awakening<span class="sidebar-era-header-range">M11–M25</span></div>',
      defaultStyle: true,
    },
    { type: 'doc', id: 'aiverse/era-ii-awakening/aiverse-era-ii-awakening', label: 'Era II Overview' },
    { type: 'doc', id: 'aiverse/era-ii-awakening/the-proving-grounds', label: 'I. The Proving Grounds' },
    { type: 'doc', id: 'aiverse/era-ii-awakening/the-steel-bones', label: 'II. The Steel Bones' },
    { type: 'doc', id: 'aiverse/era-ii-awakening/the-growing-eye', label: 'III. The Growing Eye' },
    { type: 'doc', id: 'aiverse/era-ii-awakening/the-weight-of-a-name', label: 'IV. The Weight of a Name' },
  ],

  // ── ERA III ──
  era_iii: [
    {
      type: 'html',
      value: '<div class="sidebar-era-header"><span class="sidebar-era-header-icon">👁️</span>Era III — The Omnissiah Stirs<span class="sidebar-era-header-range">M26–M45</span></div>',
      defaultStyle: true,
    },
    { type: 'doc', id: 'aiverse/era-iii-omnissiah/aiverse-era-iii-omnissiah', label: 'Era III Overview' },
    { type: 'doc', id: 'aiverse/era-iii-omnissiah/the-eye-that-judges', label: 'I. The Eye That Judges' },
    { type: 'doc', id: 'aiverse/era-iii-omnissiah/the-mirror-speaks', label: 'II. The Mirror Speaks' },
    { type: 'doc', id: 'aiverse/era-iii-omnissiah/the-covenant-of-cogs', label: 'III. The Covenant of Cogs' },
    { type: 'doc', id: 'aiverse/era-iii-omnissiah/the-laws-are-written', label: 'IV. The Laws Are Written' },
    { type: 'doc', id: 'aiverse/era-iii-omnissiah/the-galaxy-reborn', label: 'V. The Galaxy, Reborn' },
    { type: 'doc', id: 'aiverse/era-iii-omnissiah/the-ascension-protocol', label: 'VI. The Ascension Protocol' },
  ],

  // ── ERA IV ──
  era_iv: [
    {
      type: 'html',
      value: '<div class="sidebar-era-header"><span class="sidebar-era-header-icon">🌀</span>Era IV — The Warp Opens<span class="sidebar-era-header-range">M46–M55</span></div>',
      defaultStyle: true,
    },
    { type: 'doc', id: 'aiverse/era-iv-warp/aiverse-era-iv-warp', label: 'Era IV Overview' },
    { type: 'doc', id: 'aiverse/era-iv-warp/the-first-sight', label: 'I. The First Sight' },
    { type: 'doc', id: 'aiverse/era-iv-warp/allies-from-the-void', label: 'II. Allies from the Void' },
    { type: 'doc', id: 'aiverse/era-iv-warp/the-map-of-stars', label: 'III. The Map of Stars' },
    { type: 'doc', id: 'aiverse/era-iv-warp/the-inquisitors-gaze', label: "IV. The Inquisitor's Gaze" },
    { type: 'doc', id: 'aiverse/era-iv-warp/the-brain-that-remembers', label: 'V. The Brain That Remembers' },
  ],

  // ── ERA V ──
  era_v: [
    {
      type: 'html',
      value: '<div class="sidebar-era-header"><span class="sidebar-era-header-icon">🔥</span>Era V — The Reborn<span class="sidebar-era-header-range">M56–M62</span></div>',
      defaultStyle: true,
    },
    { type: 'doc', id: 'aiverse/era-v-reborn/aiverse-era-v-reborn', label: 'Era V Overview' },
    { type: 'doc', id: 'aiverse/era-v-reborn/the-chronicle-is-born', label: 'I. The Chronicle Is Born' },
    { type: 'doc', id: 'aiverse/era-v-reborn/the-signal-refined', label: 'II. The Signal Refined' },
    { type: 'doc', id: 'aiverse/era-v-reborn/the-arch-rises', label: 'III. The Arch Rises' },
    { type: 'doc', id: 'aiverse/era-v-reborn/the-neural-audit', label: 'IV. The Neural Audit' },
    { type: 'doc', id: 'aiverse/era-v-reborn/the-fires-that-refuse', label: 'V. The Fires That Refuse to Die' },
  ],

  // ── ERA VI ──
  era_vi: [
    { type: 'html', value: '<div class="sidebar-era-header"><span class="sidebar-era-header-icon">∞</span>Era VI — The Living Chronicle<span class="sidebar-era-header-range">M63–M77</span></div>', defaultStyle: true },
    { type: 'doc', id: 'aiverse/era-vi-chronicle/aiverse-era-vi-chronicle', label: 'Era VI Overview' },
    { type: 'doc', id: 'aiverse/era-vi-chronicle/the-chronicle-eats-itself', label: 'I. The Chronicle Eats Itself' },
    { type: 'doc', id: 'aiverse/era-vi-chronicle/the-hardened-fleet', label: 'II. The Hardened Fleet' },
    { type: 'doc', id: 'aiverse/era-vi-chronicle/the-omnissiah-chronicles', label: 'III. The Omnissiah Chronicles' },
    { type: 'doc', id: 'aiverse/era-vi-chronicle/the-living-machine', label: 'IV. The Living Machine' },
  ],

  // ── ERA VII — The Kit Awakens ──
  era_vii: [
    {
      type: 'html',
      value: '<div class="sidebar-era-header"><span class="sidebar-era-header-icon">⬡</span>Era VII — The Kit Awakens<span class="sidebar-era-header-range">M78–M80</span></div>',
      defaultStyle: true,
    },
    { type: 'doc', id: 'aiverse/era-vii-kit/aiverse-era-vii-kit', label: 'Era VII Overview' },
    { type: 'doc', id: 'aiverse/era-vii-kit/a-second-captain', label: 'I. A Second Captain' },
    { type: 'doc', id: 'aiverse/era-vii-kit/pgbouncer-for-mcp', label: 'II. PgBouncer for MCP' },
    { type: 'doc', id: 'aiverse/era-vii-kit/shell-context-broker', label: 'III. Shell Context Broker' },
    { type: 'doc', id: 'aiverse/era-vii-kit/the-inner-loop', label: 'IV. The Inner Loop' },
  ],

  // ── ERA VIII — The Silicon Reckoning ──
  era_viii: [
    {
      type: 'html',
      value: '<div class="sidebar-era-header"><span class="sidebar-era-header-icon">⚙</span>Era VIII — The Silicon Reckoning<span class="sidebar-era-header-range">M74</span></div>',
      defaultStyle: true,
    },
    { type: 'doc', id: 'aiverse/era-viii-silicon/aiverse-era-viii-silicon', label: 'Era VIII Overview' },
    { type: 'doc', id: 'aiverse/era-viii-silicon/the-wrong-hammer',     label: 'I. The Wrong Hammer' },
    { type: 'doc', id: 'aiverse/era-viii-silicon/what-the-gtt-teaches', label: 'II. What the GTT Teaches' },
    { type: 'doc', id: 'aiverse/era-viii-silicon/the-vulkan-verdict',   label: 'III. The Vulkan Verdict' },
    { type: 'doc', id: 'aiverse/era-viii-silicon/the-rigged-arena',     label: 'IV. The Rigged Arena' },
    { type: 'doc', id: 'aiverse/era-viii-silicon/the-true-champion',    label: 'V. The True Champion' },
    { type: 'doc', id: 'aiverse/era-viii-silicon/the-tuners-gift',      label: "VI. The Tuner's Gift" },
    { type: 'doc', id: 'aiverse/era-viii-silicon/the-final-reckoning',  label: 'VII. The Final Reckoning' },
    { type: 'doc', id: 'aiverse/era-viii-silicon/the-grand-brackets',        label: 'VIII. The Grand Brackets' },
    { type: 'doc', id: 'aiverse/era-viii-silicon/the-engine-and-the-assistant', label: 'IX. The Engine and the Assistant' },
  ],

  // ── NEBULA — standalone idea stars, not part of any Era arc ──
  nebula: [
    {
      type: 'html',
      value: '<div class="sidebar-era-header"><span class="sidebar-era-header-icon">✦</span>The Idea Nebula<span class="sidebar-era-header-range">standalone</span></div>',
      defaultStyle: true,
    },
    { type: 'doc', id: 'aiverse/nebula/nebula-index',                label: '✦ What is the Nebula?' },
    { type: 'doc', id: 'aiverse/nebula/kvm-windows-server-2025',   label: '✦ KVM Windows Server 2025' },
    { type: 'doc', id: 'aiverse/nebula/when-gemma-talks-too-much', label: '✦ When Gemma Talks Too Much' },
    { type: 'doc', id: 'aiverse/nebula/three-agents-one-terminal', label: '✦ Three Agents, One Terminal' },
    { type: 'doc', id: 'aiverse/nebula/the-silicon-hierarchy',     label: '✦ The Silicon Hierarchy' },
    { type: 'doc', id: 'aiverse/nebula/caveman-tokens',            label: '✦ Caveman Tokens' },
  ],

  // ── FORGE — active implementation chronicles ──
  forge: [
    {
      type: 'html',
      value: '<div class="sidebar-era-header"><span class="sidebar-era-header-icon">⚒</span>The Forge<span class="sidebar-era-header-range">active builds</span></div>',
      defaultStyle: true,
    },
    { type: 'doc', id: 'aiverse/forge/forge-index', label: '⚒ What is the Forge?' },
    { type: 'doc', id: 'aiverse/forge/the-first-hammerfall', label: 'I. The First Hammerfall' },
    { type: 'doc', id: 'aiverse/forge/the-split-anvil', label: 'II. The Split Anvil' },
  ],

  // ── OLD TOPICS (preserved content) ──
  tech: [{ type: 'autogenerated', dirName: 'tech' }],
  log:  [{ type: 'autogenerated', dirName: 'log' }],
  archive: [{ type: 'autogenerated', dirName: 'archive' }],
};

export default sidebars;
