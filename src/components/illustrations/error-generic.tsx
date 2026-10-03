import type { IllustrationCommonProps } from "@/config/illustration-layout";
import { StoryIllustration } from "./story-illustration";

type ErrorGenericIllustrationProps = IllustrationCommonProps & {
};

export function ErrorGenericIllustration({
  label = "An error occurred",
  className,
  size,
  sizeTier = "inline",
}: ErrorGenericIllustrationProps) {
  return (
    <StoryIllustration label={label} className={className} size={size} sizeTier={sizeTier}>
      <style>{`
        .ls-error-shake {
          animation: ls-error-shake 2.5s ease-in-out infinite;
          transform-origin: 250px 220px;
        }
        .ls-error-pulse {
          animation: ls-error-pulse 1.8s ease-in-out infinite;
        }
        @keyframes ls-error-shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-2deg); }
          75% { transform: rotate(2deg); }
        }
        @keyframes ls-error-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ls-error-shake, .ls-error-pulse { animation: none !important; }
        }
      `}</style>
      <svg viewBox="0 0 500 500" className="h-full w-full" aria-hidden="true">
        <circle cx="250" cy="255" r="150" fill="#fffbeb" className="ls-error-pulse" />
        <g className="ls-error-shake">
          <rect x="155" y="170" width="190" height="140" rx="16" fill="#ffffff" stroke="#fcd34d" strokeWidth="4" />
          <rect x="175" y="195" width="150" height="90" rx="8" fill="#fef3c7" />
          <circle cx="225" cy="235" r="14" fill="#f59e0b" />
          <rect x="218" y="228" width="14" height="28" rx="4" fill="#ffffff" />
          <circle cx="275" cy="235" r="14" fill="#f59e0b" />
          <rect x="268" y="228" width="14" height="28" rx="4" fill="#ffffff" />
          <path d="M210 275 Q250 295 290 275" fill="none" stroke="#d97706" strokeWidth="5" strokeLinecap="round" />
        </g>
        <g className="ls-error-pulse">
          <path d="M120 150 L145 175 M145 150 L120 175" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
          <path d="M355 130 L375 150 M375 130 L355 150" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />
        </g>
      </svg>
    </StoryIllustration>
  );
}
