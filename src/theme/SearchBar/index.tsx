import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

export default function SearchBar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cmdKey, setCmdKey] = useState("CTRL");

  // 1. DETECT OS FOR SHORTCUT HINT
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      // Mac detection
      if (navigator.platform.toUpperCase().indexOf('MAC') >= 0) {
        setCmdKey("⌘");
      }
    }
  }, []);

  // 2. KEYBOARD LISTENER (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const input = document.querySelector(".pagefind-ui__search-input") as HTMLInputElement;
        if (input) {
          input.focus();
          input.select();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 3. PAGEFIND INITIALIZATION
  useEffect(() => {
    if (document.querySelector("#pagefind-script")) return;

    const script = document.createElement("script");
    script.id = "pagefind-script";
    script.src = "/pagefind/pagefind-ui.js"; 
    script.async = true;

    script.onload = () => {
      // @ts-ignore
      if (window.PagefindUI) {
        // @ts-ignore
        new window.PagefindUI({
          element: "#nunix-search",
          showSubResults: true,
          showImages: false,
          resetStyles: false,
          bundlePath: "/pagefind/", 
          baseUrl: "/", 
          ranking: { termSimilarity: 0.9, pageLength: 0.5 },
          translations: {
            placeholder: "SEARCH_INTEL", 
            zero_results: "NO_INTEL_FOUND: [SEARCH_TERM]",
          },
        });
      }
    };

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/pagefind/pagefind-ui.css";
    document.head.appendChild(link);
    document.body.appendChild(script);
  }, []);

  return (
    <div className="navbar__search" style={{ position: "relative" }}>
      <div id="nunix-search" className={styles.searchBox} ref={containerRef}></div>
      
      {/* THE GHOST HINT: ABSOLUTELY POSITIONED OVERLAY */}
      <div className="search-shortcut-hint">
        <span className="search-key">{cmdKey}</span>
        <span className="search-key">K</span>
      </div>
    </div>
  );
}