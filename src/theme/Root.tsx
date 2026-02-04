import React, { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';

export default function Root({ children }) {
  const location = useLocation();

  // EFFECT 1: Handle Global Clicks and Keyboard
  useEffect(() => {
    const closeZoom = () => {
      const overlay = document.querySelector('.img-zoom-overlay');
      if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
      }
    };

    const handleGlobalClick = (e) => {
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

        overlay.onclick = (event) => {
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
  }, []); // Only runs once on mount

  // EFFECT 2: Inject HUD hints above images
  useEffect(() => {
    const injectImageHints = () => {
      // Small timeout to ensure Docusaurus has finished rendering the MD
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
  }, [location.pathname]); // Re-runs on every page navigation

  return <>{children}</>;
}