import React, {type ReactNode, useState, useCallback, useEffect} from 'react';
import CodeBlock from '@theme-original/CodeBlock';
import type CodeBlockType from '@theme/CodeBlock';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof CodeBlockType>;

export default function CodeBlockWrapper(props: Props): ReactNode {
  const [alertText, setAlertText] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // 1. Check if user is a "New Tech" visitor
  useEffect(() => {
    const hasSeenHint = localStorage.getItem('nunix-hint-seen');
    if (!hasSeenHint) {
      // Small delay so it doesn't pop in instantly with the page load
      const timer = setTimeout(() => setShowHint(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const triggerAlert = useCallback((text: string) => {
    setAlertText(text);
    setShowAlert(true);
    setShowHint(false); // Hide the hint forever once they actually use the feature
    localStorage.setItem('nunix-hint-seen', 'true');
    setTimeout(() => setShowAlert(false), 1500);
  }, []);

  const handleCodeInteraction = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    const selectedText = selection?.toString();

    if (selectedText && selectedText.length > 0) {
      navigator.clipboard.writeText(selectedText);
      triggerAlert('SELECTION COPIED!');
      return;
    }

    const line = (e.target as HTMLElement).closest('.token-line');
    if (line) {
      const text = line.textContent || '';
      const cleanText = text.replace(/^\d+/, '').trim(); 
      if (cleanText) {
        navigator.clipboard.writeText(cleanText);
        triggerAlert('LINE COPIED!');
      }
    }
  };

  return (
    <div 
      onClick={handleCodeInteraction} 
      className={`nunix-code-wrapper ${showAlert ? 'alert-active' : ''}`}
    >
      {/* The One-Time Tutorial Hint */}
      {showHint && (
        <div className="nunix-terminal-hint">
          <span className="hint-pulse">●</span> CLICK LINE OR SELECT TO COPY
        </div>
      )}

      {/* The Global Status Badge */}
      <div className="nunix-copy-status">
        {alertText}
      </div>
      
      <CodeBlock showLineNumbers={true} {...props} />
    </div>
  );
}