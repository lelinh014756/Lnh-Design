"use client";

import { memo } from "react";
import AppIcon from "@/components/general/app-icon";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SIDEBAR_STYLES, SIDEBAR_STYLE_OPTIONS } from "@/config/appearance";
import { cn } from "@/lib/utils";
import { useAppearanceStore } from "@/store/appearance-store";

/**
 * Ô xem trước kiểu sidebar.
 *
 * Không tô màu tay trong TSX — đặt `data-sidebar-style` ngay trên chính ô
 * xem trước để CSS trong `globals.css` tự áp đúng token, một nguồn màu duy
 * nhất giữa preview và sidebar thật. `data-sidebar-preview` là kênh riêng cho
 * những thứ chỉ preview mới cần (nền gradient, độ nổi của chấm).
 */
function SidebarStyleSwatch({ style }: { style: (typeof SIDEBAR_STYLES)[number] }) {
  return (
    <span
      data-sidebar-style={style}
      data-sidebar-preview={style}
      className="relative block h-8 w-11 shrink-0 overflow-hidden rounded-md border border-border bg-sidebar"
    >
      {/* Viền mờ cố định để chấm vẫn thấy được ở kiểu "tint" (chấm gần trắng trên nền gần trắng). */}
      <span className="absolute bottom-1.5 left-1.5 h-1.5 w-4 rounded-full bg-sidebar-primary ring-1 ring-black/10" />
    </span>
  );
}

/**
 * Nhãn cho từng kiểu nền. Khoá trùng `labelKey`/`descriptionKey` khai trong
 * `SIDEBAR_STYLE_OPTIONS`.
 *
 * Mặc định tiếng Anh gắn sẵn — component đi qua registry nên không được đòi
 * repo cài về phải có từ điển.
 */
export type SidebarStyleLabels = Record<string, string>;

const DEFAULT_LABELS: SidebarStyleLabels = {
  sidebarStyleDefault: "Default",
  sidebarStyleDefaultHint: "Current surface, follows light/dark",
  sidebarStyleSolid: "Solid",
  sidebarStyleSolidHint: "Solid ink, fixed across themes",
  sidebarStyleGradient: "Brand gradient",
  sidebarStyleGradientHint: "Diagonal ramp from the brand color",
  sidebarStyleTint: "Brand tint",
  sidebarStyleTintHint: "Surface diluted from the brand color",
};

export const SidebarStylePicker = memo(function SidebarStylePicker({
  labels: t = DEFAULT_LABELS,
}: {
  labels?: SidebarStyleLabels;
} = {}) {
  const sidebarStyle = useAppearanceStore((s) => s.sidebarStyle);
  const setSidebarStyle = useAppearanceStore((s) => s.setSidebarStyle);

  return (
    <div className="flex flex-wrap gap-1.5 p-1">
      {SIDEBAR_STYLES.map((style) => {
        const isActive = style === sidebarStyle;
        const option = SIDEBAR_STYLE_OPTIONS[style];
        const label = t[option.labelKey] ?? style;

        return (
          <Tooltip key={style}>
            <TooltipTrigger asChild>
            <button
                type="button"
                aria-label={label}
                aria-pressed={isActive}
                onClick={() => setSidebarStyle(style)}
                className={cn(
                  "relative rounded-lg p-0.5 outline-none transition-colors duration-150",
                  isActive
                    ? "ring-2 ring-primary ring-offset-1 ring-offset-background"
                    : "hover:bg-accent",
                )}
              >
                <SidebarStyleSwatch style={style} />
                {isActive && (
                  <AppIcon icon="check"
                    className="absolute top-1/2 left-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 text-sidebar-primary-foreground"
                    strokeWidth={3}
                  />
                )}
            </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="font-medium">{label}</p>
              <p className="text-muted-foreground">{t[option.descriptionKey] ?? ""}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
});
