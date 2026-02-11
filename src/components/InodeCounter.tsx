import React, { useState } from 'react';
import { useLocation } from '@docusaurus/router';

const InodeCounter: React.FC = () => {
  const GOAT_USER = 'nunix';
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* 1. THE TRIGGER BUTTON (Lives in Status Bar) */}
      <span 
        className="inode-status-wrapper" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer' }}
        title="Toggle Network Intelligence"
      >
        <span className="inode-label">TELEMETRY:</span>
        <span className={`inode-value ${isOpen ? 'text-success' : ''}`}>
          {isOpen ? '[ LIVE_FEED ]' : '[ OFFLINE ]'}
        </span>
      </span>

      {/* 2. THE FLOATING METRICS CONSOLE */}
      {isOpen && (
        <div className="nunix-log-console" style={{ right: 'auto', left: '20px', bottom: '40px', width: '400px' }}>
          {/* HEADER */}
          <div className="log-header">
            <span>NET_INTEL // {location.pathname === '/' ? 'ROOT' : location.pathname}</span>
            <button 
              onClick={() => setIsOpen(false)} 
              className="log-close-btn"
            >
              [X]
            </button>
          </div>

          {/* BODY (The Graph) */}
          <div className="log-body" style={{ padding: '0', height: '250px', overflow: 'hidden', background: '#fff' }}>
            <iframe 
              src={`https://${GOAT_USER}.goatcounter.com/frame?s=150`}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                filter: 'invert(1) hue-rotate(180deg)' // Cheap "Dark Mode" hack for the iframe
              }}
              title="Analytics Frame"
              loading="lazy"
            />
          </div>
          
          {/* FOOTER DECORATION */}
          <div className="log-header" style={{ fontSize: '0.6rem', borderTop: '1px solid rgba(48, 186, 120, 0.2)' }}>
             STATUS: ENCRYPTED_UPLINK_ESTABLISHED
          </div>
        </div>
      )}
    </>
  );
};

export default InodeCounter;