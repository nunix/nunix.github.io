import React from 'react';
import Link from '@docusaurus/Link';

const InodeCounter: React.FC = () => {
  return (
    <Link
      to="/telemetry-test"
      className="zen-mode-trigger"
      title="Open Network Intelligence Console"
      style={{ 
        textDecoration: 'none', 
        display: 'inline-flex', 
        alignItems: 'center' 
      }}
    >
      [ TELEMETRY ]
    </Link>
  );
};

export default InodeCounter;