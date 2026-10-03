import type { IllustrationCommonProps } from "@/config/illustration-layout";
import { StoryIllustration } from "./story-illustration";

type LoadingDataIllustrationProps = IllustrationCommonProps & {
  showAttribution?: boolean;
  attributionText?: string;
};

/**
 * Animated loading illustration (Storyset-style flat SVG).
 * Replace inner SVG with a Storyset HTML export when you have a customized asset.
 */
export function LoadingDataIllustration({
  label = "Loading data",
  className,
  size,
  sizeTier = "inline",
  showAttribution = false,
  attributionText,
}: LoadingDataIllustrationProps) {
  return (
    <StoryIllustration
      label={label}
      className={className}
      size={size}
      sizeTier={sizeTier}
      showAttribution={showAttribution}
      attributionText={attributionText}
    >
      <style>{`
        .ls-loading-float {
          animation: ls-loading-float 3s ease-in-out infinite;
        }
        .ls-loading-pulse {
          animation: ls-loading-pulse 1.6s ease-in-out infinite;
        }
        .ls-loading-bar {
          transform-origin: left center;
          animation: ls-loading-bar 1.8s ease-in-out infinite;
        }
        .ls-loading-dot {
          animation: ls-loading-dot 1.2s ease-in-out infinite;
        }
        .ls-loading-dot:nth-child(2) { animation-delay: 0.15s; }
        .ls-loading-dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes ls-loading-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes ls-loading-pulse {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 1; }
        }
        @keyframes ls-loading-bar {
          0% { transform: scaleX(0.25); }
          50% { transform: scaleX(0.85); }
          100% { transform: scaleX(0.25); }
        }
        @keyframes ls-loading-dot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ls-loading-float,
          .ls-loading-pulse,
          .ls-loading-bar,
          .ls-loading-dot {
            animation: none !important;
          }
        }
      `}</style>
      <svg viewBox="0 0 500 500" className="h-full w-full" aria-hidden="true">
        {/* Background accent */}
        <circle cx="250" cy="260" r="160" fill="#eef2ff" className="ls-loading-pulse" />

        {/* Monitor */}
        <g className="ls-loading-float">
          <rect x="130" y="150" width="240" height="170" rx="16" fill="#ffffff" stroke="#c7d2fe" strokeWidth="4" />
          <rect x="150" y="170" width="200" height="120" rx="8" fill="#f4f4f5" />
          <rect x="165" y="190" width="120" height="10" rx="5" fill="#e4e4e7" />
          <rect x="165" y="215" width="170" height="8" rx="4" fill="#6366f1" className="ls-loading-bar" />
          <rect x="165" y="235" width="140" height="8" rx="4" fill="#a5b4fc" className="ls-loading-bar" style={{ animationDelay: "0.3s" }} />
          <rect x="165" y="255" width="100" height="8" rx="4" fill="#c7d2fe" className="ls-loading-bar" style={{ animationDelay: "0.6s" }} />
          <rect x="215" y="320" width="70" height="12" rx="6" fill="#d4d4d8" />
          <rect x="185" y="332" width="130" height="10" rx="5" fill="#a1a1aa" />
        </g>

        {/* Floating document */}
        <g className="ls-loading-float" style={{ animationDelay: "0.5s" }}>
          <rect x="340" y="120" width="70" height="90" rx="8" fill="#ffffff" stroke="#818cf8" strokeWidth="3" />
          <line x1="355" y1="145" x2="395" y2="145" stroke="#c7d2fe" strokeWidth="4" strokeLinecap="round" />
          <line x1="355" y1="165" x2="385" y2="165" stroke="#e0e7ff" strokeWidth="4" strokeLinecap="round" />
          <line x1="355" y1="185" x2="390" y2="185" stroke="#e0e7ff" strokeWidth="4" strokeLinecap="round" />
        </g>

        {/* Loading dots */}
        <g transform="translate(220, 400)">
          <circle cx="0" cy="0" r="8" fill="#6366f1" className="ls-loading-dot" />
          <circle cx="28" cy="0" r="8" fill="#818cf8" className="ls-loading-dot" />
          <circle cx="56" cy="0" r="8" fill="#a5b4fc" className="ls-loading-dot" />
        </g>

        {/* Decorative plant */}
        <g className="ls-loading-float" style={{ animationDelay: "1s" }}>
          <ellipse cx="95" cy="355" rx="35" ry="12" fill="#d4d4d8" />
          <path d="M95 355 Q85 300 95 260 Q105 300 95 355" fill="#4ade80" />
          <path d="M95 320 Q70 290 80 265 Q95 295 95 320" fill="#22c55e" />
          <path d="M95 320 Q120 290 110 265 Q95 295 95 320" fill="#16a34a" />
        </g>
      </svg>
    </StoryIllustration>
  );
}
