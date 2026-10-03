import { StatusIconFrame, type IconBaseProps } from "./shared";

const R = 22;
const CIRC = 2 * Math.PI * R; // ~138.23

export function SuccessIcon({
  label = "Success",
  size,
  sizeTier,
  className,
  animate = true,
}: IconBaseProps) {
  return (
    <StatusIconFrame label={label} size={size} sizeTier={sizeTier} className={className}>
      <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
        {/* Circle stroke draw-on */}
        <circle
          cx="32"
          cy="32"
          r={R}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={animate ? CIRC : 0}
          className="ls-status-anim"
          style={{
            animation: animate
              ? "ls-status-draw 600ms cubic-bezier(0.65, 0, 0.45, 1) forwards"
              : "none",
          }}
        />
        {/* Check mark draw-on, delay 400ms */}
        <path
          d="M22 33 L29 40 L42 26"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={32}
          strokeDashoffset={animate ? 32 : 0}
          className="ls-status-anim"
          style={{
            animation: animate
              ? "ls-status-draw 400ms 400ms cubic-bezier(0.65, 0, 0.45, 1) forwards"
              : "none",
          }}
        />
      </svg>
    </StatusIconFrame>
  );
}
