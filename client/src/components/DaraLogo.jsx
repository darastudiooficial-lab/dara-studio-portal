import React, { useId } from 'react';

/**
 * Official DARA Studio geometric logo mark.
 * Faithful recreation of the brand identity:
 *   — Outer square frame with rounded corners
 *   — Stylized lowercase "d": vertical stem (right side) + open bowl (left arc)
 * Rendered with the official Purple → Magenta neon glass gradient.
 */
export default function DaraLogo({ size = 40, className = '', variant = 'horizontal' }) {
  // Select the appropriate logo based on variant
  let logoSrc = '/assets/logos/logo-horizontal.png';
  if (variant === 'stacked') {
    logoSrc = '/assets/logos/logo-stacked.png';
  } else if (variant === 'subtitle') {
    logoSrc = '/assets/logos/logo-horizontal-subtitle.png';
  }

  // Determine width based on variant to maintain aspect ratio
  // Standard horizontal logo is wider than it is tall
  const height = size;
  const width = variant === 'horizontal' || variant === 'subtitle' ? size * 3 : size;

  return (
    <img
      src={logoSrc}
      alt="DARA Studio Logo"
      className={className}
      style={{
        height: `${height}px`,
        width: 'auto',
        objectFit: 'contain',
        display: 'block'
      }}
    />
  );
}
