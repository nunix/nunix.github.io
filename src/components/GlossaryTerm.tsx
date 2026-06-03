import React from 'react';
import glossaryData from '@site/src/data/glossary.json';

type GlossaryEntry = {
  title: string;
  def: string;
  link?: string;   // optional "learn more" URL — external source or internal doc
};

type Props = {
  children: React.ReactNode;
  term?: string;
  id?: string;
};

const GlossaryTerm: React.FC<Props> = ({ children, term, id }) => {
  const keySource = term || id || (typeof children === 'string' ? children : '');
  const lookupKey = keySource.toLowerCase().trim();
  const entry = (glossaryData as any)[lookupKey] as GlossaryEntry | undefined;

  if (!entry) {
    return <span className="glossary-term not-found" title="Term not found in DB">{children}</span>;
  }

  return (
    <span className="glossary-wrapper" tabIndex={0}>
      <span className="glossary-trigger">{children}</span>

      <span className="glossary-tooltip">
        <span className="tooltip-header">
          <span className="tooltip-title">DEFINITION // {entry.title}</span>
        </span>
        <span className="tooltip-body">
          {entry.def}
        </span>
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
    </span>
  );
};

export default GlossaryTerm;
