import React, { useState, useRef, useCallback } from 'react';
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
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const show = useCallback(() => {
    if (!wrapperRef.current || !entry) return;
    const r = wrapperRef.current.getBoundingClientRect();
    setPos({ top: r.top, left: r.left + r.width / 2 });
  }, [entry]);

  const hide = useCallback(() => setPos(null), []);

  if (!entry) {
    return <span className="glossary-term not-found" title="Term not found in DB">{children}</span>;
  }

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

      {pos && (
        <span
          className="glossary-tooltip"
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            transform: 'translateX(-50%) translateY(calc(-100% - 8px))',
            zIndex: 99999,
            visibility: 'visible',
            opacity: 1,
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
                onClick={(e) => e.stopPropagation()}
              >
                Learn more →
              </a>
            </span>
          )}
        </span>
      )}
    </>
  );
};

export default GlossaryTerm;
