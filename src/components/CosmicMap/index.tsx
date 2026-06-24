import React, { useState, useCallback, useMemo } from 'react';
import { useHistory } from '@docusaurus/router';
import { AIVERSE_ERAS, AIVERSE_NEBULA, AIVERSE_FORGE, type AiverseEra } from '@site/src/data/aiverseEras';
import styles from './styles.module.css';

const W = 1200;
const H = 680;

interface LensState {
  era: AiverseEra;
  svgX: number; // lens anchor in SVG coords
  svgY: number;
}

interface NebulaLensState {
  svgX: number;
  svgY: number;
}

interface ForgeLensState {
  svgX: number;
  svgY: number;
}

// Convert era % position to SVG coords
function toSVG(px: number, py: number) {
  return { x: (px / 100) * W, y: (py / 100) * H };
}

// Post node SVG position — evenly spaced at fixed radius around era center
function postSVGPos(era: AiverseEra, idx: number): { x: number; y: number } {
  const c = toSVG(era.position.x, era.position.y);
  const spokeR = 52; // fixed px radius — same for all eras (EVE planet distance)
  const angle = -Math.PI / 2 + (idx / Math.max(era.posts.length, 1)) * 2 * Math.PI;
  return { x: c.x + spokeR * Math.cos(angle), y: c.y + spokeR * Math.sin(angle) };
}

// Build pathway connecting era CENTERS only
function buildPathD(eras: typeof AIVERSE_ERAS): string {
  const pts = eras.map(e => toSVG(e.position.x, e.position.y));
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1], q = pts[i];
    const cpx = (p.x + q.x) / 2 + (i % 2 === 0 ? -20 : 20);
    const cpy = (p.y + q.y) / 2;
    d += ` Q ${cpx} ${cpy} ${q.x} ${q.y}`;
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
  const [nebulaLens, setNebulaLens] = useState<NebulaLensState | null>(null);
  const [forgeLens, setForgeLens] = useState<ForgeLensState | null>(null);
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);
  const history = useHistory();
  const pathD = useMemo(() => buildPathD(AIVERSE_ERAS), []);

  const closeAllLens = useCallback(() => { setLens(null); setNebulaLens(null); setForgeLens(null); }, []);

  const handleEraClick = useCallback((e: React.MouseEvent, era: AiverseEra) => {
    e.stopPropagation();
    const c = toSVG(era.position.x, era.position.y);
    setLens({ era, svgX: c.x, svgY: c.y });
  }, []);

  const closeLens = useCallback(() => setLens(null), []);

  return (
    <div className={styles.cosmos} onClick={closeAllLens}>
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
          {/* Nebula gas gradient — warm amber, distinct from blue era zones */}
          <radialGradient id="nebulaGas" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#f59e0b" stopOpacity="0.28" />
            <stop offset="25%"  stopColor="#d97706" stopOpacity="0.16" />
            <stop offset="55%"  stopColor="#92400e" stopOpacity="0.08" />
            <stop offset="80%"  stopColor="#451a03" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#06060f"  stopOpacity="0"   />
          </radialGradient>
          {/* Nebula soft blur — distinct from zone blur, looser spread */}
          <filter id="nebulaBlur" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="42" />
          </filter>
          {/* Forge gas gradient — ember/orange, hotter than the Nebula */}
          <radialGradient id="forgeGas" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#fb923c" stopOpacity="0.30" />
            <stop offset="25%"  stopColor="#f97316" stopOpacity="0.18" />
            <stop offset="55%"  stopColor="#9a3412" stopOpacity="0.09" />
            <stop offset="82%"  stopColor="#431407" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#06060f" stopOpacity="0" />
          </radialGradient>
          <filter id="forgeBlur" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="38" />
          </filter>
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

        {/* Nebula — standalone idea zone, not on pathway */}
        {(() => {
          const nc = toSVG(AIVERSE_NEBULA.position.x, AIVERSE_NEBULA.position.y);
          const nr = (AIVERSE_NEBULA.radius / 100) * W * 1.2;
          const starR = (AIVERSE_NEBULA.radius / 100) * W * 0.55;
          return (
            <g key="nebula">
              {/* Nebula gas cloud — radial gradient, free-form with blur */}
              <circle
                cx={nc.x} cy={nc.y}
                r={nr * 2.2}
                fill="url(#nebulaGas)"
                filter="url(#nebulaBlur)"
              />
              {/* Secondary gas wisp — offset slightly for organic look */}
              <circle
                cx={nc.x - nr * 0.35} cy={nc.y + nr * 0.2}
                r={nr * 1.4}
                fill="url(#nebulaGas)"
                opacity={0.5}
                filter="url(#nebulaBlur)"
              />
              {/* Nebula center node — dashed ring to signal "forming" */}
              <circle
                cx={nc.x} cy={nc.y}
                r={(AIVERSE_NEBULA.radius / 100) * W * 0.22}
                fill={AIVERSE_NEBULA.color}
                fillOpacity={0.08}
                stroke={AIVERSE_NEBULA.color}
                strokeWidth="1"
                strokeOpacity={0.4}
                strokeDasharray="4 3"
                filter="url(#eraGlow)"
                onClick={(e) => { e.stopPropagation(); setNebulaLens({ svgX: nc.x, svgY: nc.y }); }}
                style={{ cursor: 'pointer' }}
              />
              {/* Nebula label */}
              <text
                x={nc.x} y={nc.y - (AIVERSE_NEBULA.radius / 100) * W * 0.22 - 6}
                textAnchor="middle"
                fill={AIVERSE_NEBULA.color}
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                opacity={0.7}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                ✦ NEBULA
              </text>
              {/* Star nodes scattered around nebula center */}
              {AIVERSE_NEBULA.stars.map((star, i) => {
                const angle = (i / AIVERSE_NEBULA.stars.length) * 2 * Math.PI - Math.PI / 4;
                const sx = nc.x + starR * Math.cos(angle);
                const sy = nc.y + starR * Math.sin(angle);
                return (
                  <g
                    key={star.path}
                    onClick={() => history.push(star.path)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      cx={sx} cy={sy} r={4}
                      fill={AIVERSE_NEBULA.color}
                      opacity={0.6}
                      filter="url(#nodeGlow)"
                    />
                    <text
                      x={sx} y={sy - 8}
                      textAnchor="middle"
                      fill={AIVERSE_NEBULA.color}
                      fontSize="7.5"
                      fontFamily="monospace"
                      opacity={0.55}
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {star.missions}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })()}

        {/* Forge — active implementation zone, not on pathway */}
        {(() => {
          const fc = toSVG(AIVERSE_FORGE.position.x, AIVERSE_FORGE.position.y);
          const fr = (AIVERSE_FORGE.radius / 100) * W * 1.2;
          const artifactR = (AIVERSE_FORGE.radius / 100) * W * 0.55;
          return (
            <g key="forge">
              {/* Forge gas cloud — ember radial gradient, blurred like hot smoke */}
              <circle
                cx={fc.x} cy={fc.y}
                r={fr * 2.0}
                fill="url(#forgeGas)"
                filter="url(#forgeBlur)"
              />
              <circle
                cx={fc.x + fr * 0.4} cy={fc.y - fr * 0.18}
                r={fr * 1.25}
                fill="url(#forgeGas)"
                opacity={0.5}
                filter="url(#forgeBlur)"
              />
              {/* Forge center node */}
              <circle
                cx={fc.x} cy={fc.y}
                r={(AIVERSE_FORGE.radius / 100) * W * 0.22}
                fill={AIVERSE_FORGE.color}
                fillOpacity={0.09}
                stroke={AIVERSE_FORGE.color}
                strokeWidth="1"
                strokeOpacity={0.45}
                strokeDasharray="5 3"
                filter="url(#eraGlow)"
                onClick={(e) => { e.stopPropagation(); setForgeLens({ svgX: fc.x, svgY: fc.y }); }}
                style={{ cursor: 'pointer' }}
              />
              <text
                x={fc.x} y={fc.y - (AIVERSE_FORGE.radius / 100) * W * 0.22 - 6}
                textAnchor="middle"
                fill={AIVERSE_FORGE.color}
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                opacity={0.75}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                ⚒ FORGE
              </text>
              {AIVERSE_FORGE.artifacts.map((artifact, i) => {
                const angle = (i / AIVERSE_FORGE.artifacts.length) * 2 * Math.PI + Math.PI / 5;
                const ax = fc.x + artifactR * Math.cos(angle);
                const ay = fc.y + artifactR * Math.sin(angle);
                return (
                  <g
                    key={artifact.path}
                    onClick={() => history.push(artifact.path)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      cx={ax} cy={ay} r={4}
                      fill={AIVERSE_FORGE.color}
                      opacity={0.65}
                      filter="url(#nodeGlow)"
                    />
                    <text
                      x={ax} y={ay - 8}
                      textAnchor="middle"
                      fill={AIVERSE_FORGE.color}
                      fontSize="7.5"
                      fontFamily="monospace"
                      opacity={0.60}
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {artifact.missions}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })()}

        {/* Era centers + post nodes */}
        {AIVERSE_ERAS.map((era) => {
          const c = toSVG(era.position.x, era.position.y);
          const eraR = 16;

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
              {/* Outer ring — star corona */}
              <circle
                cx={c.x} cy={c.y}
                r={eraR + 9}
                fill="none"
                stroke={era.color}
                strokeWidth="0.5"
                strokeOpacity={0.35}
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
                const pos = postSVGPos(era, i);
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
                    {/* Planet node — small circle */}
                    <circle
                      cx={pos.x} cy={pos.y}
                      r={isHovered ? 5.5 : 4}
                      fill={era.color}
                      opacity={isHovered ? 1 : 0.72}
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

      {/* Nebula lens popup */}
      {nebulaLens && (
        <div
          className={styles.lens}
          style={{
            '--lens-color': AIVERSE_NEBULA.color,
            '--lens-glow': AIVERSE_NEBULA.glowColor,
            left: `${(nebulaLens.svgX / W) * 100}%`,
            top: `${(nebulaLens.svgY / H) * 100}%`,
          } as React.CSSProperties}
          onClick={(e) => e.stopPropagation()}
        >
          <button className={styles.lensClose} onClick={() => setNebulaLens(null)}>×</button>
          <div className={styles.lensHeader}>
            <span className={styles.lensMissions}>standalone</span>
            <h3 className={styles.lensTitle}>{AIVERSE_NEBULA.label}</h3>
            <p className={styles.lensTagline}>{AIVERSE_NEBULA.tagline}</p>
          </div>
          <ul className={styles.lensPosts}>
            {AIVERSE_NEBULA.stars.map((star) => (
              <li key={star.path}>
                <button
                  className={styles.lensPostLink}
                  onClick={() => { history.push(star.path); setNebulaLens(null); }}
                >
                  <span className={styles.postMission}>{star.missions}</span>
                  <span className={styles.postTitle}>{star.title}</span>
                  <span className={styles.postSubtitle}>{star.subtitle}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Forge lens popup */}
      {forgeLens && (
        <div
          className={styles.lens}
          style={{
            '--lens-color': AIVERSE_FORGE.color,
            '--lens-glow': AIVERSE_FORGE.glowColor,
            left: `${(forgeLens.svgX / W) * 100}%`,
            top: `${(forgeLens.svgY / H) * 100}%`,
          } as React.CSSProperties}
          onClick={(e) => e.stopPropagation()}
        >
          <button className={styles.lensClose} onClick={() => setForgeLens(null)}>×</button>
          <div className={styles.lensHeader}>
            <span className={styles.lensMissions}>active builds</span>
            <h3 className={styles.lensTitle}>{AIVERSE_FORGE.label}</h3>
            <p className={styles.lensTagline}>{AIVERSE_FORGE.tagline}</p>
          </div>
          <ul className={styles.lensPosts}>
            {AIVERSE_FORGE.artifacts.map((artifact) => (
              <li key={artifact.path}>
                <button
                  className={styles.lensPostLink}
                  onClick={() => { history.push(artifact.path); setForgeLens(null); }}
                >
                  <span className={styles.postMission}>{artifact.missions}</span>
                  <span className={styles.postTitle}>{artifact.title}</span>
                  <span className={styles.postSubtitle}>{artifact.subtitle}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.legend}>
        <span className={styles.legendTitle}>AIVERSE COSMOS · CLICK AN ERA NODE TO EXPLORE · ✦ NEBULA · ⚒ FORGE</span>
      </div>
    </div>
  );
}
