import { memo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import AppButton from "@/components/general/app-button";
import AppIcon from "@/components/general/app-icon";
import { Separator } from "@/components/ui/separator";
import { AppTooltip } from "@/components/data-display/app-tooltip";

// ─── Types ───────────────────────────────────────────────────────────────────

export type AppSheetPlacement = "left" | "right";

// ─── Variant mapping ────────────────────────────────────────────────────────

const VARIANT_CLASSES = {
  contained: "sm:max-w-md data-[side=right]:sm:max-w-md",
  narrow: "sm:max-w-sm data-[side=right]:sm:max-w-sm",
  wide: "sm:max-w-2xl data-[side=right]:sm:max-w-2xl",
  full: "w-full data-[side=right]:w-full sm:max-w-none data-[side=right]:sm:max-w-none",
} as const;

/**
 * `contained` — mặc định, max-width content column (28rem), dùng cho form/detail rail thông thường.
 * `narrow` — rail gọn cho filter/quick-view (24rem).
 * `wide` — rail rộng hơn cho form nhiều section (42rem).
 * `full` — sheet chiếm toàn bộ chiều rộng, không giới hạn max-width (full-screen takeover).
 */
export type AppSheetVariant = keyof typeof VARIANT_CLASSES;

export interface AppSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // Header
  title?: ReactNode;
  description?: ReactNode;

  // Body
  children?: ReactNode;
  bodyClassName?: string;

  // Footer — custom override hoặc dùng default Cancel + Submit
  footer?: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  isSubmitDisabled?: boolean;
  isSubmitting?: boolean;
  submittingText?: string;
  hideFooter?: boolean;
  extraRight?: ReactNode;

  // Placement toggle
  defaultPlacement?: AppSheetPlacement;
  showPlacementToggle?: boolean;

  /** Kích thước sheet: `contained` (default) | `narrow` | `wide` | `full`. */
  variant?: AppSheetVariant;

  className?: string;
}

/**
 * AppSheet — Custom Sheet component wrap `ui/sheet.tsx`.
 * Hỗ trợ toggle placement (left/right), variant kích thước (contained/narrow/wide/full),
 * footer mặc định Cancel + Submit.
 *
 * Note: Component này không persist placement sang sessionStorage (khác AppResizeSheet).
 * Nếu cần persist, dùng AppResizeSheet.
 */
const AppSheet = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  bodyClassName,
  footer,
  submitLabel = "Xác nhận",
  cancelLabel = "Hủy bỏ",
  onSubmit,
  onCancel,
  isSubmitDisabled = false,
  isSubmitting = false,
  submittingText = "Đang xử lý...",
  hideFooter = false,
  defaultPlacement = "right",
  showPlacementToggle = true,
  variant = "contained",
  extraRight,
  className,
}: AppSheetProps) => {
  const [placement, setPlacement] = useState<AppSheetPlacement>(defaultPlacement);

  const togglePlacement = () =>
    setPlacement((prev) => (prev === "right" ? "left" : "right"));

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const defaultFooter = (
    <>
      <AppButton variant="ghost" onClick={handleCancel} disabled={isSubmitting}>
        {cancelLabel}
      </AppButton>
      <AppButton
        onClick={onSubmit}
        disabled={isSubmitDisabled || isSubmitting}
        loading={isSubmitting}
        loadingText={submittingText}
      >
        {submitLabel}
      </AppButton>
    </>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={placement}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={cn(
          "flex flex-col p-0 gap-0",
          VARIANT_CLASSES[variant],
          className,
        )}
      >
        {/* Header */}
        <SheetHeader className="px-3 py-2 border-b bg-muted/40 shrink-0">
          <div className="flex justify-between items-center">

            <div className="flex items-center gap-2 min-w-0">
              {/* Placement toggle */}
              {showPlacementToggle && (
                <div className="shrink-0 flex items-center gap-1 -ml-2">
                  <AppTooltip
                    text={
                      placement === "right"
                        ? "Chuyển sang bên trái"
                        : "Chuyển sang bên phải"
                    }
                  >
                    <button
                      type="button"
                      onClick={togglePlacement}
                      aria-label="Đổi vị trí"
                      className="flex items-center justify-center w-7 h-7 rounded text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                    >
                      <AppIcon
                        icon={
                          placement === "right"
                            ? "panel-left"
                            : "panel-right"
                        }
                        size={16}
                      />
                    </button>
                  </AppTooltip>
                  <Separator orientation="vertical" className="h-8" />
                </div>
              )}

              {/* Title & Description */}
              <div className="min-w-0 flex-1">
                {title && (
                  <SheetTitle className="text-sm font-semibold leading-tight truncate">
                    {title}
                  </SheetTitle>
                )}
                {description && (
                  <SheetDescription className="text-xs mt-0.5 leading-snug">
                    {description}
                  </SheetDescription>
                )}
              </div>


            </div>

            {extraRight && <div className="mr-8">
              {extraRight}
            </div>}
          </div>

        </SheetHeader>

        {/* Body */}
        <div className={cn("flex-1 min-h-0 overflow-y-auto", bodyClassName)}>
          {children}
        </div>

        {/* Footer */}
        {!hideFooter && (
          <SheetFooter className="px-3 py-2 border-t bg-muted/40 shrink-0 flex-row justify-end gap-2">
            {footer ?? defaultFooter}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export interface AppSheetContentProps {
  className?: string;
  children: ReactNode;
}


export function AppSheetContent({ children, className }: AppSheetContentProps) {
  return (
    <div className={cn("flex-1 min-h-0 overflow-y-auto  p-3 h-full space-y-4", className)}>
      {children}
    </div>
  )
}

export default memo(AppSheet);
