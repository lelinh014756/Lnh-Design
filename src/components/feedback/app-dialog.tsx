import { memo } from "react";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// ─── Size mapping ───────────────────────────────────────────────────────────

const SIZE_CLASSES = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
    "3xl": "sm:max-w-3xl",
    "4xl": "sm:max-w-4xl",
} as const;

export type AppDialogSize = keyof typeof SIZE_CLASSES;

// ─── Base Dialog wrapper ────────────────────────────────────────────────────

export interface AppDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Kích thước max-width. Default `md`. */
    size?: AppDialogSize;
    /** Chiều cao tối đa của toàn dialog (dùng khi body dài — bật flex-col + scroll). */
    maxHeight?: string;
    /** Tiêu đề (bắt buộc theo a11y). */
    title: React.ReactNode;
    /** Mô tả ngắn dưới title (tuỳ chọn). */
    description?: React.ReactNode;
    /** Ẩn header hoàn toàn (dùng cho critical/status dialog tự vẽ). Vẫn giữ `sr-only` title cho a11y. */
    hideHeader?: boolean;
    /** Custom class cho header. */
    headerClassName?: string;
    /** Nội dung body. */
    children?: React.ReactNode;
    /** Custom class cho body wrapper. */
    bodyClassName?: string;
    /** Footer (buttons) — nếu không truyền, không render footer. */
    footer?: React.ReactNode;
    /** Custom class cho footer. */
    footerClassName?: string;
    /** Class cho DialogContent. */
    contentClassName?: string;
    /** Nested dialog (bên trong 1 dialog khác) → z-index cao hơn. */
    nested?: boolean;
}

/**
 * AppDialog — base wrapper cho tất cả dialog trong app.
 * Đóng gói pattern Header (title + description) + Body + Footer, hạn chế boilerplate.
 *
 * @example
 * <AppDialog
 *   open={open}
 *   onOpenChange={onOpenChange}
 *   size="md"
 *   title="Xác nhận thao tác"
 *   description="Hành động này không thể hoàn tác."
 *   footer={
 *     <>
 *       <AppButton variant="outline" onClick={handleCancel}>Hủy</AppButton>
 *       <AppButton color="destructive" onClick={handleConfirm}>Xóa</AppButton>
 *     </>
 *   }
 * >
 *   <p>Body content...</p>
 * </AppDialog>
 */
const AppDialog = ({
    open,
    onOpenChange,
    size = "md",
    maxHeight,
    title,
    description,
    hideHeader = false,
    headerClassName,
    children,
    bodyClassName,
    footer,
    footerClassName,
    contentClassName,
    nested = false,
}: AppDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    "pb-2 overflow-hidden p-0 gap-0",
                    SIZE_CLASSES[size],
                    maxHeight && "flex flex-col",
                    nested && "z-[60]",
                    contentClassName,
                )}
                style={maxHeight ? { maxHeight } : undefined}
            >
                {hideHeader ? (
                    // Vẫn cần title cho a11y screen reader
                    <DialogHeader className="sr-only gap-1 py-3 border-b bg-muted/40">
                        <DialogTitle>{title}</DialogTitle>
                        {description && (
                            <DialogDescription>{description}</DialogDescription>
                        )}
                    </DialogHeader>
                ) : (
                    <DialogHeader
                        className={cn(
                            "p-4 py-3 gap-1 border-b bg-muted/40",
                            maxHeight && "",
                            headerClassName,
                        )}
                    >
                        <DialogTitle>{title}</DialogTitle>
                        {description && (
                            <DialogDescription>{description}</DialogDescription>
                        )}
                    </DialogHeader>
                )}

                {children !== undefined && (
                    <div
                        className={cn(
                            "p-4",
                            maxHeight
                                ? "overflow-auto flex-1"
                                : "",
                            bodyClassName,
                        )}
                    >
                        {children}
                    </div>
                )}

                {footer && (
                    <DialogFooter
                        className={cn(
                            "py-2 px-4 border-t bg-background m-0",
                            footerClassName,
                        )}
                    >
                        {footer}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default memo(AppDialog);
