import React, { useState } from 'react';
import { useLocation } from '@docusaurus/router';

const InodeCounter: React.FC = () => {
  const GOAT_USER = 'nunix';
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
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

      {isOpen && (
        <div className="nunix-log-console" style={{ right: 'auto', left: '20px', bottom: '40px', width: '500px', height: '400px' }}>
          <div className="log-header">
            <span>NET_INTEL // GLOBAL_TRAFFIC</span>
            <button 
              onClick={() => setIsOpen(false)} 
              className="log-close-btn"
            >
              [X]
            </button>
          </div>

          <div className="log-body" style={{ padding: '0', height: 'calc(100% - 60px)', overflow: 'hidden', background: '#fff' }}>
            {/* Changed URL to standard dashboard.
              Removed 'filter' so we can see error messages clearly.
            */}
            <iframe 
              src={`https://${GOAT_USER}.goatcounter.com`}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              title="Analytics Frame"
              loading="lazy"
            />
          </div>
          
          <div className="log-header" style={{ fontSize: '0.6rem', borderTop: '1px solid rgba(48, 186, 120, 0.2)' }}>
             STATUS: UPLINK_VERIFIED
          </div>
        </div>
      )}
    </>
  );
};

export default InodeCounter;