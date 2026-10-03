import type { IllustrationCommonProps } from "@/config/illustration-layout";
import { StoryIllustration } from "./story-illustration";

type ServerErrorIllustrationProps = IllustrationCommonProps & {
};

export function ServerErrorIllustration({
  label = "System error",
  className,
  size,
  sizeTier = "inline",
}: ServerErrorIllustrationProps) {
  return (
    <StoryIllustration label={label} className={className} size={size} sizeTier={sizeTier}>
      <style>{`
        .ls-500-float { animation: ls-500-float 3s ease-in-out infinite; }
        .ls-500-blink { animation: ls-500-blink 1.2s step-end infinite; }
        @keyframes ls-500-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes ls-500-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0.3; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ls-500-float, .ls-500-blink { animation: none !important; }
        }
      `}</style>
      <svg viewBox="0 0 500 500" className="h-full w-full" aria-hidden="true">
        <circle cx="250" cy="260" r="145" fill="#fef2f2" />
        <g className="ls-500-float">
          <rect x="130" y="160" width="240" height="170" rx="14" fill="#ffffff" stroke="#fca5a5" strokeWidth="4" />
          <rect x="150" y="180" width="200" height="120" rx="8" fill="#1e1b4b" />
          <text x="250" y="255" textAnchor="middle" fontSize="48" fontWeight="700" fill="#ef4444" fontFamily="monospace">
            500
          </text>
          <rect x="185" y="340" width="130" height="12" rx="6" fill="#d4d4d8" />
          <rect x="210" y="352" width="80" height="8" rx="4" fill="#a1a1aa" />
        </g>
        <circle cx="380" cy="140" r="10" fill="#f87171" className="ls-500-blink" />
        <circle cx="100" cy="320" r="8" fill="#fecaca" className="ls-500-blink" style={{ animationDelay: "0.4s" }} />
      </svg>
    </StoryIllustration>
  );
}
