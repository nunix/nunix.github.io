import React, { useEffect, useState } from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const JumpTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) return;

    const toggleVisibility = () => {
      // Show immediately when user scrolls down 50px
      if (window.scrollY > 50) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button 
      className={`nunix-jump-top ${visible ? 'show' : ''}`} 
      onClick={scrollToTop}
      aria-label="Scroll to top"
      type="button"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    </button>
  );
};

export default JumpTop;