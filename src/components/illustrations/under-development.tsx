import type { IllustrationCommonProps } from "@/config/illustration-layout";
import { StoryIllustration } from "./story-illustration";

type UnderDevelopmentIllustrationProps = IllustrationCommonProps & {
};

export function UnderDevelopmentIllustration({
  label = "Under development",
  className,
  size,
  sizeTier = "inline",
}: UnderDevelopmentIllustrationProps) {
  return (
    <StoryIllustration label={label} className={className} size={size} sizeTier={sizeTier}>
      <style>{`
        .ls-dev-hammer { animation: ls-dev-hammer 1.5s ease-in-out infinite; transform-origin: 320px 200px; }
        .ls-dev-float { animation: ls-dev-float 3s ease-in-out infinite; }
        @keyframes ls-dev-hammer {
          0%, 100% { transform: rotate(-20deg); }
          50% { transform: rotate(10deg); }
        }
        @keyframes ls-dev-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ls-dev-hammer, .ls-dev-float { animation: none !important; }
        }
      `}</style>
      <svg viewBox="0 0 500 500" className="h-full w-full" aria-hidden="true">
        <circle cx="250" cy="260" r="140" fill="#fef3c7" />
        <g className="ls-dev-float">
          <rect x="150" y="280" width="200" height="20" rx="6" fill="#d4d4d8" />
          <rect x="170" y="250" width="30" height="50" rx="4" fill="#a1a1aa" />
          <rect x="300" y="250" width="30" height="50" rx="4" fill="#a1a1aa" />
          <rect x="160" y="200" width="180" height="55" rx="8" fill="#fde68a" stroke="#f59e0b" strokeWidth="3" />
          <line x1="175" y1="220" x2="325" y2="220" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 6" />
          <line x1="175" y1="240" x2="290" y2="240" stroke="#fcd34d" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 6" />
        </g>
        <g className="ls-dev-hammer">
          <rect x="300" y="155" width="70" height="18" rx="6" fill="#78716c" transform="rotate(30 335 164)" />
          <rect x="355" y="140" width="16" height="50" rx="4" fill="#a8a29e" transform="rotate(30 363 165)" />
        </g>
        <circle cx="120" cy="180" r="8" fill="#fbbf24" className="ls-dev-float" style={{ animationDelay: "0.5s" }} />
        <circle cx="390" cy="300" r="6" fill="#fcd34d" className="ls-dev-float" style={{ animationDelay: "1s" }} />
      </svg>
    </StoryIllustration>
  );
}
