import React, { useEffect, useState } from 'react';
import { useLocation } from '@docusaurus/router';

export default function Root({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // EFFECT: System Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formatted = now.toISOString()
        .replace(/-/g, '.')
        .replace('T', ' | ')
        .substring(0, 19);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // EFFECT 1: Handle Global Clicks and Keyboard (Existing Logic)
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

      // --- 1. INLINE CODE COPY LOGIC ---
      const isInlineCode = target.tagName === 'CODE' && !target.closest('pre');
      if (isInlineCode) {
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

      // --- 2. IMAGE ZOOM LOGIC ---
      const isBlogImg = target.tagName === 'IMG' && target.closest('.markdown');
      if (isBlogImg) {
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

  // EFFECT 2: Inject HUD hints above images (Existing Logic)
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

  return (
    <>
      {children}
      
      {/* STATUS BAR CONTAINER */}
      <div className={`nunix-status-bar ${!isVisible ? 'is-collapsed' : ''}`}>
        
        {isVisible && (
          <div className="status-content">
            <div className="status-node">
              <span className="status-pulse"></span>
              <span className="status-label">AUTHORED_BY:</span> GEMINIX
            </div>
            
            <div className="status-node hide-mobile">
              <span className="status-label">ENVIRONMENT:</span> PRODUCTION_STABLE
            </div>

            <div className="status-node">
              <span className="status-label">ENCRYPTION:</span> 
              <span className="status-active-value">SECURE_SSL</span>
            </div>
          </div>
        )}

        {/* Toggle Button - Locked to Right side */}
        <button 
          className="status-toggle" 
          onClick={() => setIsVisible(!isVisible)}
          title={isVisible ? "Collapse HUD" : "Expand HUD"}
        >
          {isVisible ? '[ HIDE ]' : '[ SHOW HUD ]'}
        </button>
      </div>
    </>
  );
}