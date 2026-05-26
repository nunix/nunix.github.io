import React from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';

const InodeCounter: React.FC = () => {
  const location = useLocation();
  
  // FIX: Normalize the path by removing any trailing slash to prevent mismatches on refresh
  const currentPath = location.pathname.replace(/\/$/, '');
  const isCosmosPage = currentPath === '/cosmos';

  return (
    <Link
      to={isCosmosPage ? '/' : '/cosmos'}
      className="zen-mode-trigger"
      title={isCosmosPage ? "Return to AIverse" : "Open Cosmic Map"}
      style={{
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center'
      }}
    >
      {isCosmosPage ? '[ HOME ]' : '[ MAP ]'}
    </Link>
  );
};

export default InodeCounter;