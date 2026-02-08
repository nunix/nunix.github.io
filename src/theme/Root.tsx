import React, { useEffect, useState } from "react";
import { useLocation } from "@docusaurus/router";
import ZenToggle from "@site/src/components/ZenToggle";
import InodeCounter from "@site/src/components/InodeCounter";

export default function Root({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  // --- STATE ---
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [readingTime, setReadingTime] = useState<number>(0);
  const [sslStatus, setSslStatus] = useState<{
    secure: boolean;
    expiry: string;
  } | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [logOpen, setLogOpen] = useState(false);
  const [visibleLines, setVisibleLines] = useState<number>(0);

  // SCROLL STATE
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showJumpTop, setShowJumpTop] = useState(false);

  // LINK TOOLTIP STATE
  const [hoveredLink, setHoveredLink] = useState<{
    url: string;
    x: number;
    y: number;
  } | null>(null);

  const logEntries = [
    { text: "[OK] LOAD_NUNIX_DEV", type: "success" },
    {
      text: `[OK] SSL_HANDSHAKE: ${sslStatus?.secure ? "SECURE" : "UNVERIFIED"}`,
      type: "success",
    },
    { text: `[OK] REPO_SYNC: ${lastUpdated}`, type: "success" },
    { text: `[INFO] CONTENT_SCAN: ${readingTime}M_READ`, type: "default" },
    { text: `[INFO] LAST_UPDATED: ${lastUpdated}`, type: "default" },
    { text: "[READY] NUNIX_DEV_LOADED", type: "highlight" },
  ];

  // --- SECTION 1: LOGS & SSL ---
  useEffect(() => {
    if (logOpen) {
      setVisibleLines(0);
      const interval = setInterval(() => {
        setVisibleLines((prev) => {
          if (prev >= logEntries.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [logOpen]);

  useEffect(() => {
    fetch("/ssl-info.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setSslStatus({ secure: data.is_secure, expiry: data.expiry_date });
          setLastUpdated(data.last_updated);
        }
      });
  }, []);

  // --- SECTION 2: READING TIME LOGIC ---
  const calculateReadTime = () => {
    const content = document.querySelector(".markdown");
    if (content) {
      const text = content.textContent || "";
      const words = text.split(/\s+/).length;
      const minutes = Math.ceil(words / 200);
      setReadingTime(minutes);
    }
  };

  useEffect(() => {
    setTimeout(calculateReadTime, 500);
    setScrollProgress(0);
    setShowJumpTop(false);
    setHoveredLink(null);
  }, [location.pathname]);

  // --- SECTION 3: SCROLL & HOVER LOGIC ---
  useEffect(() => {
    // 1. Scroll Handler
    const handleScroll = () => {
      const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      const scrollHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight,
      );
      const clientHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const totalScrollable = scrollHeight - clientHeight;

      let progress = 0;
      if (totalScrollable > 0) {
        progress = (scrollTop / totalScrollable) * 100;
        progress = Math.min(100, Math.max(0, progress));
      }

      setScrollProgress(progress);
      setShowJumpTop(scrollTop > 300);

      // Hide tooltip on scroll to prevent detachment
      setHoveredLink(null);
    };

    // 2. Link Hover Handler (Attached Tooltip)
    const handleHover = (e: MouseEvent) => {
      // TARGETING: Only .markdown links (Content), ignore sidebar/nav
      const target = (e.target as HTMLElement).closest(".markdown a");

      if (target && (target as HTMLAnchorElement).href) {
        const anchor = target as HTMLAnchorElement;
        const rect = anchor.getBoundingClientRect();

        setHoveredLink({
          url: anchor.href,
          x: rect.left, // Align with left edge of link
          y: rect.bottom + 8, // 8px below the link
        });
      } else {
        setHoveredLink(null);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.body.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseover", handleHover);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseover", handleHover);
    };
  }, [location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- SECTION 4: GLOBAL UI INTERACTION ---
  useEffect(() => {
    const closeZoom = () => {
      const overlay = document.querySelector(".img-zoom-overlay");
      if (overlay) {
        overlay.classList.remove("active");
        setTimeout(() => overlay.remove(), 300);
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.tagName === "CODE" && !target.closest("pre")) {
        const text = target.textContent || "";
        navigator.clipboard.writeText(text);
        target.classList.add("inline-copied-flash");

        const rect = target.getBoundingClientRect();
        const label = document.createElement("span");
        label.innerText = "COPIED";
        label.className = "inline-copy-label";
        label.style.top = `${rect.top + window.scrollY - 20}px`;
        label.style.left = `${rect.left + window.scrollX}px`;

        document.body.appendChild(label);
        setTimeout(() => {
          target.classList.remove("inline-copied-flash");
          label.remove();
        }, 800);
        return;
      }

      if (target.tagName === "IMG" && target.closest(".markdown")) {
        const imgTarget = target as HTMLImageElement;
        const overlay = document.createElement("div");
        overlay.className = "img-zoom-overlay";
        overlay.innerHTML = `
          <div class="zoom-hud-exit">ESC: EXIT | CLICK: ZOOM</div>
          <img src="${imgTarget.src}" class="zoomable-content" />
        `;
        document.body.appendChild(overlay);
        setTimeout(() => overlay.classList.add("active"), 10);

        overlay.onclick = (event: MouseEvent) => {
          const clickTarget = event.target as HTMLElement;
          if (clickTarget.tagName === "IMG") {
            event.stopPropagation();
            clickTarget.classList.toggle("is-magnified");
          } else {
            closeZoom();
          }
        };
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeZoom();
    };

    document.addEventListener("click", handleGlobalClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleGlobalClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // --- SECTION 5: RENDER ---
  return (
    <>
      <div className="crt-overlay-localized"></div>

      {children}

      {/* 1. BUFFER BAR */}
      <div className="buffer-track">
        <div
          className={`buffer-bar ${scrollProgress > 0 ? "is-active" : ""}`}
          style={{
            width: `${scrollProgress}%`,
            opacity: scrollProgress > 1 ? 1 : 0,
          }}
        />
      </div>

      <div className={`buffer-eof ${scrollProgress > 99 ? "eof-active" : ""}`}>
        [ EOF ]
      </div>

      <button
        className={`nunix-jump-top ${showJumpTop ? "show" : ""}`}
        onClick={scrollToTop}
        type="button"
        title="Scroll to Top"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>

      {/* NEW: ATTACHED TOOLTIP (Dynamic Position) */}
      {hoveredLink && (
        <div
          className="nunix-link-tooltip"
          style={{
            top: `${hoveredLink.y}px`,
            left: `${hoveredLink.x}px`,
          }}
        >
          <span className="tooltip-arrow"></span>
          <span className="tooltip-url">{hoveredLink.url}</span>
        </div>
      )}

      {logOpen && isVisible && (
        <div className="nunix-log-console">
          <div className="log-header">
            <span>NUNIX_SYS_LOG</span>
            <button onClick={() => setLogOpen(false)} className="log-close-btn">
              [X]
            </button>
          </div>
          <div className="log-body">
            {logEntries.slice(0, visibleLines).map((line, index) => (
              <div
                key={index}
                className={`log-line ${line.type === "success" ? "text-success" : line.type === "highlight" ? "text-highlight" : ""}`}
              >
                {line.text}
              </div>
            ))}
            <div className="log-cursor">_</div>
          </div>
        </div>
      )}

      <div className={`nunix-status-bar ${!isVisible ? "is-collapsed" : ""}`}>
        <div className="status-section section-left">
          {isVisible && (
            <div className="status-node">
              <span className="status-pulse"></span>
              <span className="status-label">SSL:</span>
              <span className="status-active-value">
                {sslStatus?.secure
                  ? `SECURE | ${sslStatus.expiry}`
                  : "AUTHENTICATING..."}
              </span>
              <span className="status-node">
                <InodeCounter />
              </span>
            </div>
          )}
        </div>

        <div className="status-section section-center">
          {isVisible && (
            <div className="status-node">
              <span className="status-label">READ_TIME:</span>
              {readingTime} MIN
              <span className="status-node">
                <ZenToggle />
              </span>
            </div>
          )}
        </div>

        <div className="status-section section-right">
          {isVisible && (
            <>
              <div className="status-node hide-mobile">
                <span className="status-label">UPDATED:</span>
                <span className="status-active-value">
                  {lastUpdated || "SYNCING..."}
                </span>
              </div>

              <div
                className="status-node author-trigger"
                onClick={() => setLogOpen(!logOpen)}
              >
                <span className="status-label">BY:</span>
                <span className="geminix-link status-active-value">
                  GEMINIX
                </span>
              </div>
            </>
          )}

          <button
            className={`status-toggle ${!isVisible ? "is-collapsed-btn" : ""}`}
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? "[ HIDE ]" : "[ SHOW HUD ]"}
          </button>
        </div>
      </div>
    </>
  );
}
