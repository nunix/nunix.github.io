import React, { useEffect, useState } from 'react';
import { useLocation } from '@docusaurus/router';

export default function Root({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  // --- STATE SECTIONS ---
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [readingTime, setReadingTime] = useState<number>(0);
  // Using the new status object for binary state and date string
  const [sslStatus, setSslStatus] = useState<{secure: boolean, expiry: string} | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    fetch('/ssl-info.json')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setSslStatus({ secure: data.is_secure, expiry: data.expiry_date });
          setLastUpdated(data.last_updated); // Map to our JSON key
        }
      });
  }, []);

  // --- SECTION 2: READING TIME LOGIC ---
  const calculateReadTime = () => {
    const content = document.querySelector('.markdown');
    if (content) {
      const text = content.textContent || "";
      const words = text.split(/\s+/).length;
      const minutes = Math.ceil(words / 200); 
      setReadingTime(minutes);
    }
  };

  useEffect(() => {
    setTimeout(calculateReadTime, 500);
  }, [location.pathname]);

  // --- SECTION 3: GLOBAL UI INTERACTION (Clicks/Zoom/Copy) ---
  useEffect(() => {
    const closeZoom = () => {
      const overlay = document.querySelector('.img-zoom-overlay');
      if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Inline Code Copy
      if (target.tagName === 'CODE' && !target.closest('pre')) {
        const text = target.textContent || '';
        navigator.clipboard.writeText(text);
        target.classList.add('inline-copied-flash');
        
        const rect = target.getBoundingClientRect();
        const label = document.createElement('span');
        label.innerText = 'COPIED';
        label.className = 'inline-copy-label';
        label.style.top = `${rect.top + window.scrollY - 20}px`;
        label.style.left = `${rect.left + window.scrollX}px`;
        
        document.body.appendChild(label);
        setTimeout(() => {
          target.classList.remove('inline-copied-flash');
          label.remove();
        }, 800);
        return;
      }

      // Image Zoom
      if (target.tagName === 'IMG' && target.closest('.markdown')) {
        const imgTarget = target as HTMLImageElement;
        const overlay = document.createElement('div');
        overlay.className = 'img-zoom-overlay';
        overlay.innerHTML = `
          <div class="zoom-hud-exit">ESC: EXIT | CLICK: ZOOM</div>
          <img src="${imgTarget.src}" class="zoomable-content" />
        `;
        document.body.appendChild(overlay);
        setTimeout(() => overlay.classList.add('active'), 10);

        overlay.onclick = (event: MouseEvent) => {
          const clickTarget = event.target as HTMLElement;
          if (clickTarget.tagName === 'IMG') {
            event.stopPropagation();
            clickTarget.classList.toggle('is-magnified');
          } else {
            closeZoom();
          }
        };
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeZoom();
    };

    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // --- SECTION 4: HUD INJECTION (Image Hints) ---
  useEffect(() => {
    const injectImageHints = () => {
      setTimeout(() => {
        const images = document.querySelectorAll('.markdown p > img');
        images.forEach((img) => {
          if (!img.parentElement?.classList.contains('nunix-img-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'nunix-img-wrapper';
            const hint = document.createElement('div');
            hint.className = 'nunix-image-hint';
            hint.innerHTML = `<span class="hint-pulse">●</span> CLICK TO ENLARGE`;
            img.parentNode?.insertBefore(wrapper, img);
            wrapper.appendChild(hint);
            wrapper.appendChild(img);
          }
        });
      }, 100);
    };
    injectImageHints();
  }, [location.pathname]);

  // --- SECTION 5: RENDER ---
  return (
    <>
      {/* CRT OVERLAY REMOVED FROM HERE TO KEEP SITE CLEAR */}
      {children}
      
      <div className={`nunix-status-bar ${!isVisible ? 'is-collapsed' : ''}`}>
        <div className="status-section section-left">
          {isVisible && (
            <div className="status-node">
              <span className="status-pulse"></span>
              <span className="status-label">SSL:</span> 
              <span className="status-active-value">
                {sslStatus?.secure ? `SECURE | ${sslStatus.expiry}` : 'UNVERIFIED'}
              </span>
            </div>
          )}
        </div>

        <div className="status-section section-center">
          {isVisible && (
            <div className="status-node">
              <span className="status-label">READ_TIME:</span> 
              {readingTime} MIN
            </div>
          )}
        </div>

        <div className="status-section section-right">
          {isVisible && (
            <div className="status-node hide-mobile">
              <span className="status-label">LAST_UPDATED:</span> 
              <span className="status-active-value">{lastUpdated || 'SYNCING...'}</span>
            </div>
          )}
          <button className="status-toggle" onClick={() => setIsVisible(!isVisible)}>
            {isVisible ? '[ HIDE ]' : '[ SHOW HUD ]'}
          </button>
        </div>
      </div>
    </>
  );
}