import React, { useEffect, useState } from 'react';

const BufferLoad: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showEOF, setShowEOF] = useState<boolean>(false);

  useEffect(() => {
    const updateScroll = () => {
      // Calculate how far down we are
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      
      // Prevent divide by zero on short pages
      if (totalHeight <= 0) {
        setScrollProgress(100);
        return;
      }

      const progress = (scrollPosition / totalHeight) * 100;
      setScrollProgress(progress);

      // Trigger EOF signal if we are near the bottom (> 99%)
      if (progress > 99) {
        setShowEOF(true);
      } else {
        setShowEOF(false);
      }
    };

    window.addEventListener('scroll', updateScroll);
    
    // Initial calculation in case we reload halfway down
    updateScroll();

    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  return (
    <div className="buffer-track">
      {/* The Moving Bar */}
      <div 
        className="buffer-bar" 
        style={{ width: `${scrollProgress}%` }}
      />
      
      {/* The EOF Flash Signal */}
      <div className={`buffer-eof ${showEOF ? 'eof-active' : ''}`}>
        [EOF]
      </div>
    </div>
  );
};

export default BufferLoad;