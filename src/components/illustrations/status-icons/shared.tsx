import * as React from "react";
import { cn } from "@/lib/utils";
import { StoryIllustration } from "../story-illustration";
import type { IllustrationCommonProps } from "@/config/illustration-layout";

/** Internal sub-component props */
export type IconBaseProps = IllustrationCommonProps & {
  /** Default true — animation tự tắt khi prefers-reduced-motion */
  animate?: boolean;
};

/** CSS keyframes + reduced-motion guard. Inline <style> để Tailwind không purge. */
export const STATUS_ICON_CSS = `
  @keyframes ls-status-draw {
    from { stroke-dashoffset: var(--ls-circumference, 200); }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes ls-status-pop {
    0%   { transform: scale(0.4); opacity: 0; }
    60%  { transform: scale(1.15); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes ls-status-elastic {
    0%   { transform: scale(0); }
    55%  { transform: scale(1.25); }
    75%  { transform: scale(0.9); }
    100% { transform: scale(1); }
  }
  @keyframes ls-status-float {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-3px); }
  }
  @keyframes ls-status-pulse {
    0%, 100% { opacity: 0.25; transform: scale(1); }
    50%      { opacity: 0.5;  transform: scale(1.08); }
  }
  @keyframes ls-status-confetti {
    0% {
      transform: translate(0, 0) rotate(0deg);
      opacity: 1;
    }
    70% {
      opacity: 1;
    }
    100% {
      transform: translate(var(--x, 0), var(--y, 0)) rotate(var(--r, 0deg));
      opacity: 0;
    }
  }
  .ls-status-anim {
    transform-box: fill-box;
    transform-origin: center;
  }
  @media (prefers-reduced-motion: reduce) {
    .ls-status-anim { animation: none !important; }
  }
`;

export interface StatusIconFrameProps extends IllustrationCommonProps {
  children: React.ReactNode;
}

export function StatusIconFrame({
  children,
  label = "Status icon",
  size,
  sizeTier = "inline",
  className,
}: StatusIconFrameProps) {
  return (
    <StoryIllustration label={label} size={size} sizeTier={sizeTier} className={cn("ls-status-icon", className)}>
      <style>{STATUS_ICON_CSS}</style>
      {children}
    </StoryIllustration>
  );
}
