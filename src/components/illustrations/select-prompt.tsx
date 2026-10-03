import type { IllustrationCommonProps } from "@/config/illustration-layout";
import { StoryIllustration } from "./story-illustration";

type SelectPromptIllustrationProps = IllustrationCommonProps & {
};

export function SelectPromptIllustration({
  label = "Select an item",
  className,
  size,
  sizeTier = "inline",
}: SelectPromptIllustrationProps) {
  return (
    <StoryIllustration label={label} className={className} size={size} sizeTier={sizeTier}>
      <style>{`
        .ls-select-bounce { animation: ls-select-bounce 2s ease-in-out infinite; }
        .ls-select-pointer { animation: ls-select-pointer 2s ease-in-out infinite; }
        @keyframes ls-select-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes ls-select-pointer {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(4px, 4px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ls-select-bounce, .ls-select-pointer { animation: none !important; }
        }
      `}</style>
      <svg viewBox="0 0 500 500" className="h-full w-full" aria-hidden="true">
        <circle cx="250" cy="260" r="130" fill="#eef2ff" />
        <g className="ls-select-bounce">
          <rect x="155" y="170" width="190" height="50" rx="10" fill="#ffffff" stroke="#c7d2fe" strokeWidth="3" />
          <rect x="155" y="235" width="190" height="50" rx="10" fill="#6366f1" stroke="#4f46e5" strokeWidth="3" />
          <rect x="155" y="300" width="190" height="50" rx="10" fill="#ffffff" stroke="#e4e4e7" strokeWidth="3" />
          <polyline points="310,255 325,270 310,285" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g className="ls-select-pointer">
          <path d="M330 310 L330 350 L345 335 Z" fill="#818cf8" />
        </g>
      </svg>
    </StoryIllustration>
  );
}
