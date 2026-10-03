import { StatusIconFrame, type IconBaseProps } from "./shared";

const R = 22;
const CIRC = 2 * Math.PI * R;

export function InfoIcon({
  label = "Information",
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
              ? "ls-status-draw 600ms cubic-bezier(0.65, 0, 0.45, 1) forwards, ls-status-float 3s 700ms ease-in-out infinite"
              : "none",
          }}
        />
        <g
          className="ls-status-anim"
          style={{
            opacity: animate ? 0 : 1,
            animation: animate
              ? "ls-status-pop 300ms 500ms ease-out forwards"
              : "none",
          }}
        >
          <circle cx="32" cy="22" r="2" fill="currentColor" />
          <line x1="32" y1="29" x2="32" y2="44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>
    </StatusIconFrame>
  );
}
