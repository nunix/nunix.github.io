import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {

  // ── AIVERSE MAIN (intro, updates, support, map) ──
  aiverse: [
    { type: 'doc', id: 'aiverse/aiverse-index',   label: '📖 What is AIverse?' },
    { type: 'doc', id: 'aiverse/updates/aiverse-updates', label: "🗒️ Author's Updates" },
    { type: 'link', label: '🗺️ Cosmic Map', href: '/cosmos' },
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
    { type: 'doc', id: 'aiverse/era-v-reborn/the-fires-that-refuse', label: 'I. The Fires That Refuse to Die' },
    { type: 'doc', id: 'aiverse/era-v-reborn/the-signal-refined', label: 'II. The Signal Refined' },
    { type: 'doc', id: 'aiverse/era-v-reborn/the-arch-rises', label: 'III. The Arch Rises' },
    { type: 'doc', id: 'aiverse/era-v-reborn/the-neural-audit', label: 'IV. The Neural Audit' },
    { type: 'doc', id: 'aiverse/era-v-reborn/the-chronicle-is-born', label: 'V. The Chronicle Is Born' },
  ],

  // ── ERA VI ──
  era_vi: [
    {
      type: 'html',
      value: '<div class="sidebar-era-header"><span class="sidebar-era-header-icon">∞</span>Era VI — The Living Chronicle<span class="sidebar-era-header-range">M63+</span></div>',
      defaultStyle: true,
    },
    { type: 'doc', id: 'aiverse/era-vi-chronicle/aiverse-era-vi-chronicle', label: 'Chronicles Incoming' },
  ],

  // ── OLD TOPICS (preserved content) ──
  tech: [{ type: 'autogenerated', dirName: 'tech' }],
  log:  [{ type: 'autogenerated', dirName: 'log' }],
  archive: [{ type: 'autogenerated', dirName: 'archive' }],
};

export default sidebars;
