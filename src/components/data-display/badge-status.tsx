import { memo, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import AppIcon, { IconName } from "@/components/general/app-icon";

import PingIndicator from "@/components/feedback/ping-indicator";

/**
 * BadgeStatus — Badge trạng thái nghiệp vụ đồng bộ trên toàn hệ thống.
 *
 *  ▸ Cách dùng khuyến nghị: truyền `status` là CODE khai báo trong `STATUS_CONFIG`
 *    → icon / color / label lấy tự động.
 *      ```tsx
 *      <BadgeStatus status="WEBHOOK_FAILED" />
 *      ```
 *
 *  ▸ Cách dùng freeform (không phải trạng thái nghiệp vụ):
 *      ```tsx
 *      <BadgeStatus variant="success">500.000 VNĐ</BadgeStatus>
 *      ```
 *
 *  ▸ Có thể override icon / label riêng lẻ:
 *      ```tsx
 *      <BadgeStatus status="MERCHANT_LOCKED" icon="lock" />
 *      ```
 */
export type BadgeStatusType = "info" | "warning" | "success" | "closed" | "reprocess" | "cancelled" | "error" | "neutral";

export interface StatusConfig {
    key: BadgeStatusType;
    icon: IconName;
    name: string;
}


/* ============================================================================
 * STATUS CONFIG — Nguồn sự thật DUY NHẤT cho toàn bộ badge trạng thái nghiệp vụ
 * ---------------------------------------------------------------------------
 *   • Mỗi entry được đánh khoá bằng `CODE` dạng chữ hoa (ví dụ: WEBHOOK_FAILED).
 *   • Icon, màu (key/variant) và label (name) đều khai báo tại đây một lần duy nhất.
 *   • Ở feature (transactions, wallets, webhooks…) chỉ giữ map nhỏ để dịch giá trị
 *     API (số / chuỗi thô) sang CODE, sau đó truyền vào `<BadgeStatus status={CODE} />`.
 * ==========================================================================*/

export const STATUS_CONFIG = {
    // ─── Chung ───────────────────────────────────────────────────────────────
    ACTIVE: {
        key: "success",
        icon: "dot" as IconName,
        name: "Đang hoạt động",
    },
    INACTIVE: {
        key: "neutral",
        icon: "dot" as IconName,
        name: "Ngừng hoạt động",
    },

    // ─── Tình trạng quỹ (wallets HEALTH_STATUS_MAP) ──────────────────────────
    HEALTH_GREEN: {
        key: "success",
        icon: "circle-check-big",
        name: "Tốt",
    },
    HEALTH_YELLOW: {
        key: "warning",
        icon: "circle-alert",
        name: "Cần chú ý",
    },
    HEALTH_RED: {
        key: "error",
        icon: "circle-alert",
        name: "Báo động",
    },
} as const satisfies Record<string, StatusConfig>;

export type StatusCode = keyof typeof STATUS_CONFIG;

/** Bảng class Tailwind cho từng tone của badge. */
export const BADGE_STATUS_CLASSES: Record<BadgeStatusType, string> = {
    success:
        "border-emerald-200 bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80",
    warning:
        "border-amber-200 bg-amber-100 text-amber-700 hover:bg-amber-100/80 animate-pulse",
    error: "border-rose-200 bg-rose-100 text-rose-700 hover:bg-rose-100/80",
    info: "border-blue-200 bg-blue-100 text-blue-700 hover:bg-blue-100/80",
    neutral:
        "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-100/80",
    closed:
        "border-slate-300 bg-slate-200 text-slate-800 hover:bg-slate-200/80",
    reprocess:
        "border-indigo-200 bg-indigo-100 text-indigo-700 hover:bg-indigo-100/80 animate-pulse",
    cancelled:
        "border-rose-200 bg-rose-100 text-rose-700 hover:bg-rose-100/80",
};

const FALLBACK_CONFIG: StatusConfig = {
    key: "neutral",
    icon: "circle-help" as IconName,
    name: "—",
};

/** Tra cứu StatusConfig an toàn: trả FALLBACK khi code không hợp lệ. */
export function getStatusConfig(code?: string | null): StatusConfig {
    if (!code) return FALLBACK_CONFIG;
    return (
        (STATUS_CONFIG as Record<string, StatusConfig>)[code] ?? FALLBACK_CONFIG
    );
}

/** Shortcut: lấy label hiển thị của một code (dùng cho export Excel, preview filter…). */
export function getStatusName(code?: string | null): string {
    return getStatusConfig(code).name;
}

interface BadgeStatusProps {
    /** Mã trạng thái tra cứu từ STATUS_CONFIG. */
    status?: StatusCode;
    /** Ghi đè tone màu (khi không dùng `status`, hoặc muốn override). */
    variant?: BadgeStatusType;
    /** Ghi đè icon hiển thị. */
    icon?: IconName | "dot";
    /** Ẩn hoàn toàn icon dù config có sẵn. */
    hideIcon?: boolean;
    /** Ghi đè label; nếu không truyền sẽ lấy `name` từ STATUS_CONFIG. */
    children?: ReactNode;
    className?: string;
    iconSize?: number;
}

const BadgeStatus = ({
    status,
    variant,
    icon,
    hideIcon = false,
    children,
    className,
    iconSize = 13,
}: BadgeStatusProps) => {
    const config = status ? STATUS_CONFIG[status] : undefined;

    const tone: BadgeStatusType = variant ?? config?.key ?? "neutral";
    const displayIcon: IconName | "dot" | undefined = hideIcon
        ? undefined
        : (icon ?? config?.icon as any);
    const displayLabel: ReactNode = children ?? config?.name ?? "—";

    const isDot = displayIcon === "dot" || status === "ACTIVE" || status === "INACTIVE";

    let pingVariant: "success" | "warning" | "error" | "info" | "neutral" = "neutral";
    if (["success", "warning", "error", "info", "neutral"].includes(tone as string)) {
        pingVariant = tone as any;
    } else if (tone === "cancelled") {
        pingVariant = "error";
    }

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-[1px] text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-none",
                BADGE_STATUS_CLASSES[tone],
                className,
            )}
        >
            {isDot && !hideIcon ? (
                <PingIndicator
                    variant={pingVariant}
                    size="h-2 w-2"
                    disabled={status === "INACTIVE" || tone === "neutral" || tone === "closed"}
                />
            ) : (displayIcon && displayIcon !== "dot") ? (
                <AppIcon
                    icon={displayIcon as IconName}
                    size={iconSize}
                    strokeWidth={2.5}
                />
            ) : null}
            {displayLabel}
        </span>
    );
};

export default memo(BadgeStatus);
export type { BadgeStatusProps };
