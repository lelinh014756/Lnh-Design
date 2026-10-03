import { StatusIconFrame, type IconBaseProps } from "./shared";

const R = 22;
const CIRC = 2 * Math.PI * R;

export function ErrorIcon({
  label = "Error",
  size,
  sizeTier,
  className,
  animate = true,
}: IconBaseProps) {
  return (
    <StatusIconFrame label={label} size={size} sizeTier={sizeTier} className={className}>
      <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
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
        {/* X mark — 2 đường chéo, dùng ls-status-pop với elastic-feel */}
        <g
          className="ls-status-anim"
          style={{
            transformOrigin: "32px 32px",
            animation: animate
              ? "ls-status-pop 500ms 350ms cubic-bezier(0.34, 1.56, 0.64, 1) backwards"
              : "none",
          }}
        >
          <line x1="24" y1="24" x2="40" y2="40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <line x1="40" y1="24" x2="24" y2="40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>
    </StatusIconFrame>
  );
}
