import { StatusIconFrame, type IconBaseProps } from "./shared";

const R = 22;
const CIRC = 2 * Math.PI * R;
const RING_R = 30; // vòng ring ngoài severity indicator

export function CriticalIcon({
  label = "Critical error",
  size,
  sizeTier,
  className,
  animate = true,
}: IconBaseProps) {
  return (
    <StatusIconFrame label={label} size={size} sizeTier={sizeTier} className={className}>
      <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
        {/* Severity ring — pulse liên tục */}
        <circle
          cx="32"
          cy="32"
          r={RING_R}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity={animate ? 0 : 0.3}
          className="ls-status-anim"
          style={{
            animation: animate ? "ls-status-pulse 2.4s ease-in-out infinite" : "none",
          }}
        />
        {/* Inner circle (error style) */}
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
        {/* X mark */}
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
