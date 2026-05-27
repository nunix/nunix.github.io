import React, { useState, useCallback, useMemo } from 'react';
import { useHistory } from '@docusaurus/router';
import { AIVERSE_ERAS, type AiverseEra } from '@site/src/data/aiverseEras';
import styles from './styles.module.css';

const W = 1200;
const H = 580;

interface LensState {
  era: AiverseEra;
  svgX: number; // lens anchor in SVG coords
  svgY: number;
}

// Convert era % position to SVG coords
function toSVG(px: number, py: number) {
  return { x: (px / 100) * W, y: (py / 100) * H };
}

// Safe orbit radius: never let nodes clip outside the SVG bounds
function safeOrbitRadius(era: AiverseEra): number {
  const c = toSVG(era.position.x, era.position.y);
  const margin = 22;
  const maxR = Math.min(c.x - margin, W - c.x - margin, c.y - margin, H - c.y - margin);
  const desired = (era.radius / 100) * W * 0.72;
  return Math.min(desired, maxR * 0.88);
}

// Orbit start angle: orient so the LAST post node faces the next era in sequence
function orbitStartAngle(era: AiverseEra, nextEra: AiverseEra | null): number {
  if (era.postStartAngle !== undefined) return era.postStartAngle;
  if (!nextEra || era.posts.length === 0) return -Math.PI / 2;
  const c = toSVG(era.position.x, era.position.y);
  const nc = toSVG(nextEra.position.x, nextEra.position.y);
  const angleToNext = Math.atan2(nc.y - c.y, nc.x - c.x);
  const n = era.posts.length;
  return angleToNext - ((n - 1) / n) * 2 * Math.PI;
}

// Post node SVG position (orbit around era center)
function postSVGPos(era: AiverseEra, idx: number, startAngle: number) {
  const c = toSVG(era.position.x, era.position.y);
  const orbitR = safeOrbitRadius(era);
  const dir = era.postOrbitDirection ?? 1;
  const angle = startAngle + dir * (idx / era.posts.length) * 2 * Math.PI;
  return { x: c.x + orbitR * Math.cos(angle), y: c.y + orbitR * Math.sin(angle) };
}

// Build sequential pathway: all post nodes in order, then era centers for empty eras
function buildPathD(eras: typeof AIVERSE_ERAS): string {
  const pts: { x: number; y: number }[] = [];
  for (let e = 0; e < eras.length; e++) {
    const era = eras[e];
    const nextEra = eras[e + 1] ?? null;
    if (era.posts.length > 0) {
      const sa = orbitStartAngle(era, nextEra);
      era.posts.forEach((_, i) => pts.push(postSVGPos(era, i, sa)));
    } else {
      pts.push(toSVG(era.position.x, era.position.y));
    }
  }
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1], c = pts[i];
    const cpx = (p.x + c.x) / 2 + (i % 2 === 0 ? -30 : 30);
    const cpy = (p.y + c.y) / 2 + (i % 2 === 0 ? 20 : -20);
    d += ` Q ${cpx} ${cpy} ${c.x} ${c.y}`;
  }
  return d;
}

// Hardcoded stars (random-looking but deterministic)
const STARS = [
  [48,22,1.2,.9],[112,45,.9,.7],[198,12,1.4,.8],[267,88,.8,.6],[340,30,1.1,.9],
  [423,67,.9,.7],[511,15,1.3,.8],[589,42,1,.6],[672,78,.8,.9],[745,20,1.2,.7],
  [834,55,.9,.8],[910,33,1.1,.6],[988,71,.8,.9],[1062,18,1.3,.7],[1138,48,1,.8],
  [75,140,.8,.5],[163,178,1.1,.7],[245,155,.9,.6],[338,195,1.2,.8],[419,132,.8,.7],
  [507,168,1,.6],[598,145,1.3,.9],[684,182,.9,.5],[772,151,1.1,.7],[858,175,.8,.8],
  [944,138,1.2,.6],[1032,165,.9,.9],[1118,148,1,.7],[28,290,.8,.6],[145,315,1.1,.8],
  [234,272,.9,.7],[357,302,1.3,.5],[448,285,.8,.9],[536,318,1,.6],[627,295,1.2,.8],
  [718,308,.9,.7],[806,278,1.1,.6],[897,305,.8,.9],[985,288,1.3,.7],[1074,312,1,.5],
  [1152,290,.9,.8],[92,415,.8,.7],[188,438,1.1,.6],[285,402,.9,.8],[382,425,1.2,.5],
  [476,445,.8,.9],[572,418,1,.7],[665,440,1.3,.6],[758,412,.9,.8],[851,435,1.1,.7],
  [948,418,.8,.6],[1040,442,1.2,.9],[1130,425,.9,.5],[52,520,1,.7],[159,545,.8,.8],
  [258,502,1.1,.6],[355,528,.9,.9],[452,508,1.3,.5],[549,535,.8,.7],[646,514,1,.8],
  [743,540,1.2,.6],[840,510,.9,.9],[937,532,1.1,.7],[1034,516,.8,.5],[1131,538,1,.8],
].map(([cx, cy, r, o]) => ({ cx, cy, r, o }));

export default function CosmicMap() {
  const [lens, setLens] = useState<LensState | null>(null);
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);
  const history = useHistory();
  const pathD = useMemo(() => buildPathD(AIVERSE_ERAS), []);

  const handleEraClick = useCallback((e: React.MouseEvent, era: AiverseEra) => {
    e.stopPropagation();
    const c = toSVG(era.position.x, era.position.y);
    setLens({ era, svgX: c.x, svgY: c.y });
  }, []);

  const closeLens = useCallback(() => setLens(null), []);

  return (
    <div className={styles.cosmos} onClick={closeLens}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={styles.svg}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Blur for era zones */}
          <filter id="zoneBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="28" />
          </filter>
          {/* Glow for nodes */}
          <filter id="nodeGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Strong glow for era centers */}
          <filter id="eraGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Warp background gradient */}
          <radialGradient id="warpGrad" cx="75%" cy="78%" r="40%">
            <stop offset="0%" stopColor="#6b21a8" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#6b21a8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Space background */}
        <rect width={W} height={H} fill="#06060f" rx="10" />

        {/* Warp rift background */}
        <rect width={W} height={H} fill="url(#warpGrad)" rx="10" />

        {/* Stars */}
        {STARS.map((s, i) => (
          <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={s.o} />
        ))}

        {/* Era zone blobs (blurred background regions) */}
        {AIVERSE_ERAS.map((era) => {
          const c = toSVG(era.position.x, era.position.y);
          const rx = (era.radius / 100) * W * 1.4;
          const ry = (era.radius / 100) * H * 1.6;
          return (
            <ellipse
              key={era.id + '-zone'}
              cx={c.x} cy={c.y}
              rx={rx} ry={ry}
              fill={era.color}
              opacity={era.isWarp ? 0.07 : 0.05}
              filter="url(#zoneBlur)"
            />
          );
        })}

        {/* Sequential pathway through posts */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="2"
          filter="url(#zoneBlur)"
        />
        <path
          d={pathD}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="0.8"
          strokeDasharray="6 5"
          className={styles.pathwayDash}
        />

        {/* Era centers + post nodes */}
        {AIVERSE_ERAS.map((era, eraIdx) => {
          const c = toSVG(era.position.x, era.position.y);
          const eraR = (era.radius / 100) * W * 0.28;
          const nextEra = AIVERSE_ERAS[eraIdx + 1] ?? null;
          const sa = orbitStartAngle(era, nextEra);

          return (
            <g key={era.id}>
              {/* Era center circle */}
              <circle
                cx={c.x} cy={c.y}
                r={eraR}
                fill={era.color}
                fillOpacity={0.12}
                stroke={era.color}
                strokeWidth="1.5"
                strokeOpacity={0.5}
                filter="url(#eraGlow)"
                onClick={(e) => handleEraClick(e, era)}
                style={{ cursor: 'pointer' }}
              />
              {/* Era label */}
              <text
                x={c.x} y={c.y - eraR - 8}
                textAnchor="middle"
                fill={era.color}
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
                opacity={0.85}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {era.missions}
              </text>
              <text
                x={c.x} y={c.y}
                textAnchor="middle"
                fill={era.color}
                fontSize="8.5"
                fontFamily="monospace"
                opacity={0.65}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {era.label.split('—')[0].trim()}
              </text>

              {/* Post nodes */}
              {era.posts.map((post, i) => {
                const pos = postSVGPos(era, i, sa);
                const nodeId = `${era.id}-${i}`;
                const isHovered = hoveredPost === nodeId;
                return (
                  <g
                    key={post.path}
                    onClick={(e) => { e.stopPropagation(); history.push(post.path); }}
                    onMouseEnter={() => setHoveredPost(nodeId)}
                    onMouseLeave={() => setHoveredPost(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Connection line era center → post node */}
                    <line
                      x1={c.x} y1={c.y}
                      x2={pos.x} y2={pos.y}
                      stroke={era.color}
                      strokeWidth="0.6"
                      strokeOpacity={0.25}
                    />
                    {/* Node glow ring on hover */}
                    {isHovered && (
                      <circle
                        cx={pos.x} cy={pos.y}
                        r={10}
                        fill="none"
                        stroke={era.color}
                        strokeWidth="1"
                        strokeOpacity={0.5}
                        filter="url(#nodeGlow)"
                      />
                    )}
                    {/* Diamond node (rotated square) */}
                    <rect
                      x={pos.x - 5} y={pos.y - 5}
                      width="10" height="10"
                      fill={era.color}
                      opacity={isHovered ? 1 : 0.75}
                      transform={`rotate(45 ${pos.x} ${pos.y})`}
                      filter="url(#nodeGlow)"
                    />
                    {/* Post label */}
                    <text
                      x={pos.x}
                      y={pos.y + (isHovered ? -14 : -12)}
                      textAnchor="middle"
                      fill={era.color}
                      fontSize={isHovered ? "9.5" : "8"}
                      fontFamily="monospace"
                      opacity={isHovered ? 0.95 : 0.55}
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {post.missions}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Lens popup — HTML overlay */}
      {lens && (
        <div
          className={styles.lens}
          style={{
            '--lens-color': lens.era.color,
            '--lens-glow': lens.era.glowColor,
            left: `${(lens.svgX / W) * 100}%`,
            top: `${(lens.svgY / H) * 100}%`,
          } as React.CSSProperties}
          onClick={(e) => e.stopPropagation()}
        >
          <button className={styles.lensClose} onClick={closeLens}>×</button>
          <div className={styles.lensHeader}>
            <span className={styles.lensMissions}>{lens.era.missions}</span>
            <h3 className={styles.lensTitle}>{lens.era.label}</h3>
            <p className={styles.lensTagline}>{lens.era.tagline}</p>
          </div>
          {lens.era.posts.length > 0 ? (
            <ul className={styles.lensPosts}>
              {lens.era.posts.map((post) => (
                <li key={post.path}>
                  <button
                    className={styles.lensPostLink}
                    onClick={() => { history.push(post.path); closeLens(); }}
                  >
                    <span className={styles.postMission}>{post.missions}</span>
                    <span className={styles.postTitle}>{post.title}</span>
                    <span className={styles.postSubtitle}>{post.subtitle}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.lensEmpty}>Chronicles incoming — the Remembrancer is writing.</p>
          )}
        </div>
      )}

      <div className={styles.legend}>
        <span className={styles.legendTitle}>AIVERSE COSMOS · CLICK AN ERA NODE TO EXPLORE</span>
      </div>
    </div>
  );
}
