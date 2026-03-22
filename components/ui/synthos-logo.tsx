interface SynthosLogoProps {
  size?: number;
  className?: string;
}

export function SynthosLogo({ size = 32, className }: SynthosLogoProps) {
  const id = "sl";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id={`${id}-arc`} x1="6" y1="6" x2="26" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#c4b5fd" stopOpacity="0.7" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background rounded square */}
      <rect width="32" height="32" rx="8" fill={`url(#${id}-bg)`} />

      {/* Synthesis mark: S-curve with three node points */}
      {/* Top arc: from top-left to center */}
      <path
        d="M8 12 C8 7 13 6 16 9 C19 12 24 11 24 8"
        stroke={`url(#${id}-arc)`}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        filter={`url(#${id}-glow)`}
      />
      {/* Bottom arc: from center to bottom-right */}
      <path
        d="M8 24 C8 21 13 20 16 23 C19 26 24 25 24 20"
        stroke={`url(#${id}-arc)`}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        filter={`url(#${id}-glow)`}
        strokeOpacity="0.7"
      />
      {/* Center connecting spine */}
      <path
        d="M16 9 C14 11 14 13 16 16 C18 19 18 21 16 23"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        strokeOpacity="0.6"
      />

      {/* Node dots */}
      <circle cx="8" cy="12" r="2" fill="white" filter={`url(#${id}-glow)`} />
      <circle cx="24" cy="8" r="1.5" fill="white" fillOpacity="0.8" />
      <circle cx="16" cy="16" r="2.5" fill="white" filter={`url(#${id}-glow)`} />
      <circle cx="8" cy="24" r="1.5" fill="white" fillOpacity="0.8" />
      <circle cx="24" cy="20" r="2" fill="white" filter={`url(#${id}-glow)`} />
    </svg>
  );
}
