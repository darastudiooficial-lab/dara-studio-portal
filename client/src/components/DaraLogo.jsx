import React, { useId } from 'react';

/**
 * Official DARA Studio geometric logo mark.
 * Faithful recreation of the brand identity:
 *   — Outer square frame with rounded corners
 *   — Stylized lowercase "d": vertical stem (right side) + open bowl (left arc)
 * Rendered with the official Purple → Magenta neon glass gradient.
 */
export default function DaraLogo({ size = 40, className = '' }) {
  // Stable ID so gradient refs don't flicker across re-renders
  const uid = useId().replace(/:/g, '');
  const gradId  = `dg-${uid}`;
  const glowId  = `dw-${uid}`;
  const shineId = `ds-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="DARA Studio Logo"
    >
      <defs>
        {/* Primary neon gradient — Purple → Magenta */}
        <linearGradient id={gradId} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#5B52E8" />
          <stop offset="50%"  stopColor="#5B52E8" />
          <stop offset="100%" stopColor="#5B52E8" />
        </linearGradient>

        {/* Highlight shine — simulates glass inner glow */}
        <linearGradient id={shineId} x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"    />
        </linearGradient>

        {/* Outer glow filter */}
        <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
          <feColorMatrix in="blur" type="matrix"
            values="1.2 0 0 0 0.4
                    0   0 0 0 0
                    0   0 1 0 0.6
                    0   0 0 1 0"
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Main symbol group with glow ── */}
      <g filter={`url(#${glowId})`}>

        {/* Outer square frame (rounded corners, like the brand mark) */}
        <rect
          x="7" y="7" width="86" height="86"
          rx="10" ry="10"
          stroke={`url(#${gradId})`}
          strokeWidth="5.5"
          fill="none"
        />

        {/* Glass shine on top edge of frame */}
        <rect
          x="7" y="7" width="86" height="43"
          rx="10" ry="10"
          fill={`url(#${shineId})`}
          opacity="0.4"
        />

        {/* Stylized "d" — vertical stem on the RIGHT side */}
        <line
          x1="66" y1="18"
          x2="66" y2="82"
          stroke={`url(#${gradId})`}
          strokeWidth="5.5"
          strokeLinecap="round"
        />

        {/*
          Stylized "d" — open bowl (arc from stem, sweeps left, back to stem)
          Mirrors the official brand: bowl starts ~38% from top, ends ~65% from top
        */}
        <path
          d={`M 66 37
             C 66 37, 58 26, 43 28
             C 28 30, 21 41, 21 51
             C 21 61, 28 73, 43 74
             C 58 75, 66 65, 66 65`}
          stroke={`url(#${gradId})`}
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
}
