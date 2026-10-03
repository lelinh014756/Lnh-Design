import { cn } from "@/lib/utils";
import { memo } from "react";

// Sử dụng chung kiểu BadgeStatusType của dự án hoặc định nghĩa riêng
export type PingVariant = "success" | "warning" | "error" | "info" | "neutral";

interface PingIndicatorProps {
    variant?: PingVariant;
    /** Tùy chỉnh kích thước. Mặc định là h-2.5 w-2.5 */
    size?: string;
    text?: string;
    disabled?: boolean;
    className?: string;
}

// Ánh xạ dải màu: màu mờ cho hiệu ứng ping, màu đậm cho chấm cố định
const COLOR_MAP: Record<PingVariant, { ping: string; solid: string; text: string; }> = {
    success: { ping: "bg-emerald-400", solid: "bg-emerald-500", text: "text-emerald-600" },
    warning: { ping: "bg-amber-400", solid: "bg-amber-500", text: "text-amber-600" },
    error: { ping: "bg-destructive/75", solid: "bg-destructive", text: "text-destructive" }, // Tuân thủ CSS tokens của dự án
    info: { ping: "bg-blue-400", solid: "bg-blue-500", text: "text-blue-600" },
    neutral: { ping: "bg-slate-400", solid: "bg-slate-500", text: "text-slate-600" },
};

const PingIndicator = ({
    variant = "success",
    size = "h-2.5 w-2.5",
    text,
    disabled = false,
    className,
}: PingIndicatorProps) => {
    const colors = COLOR_MAP[variant];

    return (
        <div className="flex items-center gap-2">
              <span className={cn("relative flex gap-2 text-sm", size, className)}>
                {!disabled && <span
                    className={cn(
                        "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                        colors.ping
                    )}
                />}
                <span
                    className={cn(
                        "relative inline-flex rounded-full h-full w-full",
                        disabled ? "bg-muted-foreground/40" : colors.solid
                    )}
                />
            </span>
            {text && <span className={colors.text}>{text}</span>}
        </div>
      
    );
};
export default memo(PingIndicator);