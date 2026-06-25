import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import glossaryData from '@site/src/data/glossary.json';

type GlossaryEntry = {
  title: string;
  def: string;
  link?: string;
};

type Props = {
  children: React.ReactNode;
  term?: string;
  id?: string;
};

const GlossaryTerm: React.FC<Props> = ({ children, term, id }) => {
  const keySource = term || id || (typeof children === 'string' ? children : '');
  const entry = (glossaryData as any)[keySource.toLowerCase().trim()] as GlossaryEntry | undefined;
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; above: boolean } | null>(null);
  const [mounted, setMounted] = useState(false);

  // SSR guard — portal needs document.body
  useEffect(() => { setMounted(true); }, []);

  const show = useCallback(() => {
    if (!wrapperRef.current || !entry) return;
    const r = wrapperRef.current.getBoundingClientRect();
    const above = r.top > 180;
    const safeLeft = Math.min(Math.max(r.left + r.width / 2, 150), window.innerWidth - 150);
    setPos({ top: above ? r.top - 8 : r.bottom + 8, left: safeLeft, above });
  }, [entry]);

  const hide = useCallback(() => setPos(null), []);

  if (!entry) {
    return <span className="glossary-term not-found" title="Term not found in DB">{children}</span>;
  }

  const tooltip = pos ? (
    <span
      className="glossary-tooltip glossary-tooltip-active"
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        transform: pos.above ? 'translateX(-50%) translateY(-100%)' : 'translateX(-50%)',
        zIndex: 99999,
        pointerEvents: 'none',
      } as React.CSSProperties}
    >
      <span className="tooltip-header">
        <span className="tooltip-title">DEFINITION // {entry.title}</span>
      </span>
      <span className="tooltip-body">{entry.def}</span>
      {entry.link && (
        <span className="tooltip-footer">
          <a
            href={entry.link}
            target={entry.link.startsWith('http') ? '_blank' : undefined}
            rel={entry.link.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="tooltip-learn-more"
          >
            Learn more →
          </a>
        </span>
      )}
    </span>
  ) : null;

  return (
    <>
      <span
        ref={wrapperRef}
        className="glossary-wrapper"
        tabIndex={0}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        <span className="glossary-trigger">{children}</span>
      </span>
      {mounted && tooltip && createPortal(tooltip, document.body)}
    </>
  );
};

export default GlossaryTerm;
