import React from 'react';
import glossaryData from '@site/src/data/glossary.json';

// Define the shape of our glossary data
type GlossaryEntry = {
  title: string;
  def: string;
};

type Props = {
  children: string; // The text you wrap, e.g., "Linux Kernel"
  term?: string;    // Optional: The key in JSON if different from children
};

const GlossaryTerm: React.FC<Props> = ({ children, term }) => {
  // 1. Determine the lookup key (lowercase, trimmed)
  const lookupKey = (term || children).toLowerCase().trim();
  
  // 2. Fetch data (Cast to 'any' to avoid strict indexing errors for now)
  const entry = (glossaryData as any)[lookupKey] as GlossaryEntry | undefined;

  // 3. Render
  if (!entry) {
    // Fallback: If not found, just render the text with a warning style
    return <span className="glossary-term not-found" title="Term not found in DB">{children}</span>;
  }

  return (
    <span className="glossary-wrapper" tabIndex={0}>
      <span className="glossary-trigger">{children}</span>
      
      {/* The Glass Data Card */}
      <span className="glossary-tooltip">
        <span className="tooltip-header">
          <span className="tooltip-title">DEFINITION // {entry.title}</span>
        </span>
        <span className="tooltip-body">
          {entry.def}
        </span>
      </span>
    </span>
  );
};

export default GlossaryTerm;