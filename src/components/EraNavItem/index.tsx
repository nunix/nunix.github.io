import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useHistory } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const ERAS = [
  // Eras I-V use index.mdx → served at directory root in production
  { id: 'era-i-bigbang',    label: '⚡ Era I',   icon: '⚡', full: 'Era I — The Bigbang',             overviewPath: '/aiverse/era-i-bigbang/' },
  { id: 'era-ii-awakening', label: '🌅 Era II',  icon: '🌅', full: 'Era II — The Awakening',           overviewPath: '/aiverse/era-ii-awakening/' },
  { id: 'era-iii-omnissiah',label: '👁️ Era III', icon: '👁️', full: 'Era III — The Omnissiah Stirs',   overviewPath: '/aiverse/era-iii-omnissiah/' },
  { id: 'era-iv-warp',      label: '🌀 Era IV',  icon: '🌀', full: 'Era IV — The Warp Opens',          overviewPath: '/aiverse/era-iv-warp/' },
  { id: 'era-v-reborn',     label: '🔥 Era V',   icon: '🔥', full: 'Era V — The Reborn',               overviewPath: '/aiverse/era-v-reborn/' },
  // Eras VI-VIII use standalone .mdx files → URL includes filename
  { id: 'era-vi-chronicle', label: '∞ Era VI',   icon: '∞',  full: 'Era VI — The Living Chronicle',    overviewPath: '/aiverse/era-vi-chronicle/aiverse-era-vi-chronicle' },
  { id: 'era-vii-kit',      label: '⬡ Era VII',  icon: '⬡',  full: 'Era VII — The Kit Awakens',        overviewPath: '/aiverse/era-vii-kit/aiverse-era-vii-kit' },
  { id: 'era-viii-silicon', label: '⚙ Era VIII', icon: '⚙', full: 'Era VIII — The Silicon Reckoning', overviewPath: '/aiverse/era-viii-silicon/aiverse-era-viii-silicon' },
  { id: 'era-ix-economy',   label: '▤ Era IX',   icon: '▤', full: 'Era IX — The Economy of Mind',       overviewPath: '/aiverse/era-ix-economy/aiverse-era-ix-economy' },
];

const ERA_DOCS = [
  { docId: '/aiverse/era-i-bigbang/',               label: '⚡ Era I — The Bigbang' },
  { docId: '/aiverse/era-ii-awakening/',            label: '🌅 Era II — The Awakening' },
  { docId: '/aiverse/era-iii-omnissiah/',           label: '👁️ Era III — The Omnissiah Stirs' },
  { docId: '/aiverse/era-iv-warp/',                 label: '🌀 Era IV — The Warp Opens' },
  { docId: '/aiverse/era-v-reborn/',               label: '🔥 Era V — The Reborn' },
  { docId: '/aiverse/era-vi-chronicle/aiverse-era-vi-chronicle',   label: '∞ Era VI — The Living Chronicle' },
  { docId: '/aiverse/era-vii-kit/aiverse-era-vii-kit',             label: '⬡ Era VII — The Kit Awakens' },
  { docId: '/aiverse/era-viii-silicon/aiverse-era-viii-silicon',   label: '⚙ Era VIII — The Silicon Reckoning' },
  { docId: '/aiverse/era-ix-economy/aiverse-era-ix-economy',       label: '▤ Era IX — The Economy of Mind' },
];

export default function EraNavItem(): JSX.Element {
  const location = useLocation();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detect current era from pathname
  const currentIdx = ERAS.findIndex(e => location.pathname.includes(e.id));
  const currentEra = currentIdx >= 0 ? ERAS[currentIdx] : null;
  const prevEra = currentIdx > 0 ? ERAS[currentIdx - 1] : null;
  const nextEra = currentIdx >= 0 && currentIdx < ERAS.length - 1 ? ERAS[currentIdx + 1] : null;

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const label = currentEra ? currentEra.label : '⚔ Eras';

  return (
    <div className={styles.eraNav} ref={dropdownRef}>
      {/* Prev arrow */}
      <button
        className={`${styles.eraArrow} ${styles.eraArrowPrev} ${!prevEra ? styles.eraArrowDisabled : ''}`}
        onClick={() => prevEra && history.push(prevEra.overviewPath)}
        title={prevEra ? prevEra.full : undefined}
        disabled={!prevEra}
        aria-label={prevEra ? `Previous: ${prevEra.full}` : 'No previous era'}
      >
        ◄
      </button>

      {/* Dropdown trigger */}
      <button
        className={`${styles.eraDropdownToggle} ${open ? styles.eraDropdownOpen : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className={styles.eraLabel}>{label}</span>
        <span className={styles.eraChevron}>{open ? '▲' : '▼'}</span>
      </button>

      {/* Next arrow */}
      <button
        className={`${styles.eraArrow} ${styles.eraArrowNext} ${!nextEra ? styles.eraArrowDisabled : ''}`}
        onClick={() => nextEra && history.push(nextEra.overviewPath)}
        title={nextEra ? nextEra.full : undefined}
        disabled={!nextEra}
        aria-label={nextEra ? `Next: ${nextEra.full}` : 'No next era'}
      >
        ►
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className={styles.eraDropdownMenu} role="listbox">
          {ERA_DOCS.map((era, i) => (
            <Link
              key={era.docId}
              to={era.docId}
              className={`${styles.eraDropdownItem} ${currentIdx === i ? styles.eraDropdownItemActive : ''}`}
              onClick={() => setOpen(false)}
              role="option"
              aria-selected={currentIdx === i}
            >
              {era.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
