import * as React from "react";
import { StatusIconFrame, type IconBaseProps } from "./shared";

const R = 22;
const CIRC = 2 * Math.PI * R;

interface Particle {
  cx: number;
  cy: number;
  r: number;
  color: string;
  x: number;
  y: number;
  r2: number;
  delay: number;
}

// 14 particle, 4 màu tone-of-purple (sẽ dùng currentColor làm default).
// Khi không override → tất cả dùng currentColor (purple-600 mặc định theo caller wrap)
const PARTICLES: Particle[] = [
  { cx: 32, cy: 32, r: 3, color: "currentColor", x: -28, y: -22, r2: 180, delay: 200 },
  { cx: 32, cy: 32, r: 4, color: "currentColor", x: 30, y: -18, r2: -200, delay: 250 },
  { cx: 32, cy: 32, r: 3, color: "currentColor", x: -22, y: 26, r2: 220, delay: 300 },
  { cx: 32, cy: 32, r: 5, color: "currentColor", x: 26, y: 24, r2: -180, delay: 350 },
  { cx: 32, cy: 32, r: 2, color: "currentColor", x: 0, y: -32, r2: 90, delay: 200 },
  { cx: 32, cy: 32, r: 3, color: "currentColor", x: 0, y: 32, r2: -120, delay: 300 },
  { cx: 32, cy: 32, r: 2, color: "currentColor", x: -34, y: 4, r2: 270, delay: 250 },
  { cx: 32, cy: 32, r: 3, color: "currentColor", x: 34, y: -2, r2: -270, delay: 350 },
  { cx: 32, cy: 32, r: 2, color: "currentColor", x: -16, y: -32, r2: 150, delay: 400 },
  { cx: 32, cy: 32, r: 4, color: "currentColor", x: 16, y: -30, r2: -150, delay: 450 },
  { cx: 32, cy: 32, r: 3, color: "currentColor", x: -18, y: 30, r2: 200, delay: 400 },
  { cx: 32, cy: 32, r: 2, color: "currentColor", x: 18, y: 28, r2: -220, delay: 450 },
  { cx: 32, cy: 32, r: 3, color: "currentColor", x: -8, y: -36, r2: 100, delay: 500 },
  { cx: 32, cy: 32, r: 3, color: "currentColor", x: 8, y: 36, r2: -100, delay: 500 },
];

export function CelebrateIcon({
  label = "Success celebration",
  size,
  sizeTier,
  className,
  animate = true,
}: IconBaseProps) {
  return (
    <StatusIconFrame label={label} size={size} sizeTier={sizeTier} className={className}>
      <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
        {/* Success circle */}
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

        {/* Confetti particles */}
        <g style={{ opacity: animate ? 1 : 0 }}>
          {PARTICLES.map((p, i) => (
            <circle
              key={i}
              cx={p.cx}
              cy={p.cy}
              r={p.r}
              fill={p.color}
              className="ls-status-anim"
              style={
                {
                  animation: animate
                    ? `ls-status-confetti 1200ms ${p.delay}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`
                    : "none",
                  ["--x"]: `${p.x}px`,
                  ["--y"]: `${p.y}px`,
                  ["--r"]: `${p.r2}deg`,
                } as React.CSSProperties
              }
            />
          ))}
        </g>
      </svg>
    </StatusIconFrame>
  );
}
