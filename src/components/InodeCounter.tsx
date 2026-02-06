import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from '@docusaurus/router';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const InodeCounter: React.FC = () => {
  // CONFIG: Replace 'nunix' with your actual GoatCounter code
  const GOAT_USER = 'nunix'; 
  
  const [displayCount, setDisplayCount] = useState<string>('------');
  const [isLocked, setIsLocked] = useState(false);
  const realCountRef = useRef<number | null>(null);
  const location = useLocation();

  // 1. FETCH LOGIC (GoatCounter API)
  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) return;

    // Reset for new page navigation
    setIsLocked(false);
    realCountRef.current = null;

    const fetchData = async () => {
      try {
        // GoatCounter requires the path to be exactly as tracked (usually starts with /)
        // We use encodeURIComponent to handle paths with special chars
        const path = encodeURIComponent(location.pathname);
        const endpoint = `https://${GOAT_USER}.goatcounter.com/counter/${path}.json`;
        
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error('Counter API Error');
        
        const data = await res.json();
        
        // GoatCounter returns { count: "123" } (as string)
        if (data && data.count) {
          // Parse the count, removing any potential non-numeric chars just in case
          const countNum = parseInt(data.count.replace(/\D/g, ''), 10);
          realCountRef.current = countNum;
        }
      } catch (err) {
        // If 404, it means 0 views (new page)
        realCountRef.current = 1;
      }
    };

    fetchData();
  }, [location.pathname]);

  // 2. ANIMATION LOGIC (VFD Shuffle)
  useEffect(() => {
    let frame = 0;
    const fps = 30;
    const startTime = Date.now();
    const SAFETY_TIMEOUT = 2500; // Stop shuffling after 2.5s

    const interval = setInterval(() => {
      frame++;
      const elapsed = Date.now() - startTime;

      // Lock if we have data OR timed out
      if (realCountRef.current !== null || elapsed > SAFETY_TIMEOUT) {
        const finalValue = realCountRef.current || 1;
        
        // Format with leading zeros for that "System" look (e.g., 000452)
        setDisplayCount(finalValue.toString().padStart(6, '0'));
        setIsLocked(true);
      } 
      else {
        // Shuffle effect (random numbers)
        const random = Math.floor(Math.random() * 999999);
        setDisplayCount(random.toString().padStart(6, '0'));
      }
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [location.pathname]);

  return (
    <span className="inode-status-wrapper" title={`Total Views: ${location.pathname}`}>
      <span className="inode-label">HITS:</span>
      <span className={`inode-value ${isLocked ? 'is-locked' : 'is-booting'}`}>
        {displayCount}
      </span>
    </span>
  );
};

export default InodeCounter;