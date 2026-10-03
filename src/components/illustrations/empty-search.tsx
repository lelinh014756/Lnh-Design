import type { IllustrationCommonProps } from "@/config/illustration-layout";
import { StoryIllustration } from "./story-illustration";

type EmptySearchIllustrationProps = IllustrationCommonProps & {
  showAttribution?: boolean;
  attributionText?: string;
};

/**
 * Empty / no-results illustration (Storyset-style flat SVG).
 * Replace inner SVG with a Storyset HTML export when you have a customized asset.
 */
export function EmptySearchIllustration({
  label = "No results found",
  className,
  size,
  sizeTier = "inline",
  showAttribution = false,
  attributionText,
}: EmptySearchIllustrationProps) {
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
        .ls-empty-float {
          animation: ls-empty-float 3.5s ease-in-out infinite;
        }
        .ls-empty-search {
          animation: ls-empty-search 2.5s ease-in-out infinite;
          transform-origin: 280px 200px;
        }
        @keyframes ls-empty-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes ls-empty-search {
          0%, 100% { transform: rotate(-4deg) translate(0, 0); }
          50% { transform: rotate(4deg) translate(4px, -4px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ls-empty-float,
          .ls-empty-search {
            animation: none !important;
          }
        }
      `}</style>
      <svg viewBox="0 0 500 500" className="h-full w-full" aria-hidden="true">
        <circle cx="250" cy="260" r="140" fill="#f4f4f5" />

        {/* Empty folder */}
        <g className="ls-empty-float">
          <path
            d="M140 280 L140 360 Q140 375 155 375 L345 375 Q360 375 360 360 L360 295 Q360 280 345 280 L220 280 L200 255 L155 255 Q140 255 140 270 Z"
            fill="#ffffff"
            stroke="#d4d4d8"
            strokeWidth="4"
          />
          <line x1="180" y1="320" x2="320" y2="320" stroke="#e4e4e7" strokeWidth="6" strokeLinecap="round" />
          <line x1="180" y1="345" x2="280" y2="345" stroke="#f4f4f5" strokeWidth="6" strokeLinecap="round" />
        </g>

        {/* Magnifying glass */}
        <g className="ls-empty-search">
          <circle cx="280" cy="200" r="55" fill="none" stroke="#6366f1" strokeWidth="10" />
          <circle cx="280" cy="200" r="38" fill="#eef2ff" />
          <line x1="320" y1="240" x2="365" y2="285" stroke="#6366f1" strokeWidth="12" strokeLinecap="round" />
          {/* Question mark inside lens */}
          <text x="280" y="212" textAnchor="middle" fontSize="42" fontWeight="600" fill="#818cf8" fontFamily="system-ui, sans-serif">
            ?
          </text>
        </g>

        {/* Small decorative elements */}
        <circle cx="120" cy="180" r="6" fill="#c7d2fe" className="ls-empty-float" style={{ animationDelay: "0.4s" }} />
        <circle cx="390" cy="160" r="8" fill="#e0e7ff" className="ls-empty-float" style={{ animationDelay: "0.8s" }} />
        <circle cx="400" cy="340" r="5" fill="#a5b4fc" className="ls-empty-float" style={{ animationDelay: "1.2s" }} />
      </svg>
    </StoryIllustration>
  );
}
