import React, {type ReactNode, useState, useCallback} from 'react';
import CodeBlock from '@theme-original/CodeBlock';
import type CodeBlockType from '@theme/CodeBlock';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof CodeBlockType>;

export default function CodeBlockWrapper(props: Props): ReactNode {
  const [alertText, setAlertText] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const triggerAlert = useCallback((text: string) => {
    setAlertText(text);
    setShowAlert(true);
    // The alert (LINE COPIED) still hides after 1.5s, 
    // but the instruction hint above stays forever.
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
      {/* Permanent Instructional Hint */}
      <div className="nunix-terminal-hint">
        <span className="hint-pulse">●</span> CLICK LINE OR SELECT TO COPY
      </div>

      {/* Temporary Status Badge */}
      <div className="nunix-copy-status">
        {alertText}
      </div>
      
      <CodeBlock showLineNumbers={true} {...props} />
    </div>
  );
}