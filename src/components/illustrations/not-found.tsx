import type { IllustrationCommonProps } from "@/config/illustration-layout";
import { StoryIllustration } from "./story-illustration";

type NotFoundIllustrationProps = IllustrationCommonProps & {
  showAttribution?: boolean;
  attributionText?: string;
};

/**
 * 404 / page-not-found illustration (Storyset-style flat SVG).
 * Replace inner SVG with a Storyset HTML export when customized.
 */
export function NotFoundIllustration({
  label = "Page not found",
  className,
  size,
  sizeTier = "inline",
  showAttribution = false,
  attributionText,
}: NotFoundIllustrationProps) {
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
        .ls-404-float {
          animation: ls-404-float 3.2s ease-in-out infinite;
        }
        .ls-404-wobble {
          animation: ls-404-wobble 2.8s ease-in-out infinite;
          transform-origin: 250px 210px;
        }
        .ls-404-blink {
          animation: ls-404-blink 4s ease-in-out infinite;
        }
        @keyframes ls-404-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes ls-404-wobble {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes ls-404-blink {
          0%, 90%, 100% { opacity: 1; }
          95% { opacity: 0.35; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ls-404-float,
          .ls-404-wobble,
          .ls-404-blink {
            animation: none !important;
          }
        }
      `}</style>
      <svg viewBox="0 0 500 500" className="h-full w-full" aria-hidden="true">
        <circle cx="250" cy="255" r="155" fill="#eef2ff" className="ls-404-blink" />

        {/* Ground path */}
        <path
          d="M80 360 Q180 330 250 350 T420 360 L420 390 L80 390 Z"
          fill="#e4e4e7"
        />
        <path
          d="M120 360 Q200 340 250 355 T380 365"
          fill="none"
          stroke="#d4d4d8"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="12 10"
        />

        {/* Sign post with 404 */}
        <g className="ls-404-wobble">
          <rect x="300" y="175" width="10" height="185" rx="5" fill="#a1a1aa" />
          <rect x="255" y="195" width="100" height="70" rx="12" fill="#6366f1" />
          <text
            x="305"
            y="242"
            textAnchor="middle"
            fontSize="34"
            fontWeight="700"
            fill="#ffffff"
            fontFamily="system-ui, sans-serif"
          >
            404
          </text>
        </g>

        {/* Lost character */}
        <g className="ls-404-float">
          <circle cx="175" cy="250" r="28" fill="#fde68a" />
          <circle cx="168" cy="245" r="4" fill="#3f3f46" />
          <circle cx="182" cy="245" r="4" fill="#3f3f46" />
          <path d="M165 258 Q175 265 185 258" fill="none" stroke="#3f3f46" strokeWidth="3" strokeLinecap="round" />
          <rect x="155" y="278" width="40" height="55" rx="12" fill="#818cf8" />
          <rect x="148" y="330" width="18" height="32" rx="8" fill="#4f46e5" />
          <rect x="184" y="330" width="18" height="32" rx="8" fill="#4f46e5" />
          {/* Shrug arms */}
          <path d="M155 295 Q130 275 145 265" fill="none" stroke="#fde68a" strokeWidth="10" strokeLinecap="round" />
          <path d="M195 295 Q220 275 205 265" fill="none" stroke="#fde68a" strokeWidth="10" strokeLinecap="round" />
        </g>

        {/* Question bubbles */}
        <g className="ls-404-float" style={{ animationDelay: "0.6s" }}>
          <circle cx="115" cy="190" r="22" fill="#ffffff" stroke="#c7d2fe" strokeWidth="3" />
          <text x="115" y="199" textAnchor="middle" fontSize="24" fontWeight="700" fill="#818cf8" fontFamily="system-ui, sans-serif">
            ?
          </text>
        </g>
        <g className="ls-404-float" style={{ animationDelay: "1.1s" }}>
          <circle cx="395" cy="130" r="16" fill="#e0e7ff" />
        </g>
        <g className="ls-404-float" style={{ animationDelay: "0.3s" }}>
          <circle cx="90" cy="300" r="10" fill="#c7d2fe" />
        </g>
      </svg>
    </StoryIllustration>
  );
}
