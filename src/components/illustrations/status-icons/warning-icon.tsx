import { StatusIconFrame, type IconBaseProps } from "./shared";

export function WarningIcon({
  label = "Warning",
  size,
  sizeTier,
  className,
  animate = true,
}: IconBaseProps) {
  return (
    <StatusIconFrame label={label} size={size} sizeTier={sizeTier} className={className}>
      <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
        {/* Triangle scale-in elastic */}
        <g
          className="ls-status-anim"
          style={{
            transformOrigin: "32px 32px",
            animation: animate
              ? "ls-status-elastic 800ms cubic-bezier(0.34, 1.56, 0.64, 1)"
              : "none",
          }}
        >
          <path
            d="M32 14 L54 48 L10 48 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </g>
        {/* Exclamation: vertical line + dot, fade-in sau 500ms */}
        <g
          className="ls-status-anim"
          style={{
            opacity: animate ? 0 : 1,
            animation: animate
              ? "ls-status-pop 300ms 500ms ease-out forwards"
              : "none",
          }}
        >
          <line x1="32" y1="26" x2="32" y2="38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <circle cx="32" cy="43" r="2" fill="currentColor" />
        </g>
      </svg>
    </StatusIconFrame>
  );
}
