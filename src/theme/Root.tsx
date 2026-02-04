import React, { useEffect } from 'react';

export default function Root({ children }) {
  useEffect(() => {
    const handleInlineClick = (e) => {
      // 1. Target only inline <code> tags (not inside <pre> blocks)
      const isInlineCode = e.target.tagName === 'CODE' && !e.target.closest('pre');
      
      if (isInlineCode) {
        const text = e.target.textContent;
        navigator.clipboard.writeText(text);

        // 2. Visual Feedback (Flash)
        e.target.classList.add('inline-copied-flash');
        
        // 3. Create a tiny "Copied" floating label
        const rect = e.target.getBoundingClientRect();
        const label = document.createElement('span');
        label.innerText = 'COPIED';
        label.className = 'inline-copy-label';
        label.style.top = `${rect.top + window.scrollY - 20}px`;
        label.style.left = `${rect.left + window.scrollX}px`;
        
        document.body.appendChild(label);
        
        setTimeout(() => {
          e.target.classList.remove('inline-copied-flash');
          label.remove();
        }, 800);
      }
    };

    document.addEventListener('click', handleInlineClick);
    return () => document.removeEventListener('click', handleInlineClick);
  }, []);

  return <>{children}</>;
}