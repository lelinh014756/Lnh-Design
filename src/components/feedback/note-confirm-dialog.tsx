import { memo, useEffect, useState } from "react";
import AppButton from "@/components/general/app-button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import AppDialog from "./app-dialog";

export interface NoteConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: React.ReactNode;
    description?: React.ReactNode;
    /** Nội dung mở rộng (VD banner cảnh báo trước Textarea). */
    children?: React.ReactNode;
    noteLabel?: string;
    notePlaceholder?: string;
    /** Note bắt buộc trước khi confirm. Default `false`. */
    noteRequired?: boolean;
    /** Max ký tự. Default 500. */
    maxLength?: number;
    /** Error message hiển thị dưới Textarea (VD validation từ Zod). */
    noteError?: string;
    /** Giá trị khởi tạo cho note (khi re-open có sẵn). */
    defaultNote?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    /** Nhận note đã nhập. */
    onConfirm: (note: string) => void | Promise<void>;
    onCancel?: () => void;
    isLoading?: boolean;
    /** Variant nút confirm — mặc định warning cho pause action. */
    confirmColor?: React.ComponentProps<typeof AppButton>["color"];
    nested?: boolean;
}

/**
 * NoteConfirmDialog — dialog có Textarea nhập lý do trước khi confirm.
 * Dùng cho: tạm dừng ngân hàng (có reason), xoá bank (có reason), disable merchant (optional).
 *
 * @example
 * <NoteConfirmDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Tạm dừng tài khoản?"
 *   description="Tài khoản MB 03750 sẽ bị tạm dừng."
 *   noteLabel="Lý do tạm dừng"
 *   noteRequired
 *   confirmLabel="Xác nhận tạm dừng"
 *   confirmColor="warning"
 *   onConfirm={(reason) => handleConfirm(reason)}
 * >
 *   <AlertApp variant="warning" title="..." />
 * </NoteConfirmDialog>
 */
const NoteConfirmDialog = ({
    open,
    onOpenChange,
    title,
    description,
    children,
    noteLabel = "Lý do",
    notePlaceholder = "Nhập lý do...",
    noteRequired = false,
    maxLength = 500,
    noteError,
    defaultNote = "",
    confirmLabel = "Xác nhận",
    cancelLabel = "Hủy",
    onConfirm,
    onCancel,
    isLoading = false,
    confirmColor = "warning",
    nested,
}: NoteConfirmDialogProps) => {
    const [note, setNote] = useState(defaultNote);

    // Reset khi mở lại
    useEffect(() => {
        if (open) setNote(defaultNote);
    }, [open, defaultNote]);

    const trimmed = note.trim();
    const canSubmit = noteRequired ? trimmed.length > 0 : true;

    const handleCancel = () => {
        onCancel?.();
        onOpenChange(false);
    };

    const handleConfirm = async () => {
        if (!canSubmit || isLoading) return;
        await onConfirm(trimmed);
    };

    return (
        <AppDialog
            open={open}
            onOpenChange={onOpenChange}
            size="md"
            title={title}
            description={description}
            nested={nested}
            footer={
                <>
                    <AppButton
                        variant="ghost"
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
                        {cancelLabel}
                    </AppButton>
                    <AppButton
                        color={confirmColor}
                        onClick={handleConfirm}
                        disabled={!canSubmit || isLoading}
                        loading={isLoading}
                    >
                        {confirmLabel}
                    </AppButton>
                </>
            }
        >
            <div className="space-y-4">
                {children}

                <div className="space-y-2.5">
                    <Label htmlFor="note-confirm-textarea">
                        {noteLabel}
                        {noteRequired && (
                            <span className="text-destructive ml-0.5">*</span>
                        )}
                    </Label>
                    <Textarea
                        id="note-confirm-textarea"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={notePlaceholder}
                        maxLength={maxLength}
                        rows={3}
                        disabled={isLoading}
                        aria-invalid={!!noteError}
                    />
                    <div className="flex items-center justify-between text-[11px]">
                        {noteError ? (
                            <span className="text-destructive">{noteError}</span>
                        ) : (
                            <span className="text-muted-foreground">
                                {noteRequired
                                    ? "Bắt buộc — mô tả ngắn gọn lý do"
                                    : "Tuỳ chọn — hỗ trợ audit trail"}
                            </span>
                        )}
                        <span className="text-muted-foreground tabular-nums">
                            {note.length}/{maxLength}
                        </span>
                    </div>
                </div>
            </div>
        </AppDialog>
    );
};

export default memo(NoteConfirmDialog);
