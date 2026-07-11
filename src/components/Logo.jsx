import React from 'react';

export default function Logo({ size = 'medium', className = '', showText = true }) {
  // Brand color as requested (deep navy blue of PARKEE)
  const brandColor = '#0b2e5c';

  // Base dimensions inside SVG viewBox="0 0 200 150"
  let width = 160;
  if (size === 'large') {
    width = 240;
  } else if (size === 'small') {
    width = 100;
  }

  return (
    <div className={`parkee-logo ${size} ${className}`} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg
        width={width}
        height={width * 0.75}
        viewBox="0 0 200 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Layer 1: Blue Outer Circle (Head of 'P') */}
        <circle cx="100" cy="55" r="40" fill={brandColor} />

        {/* Layer 2: Blue Stem of 'P' (with a rounded cap at the bottom) */}
        {/* Goes from x=60 to x=80, down to y=110, Q curves around y=120 */}
        <path
          d="M 60 55 L 60 108 Q 60 118 70 118 Q 80 118 80 108 L 80 55 Z"
          fill={brandColor}
        />

        {/* Layer 3: White Location Map-Pin inside */}
        {/* Teardrop map pin pointing downwards, center (100,55) */}
        <path
          d="M 100 80 L 87.5 68 A 18 18 0 1 1 112.5 68 Z"
          fill="#FFFFFF"
        />

        {/* Layer 4: Blue Inner Dot inside the White Pin */}
        <circle cx="100" cy="55" r="6" fill={brandColor} />

        {/* Layer 5: Typography Text "PARKEE" */}
        {showText && (
          <text
            x="100"
            y="142"
            textAnchor="middle"
            fill={brandColor}
            style={{
              fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
              fontWeight: '700',
              fontSize: '26px',
              letterSpacing: '1.2px',
            }}
          >
            PARKEE
          </text>
        )}
      </svg>
    </div>
  );
}
