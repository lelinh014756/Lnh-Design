import type { IllustrationCommonProps } from "@/config/illustration-layout";
import { StoryIllustration } from "./story-illustration";

type EmptyListIllustrationProps = IllustrationCommonProps & {
};

export function EmptyListIllustration({
  label = "No data",
  className,
  size,
  sizeTier = "inline",
}: EmptyListIllustrationProps) {
  return (
    <StoryIllustration label={label} className={className} size={size} sizeTier={sizeTier}>
      <style>{`
        .ls-empty-list-float { animation: ls-empty-list-float 3.5s ease-in-out infinite; }
        @keyframes ls-empty-list-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ls-empty-list-float { animation: none !important; }
        }
      `}</style>
      <svg viewBox="0 0 500 500" className="h-full w-full" aria-hidden="true">
        <circle cx="250" cy="260" r="130" fill="#f4f4f5" />
        <g className="ls-empty-list-float">
          <rect x="140" y="175" width="220" height="180" rx="12" fill="#ffffff" stroke="#e4e4e7" strokeWidth="4" />
          <line x1="170" y1="220" x2="330" y2="220" stroke="#e4e4e7" strokeWidth="8" strokeLinecap="round" />
          <line x1="170" y1="260" x2="300" y2="260" stroke="#f4f4f5" strokeWidth="8" strokeLinecap="round" />
          <line x1="170" y1="300" x2="280" y2="300" stroke="#f4f4f5" strokeWidth="8" strokeLinecap="round" />
          <circle cx="320" cy="330" r="28" fill="#eef2ff" stroke="#c7d2fe" strokeWidth="3" />
          <line x1="308" y1="330" x2="332" y2="330" stroke="#818cf8" strokeWidth="4" strokeLinecap="round" />
          <line x1="320" y1="318" x2="320" y2="342" stroke="#818cf8" strokeWidth="4" strokeLinecap="round" />
        </g>
      </svg>
    </StoryIllustration>
  );
}
