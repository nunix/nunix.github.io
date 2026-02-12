import React from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';

const InodeCounter: React.FC = () => {
  const location = useLocation();
  
  // FIX: Normalize the path by removing any trailing slash to prevent mismatches on refresh
  const currentPath = location.pathname.replace(/\/$/, '');
  const isTelemetryPage = currentPath === '/telemetry-test';

  return (
    <Link
      to={isTelemetryPage ? '/' : '/telemetry-test'}
      className="zen-mode-trigger"
      title={isTelemetryPage ? "Return to Command Center" : "Open Network Intelligence Console"}
      style={{ 
        textDecoration: 'none', 
        display: 'inline-flex', 
        alignItems: 'center' 
      }}
    >
      {isTelemetryPage ? '[ MAIN_DECK ]' : '[ TELEMETRY ]'}
    </Link>
  );
};

export default InodeCounter;