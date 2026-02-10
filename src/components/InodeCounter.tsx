import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from '@docusaurus/router';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const InodeCounter: React.FC = () => {
  const GOAT_USER = 'nunix'; 

  const [displayCount, setDisplayCount] = useState<string>('------');
  const [formattedTotal, setFormattedTotal] = useState<string>('0');
  const [isLocked, setIsLocked] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const realCountRef = useRef<number | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) return;
    setIsLocked(false);
    realCountRef.current = null;
    setDisplayCount('------'); 

    const fetchData = async () => {
      try {
        let requestPath = location.pathname;
        if (requestPath !== '/' && requestPath.endsWith('/')) {
          requestPath = requestPath.slice(0, -1);
        }
        const endpoint = `https://${GOAT_USER}.goatcounter.com/counter/${encodeURIComponent(requestPath)}.json`;
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error('API Error');
        
        const data = await res.json();
        const count = parseInt(String(data?.count || 0).replace(/\D/g, ''), 10);
        realCountRef.current = count || 0;
      } catch (err) {
        realCountRef.current = 1;
      }
    };
    fetchData();
  }, [location.pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (realCountRef.current !== null) {
        const val = realCountRef.current;
        setDisplayCount(val.toString().padStart(6, '0'));
        setFormattedTotal(val.toLocaleString());
        setIsLocked(true);
        clearInterval(interval);
      } else {
        setDisplayCount(Math.floor(Math.random() * 999999).toString().padStart(6, '0'));
      }
    }, 33);
    return () => clearInterval(interval);
  }, [location.pathname]);

  return (
    <span 
      className="inode-status-wrapper" 
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="inode-label">ACCESS:</span>
      <span className={`inode-value ${isLocked ? 'is-locked' : 'is-booting'}`}>
        {displayCount}
      </span>

      {showTooltip && (
        <div className="nunix-status-tooltip">
          <span className="tooltip-arrow-down"></span>
          <span className="tooltip-text">
            TOTAL_HITS :: <span className="tooltip-highlight">[ {formattedTotal} ]</span>
          </span>
        </div>
      )}
    </span>
  );
};

export default InodeCounter;