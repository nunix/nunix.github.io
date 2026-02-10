import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useLocation } from '@docusaurus/router';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const ZenToggle: React.FC = () => {
  const [active, setActive] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const location = useLocation();

  // 1. THE LOGIC: Toggle the global attribute on <html>
  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) return;
    const html = document.documentElement;
    if (active) {
      html.setAttribute('data-single-user', 'true');
    } else {
      html.removeAttribute('data-single-user');
    }
  }, [active]);

  // 2. SAFETY: Auto-exit Zen mode on page navigation
  useEffect(() => {
    setActive(false);
  }, [location]);

  // 3. THE EXIT BUTTON (Teleported to Body)
  // This ensures the button remains visible even when the Status Bar is hidden
  const exitButton = (
    <div className="zen-exit-hud">
      <button 
        className="zen-exit-btn" 
        onClick={() => setActive(false)}
        title="Reboot Interface"
      >
        [ EXIT FOCUS MODE ]
      </button>
    </div>
  );

  return (
    <>
      {/* THE TRIGGER BUTTON (Lives in Status Bar) */}
      <button 
        className="zen-mode-trigger" 
        onClick={() => setActive(!active)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        [{active ? ' ZEN: ON ' : ' FOCUS '}]

        {/* The New Tooltip */}
        {showTooltip && (
          <div className="nunix-status-tooltip">
            <span className="tooltip-arrow-down"></span>
            <span className="tooltip-text">
              INTERFACE :: <span className="tooltip-highlight">{active ? 'RESTORE_HUD' : 'SINGLE_TASK'}</span>
            </span>
          </div>
        )}
      </button>

      {/* RENDER PORTAL: Puts the exit button directly into the <body> */}
      {active && ExecutionEnvironment.canUseDOM && ReactDOM.createPortal(exitButton, document.body)}
    </>
  );
};

export default ZenToggle;