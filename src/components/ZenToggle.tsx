import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useLocation } from '@docusaurus/router';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const ZenToggle: React.FC = () => {
  const [active, setActive] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) return;
    const html = document.documentElement;
    active ? html.setAttribute('data-single-user', 'true') : html.removeAttribute('data-single-user');
  }, [active]);

  // Safety: Exit Zen mode on navigation
  useEffect(() => setActive(false), [location]);

  // The Exit Button (Teleported to Body to survive parent hiding)
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
      <button 
        className="zen-mode-trigger" 
        onClick={() => setActive(!active)}
        title="Enter Single User Mode"
      >
        [{active ? ' ZEN: ON ' : ' Enter Focus Mode '}]
      </button>
      {active && ExecutionEnvironment.canUseDOM && ReactDOM.createPortal(exitButton, document.body)}
    </>
  );
};

export default ZenToggle;