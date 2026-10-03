import * as React from "react";
import type { IllustrationCommonProps } from "@/config/illustration-layout";
import { SuccessIcon } from "./status-icons/success-icon";
import { ErrorIcon } from "./status-icons/error-icon";
import { WarningIcon } from "./status-icons/warning-icon";
import { InfoIcon } from "./status-icons/info-icon";
import { CriticalIcon } from "./status-icons/critical-icon";
import { CelebrateIcon } from "./status-icons/celebrate-icon";

export type StatusIconVariant =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "critical"
  | "celebrate";

export interface StatusIconIllustrationProps extends IllustrationCommonProps {
  /** Status variant hiển thị */
  variant: StatusIconVariant;
  /** Kích thước pixel (default 80). Caller wrap trong div có `text-*` class để currentColor đúng tone. */
  size?: number;
  /** Bật/tắt animation. Default true. Tự động tắt khi prefers-reduced-motion. */
  animate?: boolean;
}

/**
 * StatusIconIllustration — shared animated icon cho alert-dialog-status + status-dialog.
 *
 * ## Caller contract
 *
 * Component dùng `currentColor` cho mọi SVG stroke/fill → caller **PHẢI** wrap trong
 * div có Tailwind `text-*` class để tone đúng:
 *
 * ```tsx
 * <div className="text-emerald-600 dark:text-emerald-400">
 *   <StatusIconIllustration variant="success" />
 * </div>
 * ```
 *
 * Mapping tone theo status-dialog hiện tại:
 * - success: text-emerald-600 / dark:text-emerald-400
 * - error: text-red-600 / dark:text-red-400
 * - warning: text-amber-600 / dark:text-amber-400
 * - info: text-blue-600 / dark:text-blue-400
 * - critical: text-red-500 / dark:text-red-400
 * - celebrate: text-purple-600 / dark:text-purple-400
 *
 * ## Reduced motion
 *
 * Animation tự động tắt khi user bật OS reduced-motion setting.
 *
 * @example
 * <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
 *   <StatusIconIllustration variant="success" />
 * </div>
 */
export function StatusIconIllustration({
  variant,
  size = 80,
  sizeTier = "inline",
  label,
  className,
  animate = true,
}: StatusIconIllustrationProps): React.ReactElement {
  const shared = { size, sizeTier, label, className, animate };

  switch (variant) {
    case "success":
      return <SuccessIcon {...shared} />;
    case "error":
      return <ErrorIcon {...shared} />;
    case "warning":
      return <WarningIcon {...shared} />;
    case "info":
      return <InfoIcon {...shared} />;
    case "critical":
      return <CriticalIcon {...shared} />;
    case "celebrate":
      return <CelebrateIcon {...shared} />;
    default: {
      const _exhaustive: never = variant;
      throw new Error(`[StatusIconIllustration] Unknown variant: ${String(_exhaustive)}`);
    }
  }
}
