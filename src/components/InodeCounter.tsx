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

  // 1. FETCH LOGIC
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

        // CORRECT ENDPOINT: '/count' (Reading) instead of '/counter/' (Dashboard)
        const endpoint = `https://${GOAT_USER}.goatcounter.com/count?p=${encodeURIComponent(requestPath)}&t=json`;
        
        const res = await fetch(endpoint);
        
        if (!res.ok) {
           // 404 means 0 views
           if (res.status === 404) {
             realCountRef.current = 0;
             return;
           }
           throw new Error(`API Error: ${res.status}`);
        }
        
        const data = await res.json();
        
        // GoatCounter returns numbers with commas (e.g. "1,200") -> Remove non-digits
        if (data?.count) {
          const countStr = String(data.count).replace(/\D/g, '');
          realCountRef.current = parseInt(countStr, 10) || 0;
        } else {
          realCountRef.current = 0;
        }

      } catch (err) {
        console.warn("Counter Fetch Failed:", err);
        realCountRef.current = 1; // Fallback
      }
    };

    fetchData();
  }, [location.pathname]);

  // 2. ANIMATION LOGIC
  useEffect(() => {
    const fps = 30;
    const intervalTime = 1000 / fps;
    const startTime = Date.now();
    const SAFETY_TIMEOUT = 3000; 

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;

      if (realCountRef.current !== null || elapsed > SAFETY_TIMEOUT) {
        const finalValue = realCountRef.current !== null ? realCountRef.current : 1;
        
        setDisplayCount(finalValue.toString().padStart(6, '0'));
        setFormattedTotal(finalValue.toLocaleString());
        
        setIsLocked(true);
        clearInterval(interval); 
      } 
      else {
        const random = Math.floor(Math.random() * 999999);
        setDisplayCount(random.toString().padStart(6, '0'));
      }
    }, intervalTime);

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