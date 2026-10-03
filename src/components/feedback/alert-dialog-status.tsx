"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { StatusIconIllustration } from "@/components/illustrations/status-icon-illustration";

export type AlertStateType = "success" | "error" | "warning" | "info" | "celebrate";

interface AlertDialogStatusProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isLoading?: boolean;
  loadingText?: string;
  trigger?: React.ReactNode;
  state?: AlertStateType;
  title: string;
  description: React.ReactNode;
  extraContent?: React.ReactNode;
  cancelText?: string;
  onCancel?: () => void;
  confirmText?: string;
  onConfirm?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

// Map cấu hình UI nền (Background Color)
const ALERT_CONFIG: Record<AlertStateType, {
  bgClass: string;
  btnClass: string;
  /** textColor cho currentColor pick up tone đúng */
  textColor: string;
}> = {
  success: {
    bgClass: "bg-emerald-100 dark:bg-emerald-950/30",
    btnClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
  error: {
    bgClass: "bg-red-100 dark:bg-red-950/30",
    btnClass: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
    textColor: "text-red-600 dark:text-red-400",
  },
  warning: {
    bgClass: "bg-amber-100 dark:bg-amber-950/30",
    btnClass: "bg-amber-600 hover:bg-amber-700 text-white",
    textColor: "text-amber-600 dark:text-amber-400",
  },
  info: {
    bgClass: "bg-blue-100 dark:bg-blue-950/30",
    btnClass: "bg-blue-600 hover:bg-blue-700 text-white",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  celebrate: {
    bgClass: "bg-purple-100 dark:bg-purple-950/30",
    btnClass: "bg-purple-600 hover:bg-purple-700 text-white",
    textColor: "text-purple-600 dark:text-purple-400",
  },
};

// --- MAIN COMPONENT ---
export const AlertDialogStatus = ({
  open,
  onOpenChange,
  trigger,
  state = "info",
  title,
  description,
  extraContent,
  cancelText,
  isLoading = false,
  loadingText = "Đang xử lý...",
  onCancel,
  confirmText = "Xác nhận",
  onConfirm,
}: AlertDialogStatusProps) => {
  const config = ALERT_CONFIG[state];

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => {
      if (isLoading) return;
      onOpenChange?.(isOpen);
    }}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}

      <AlertDialogContent className="p-3">
        <AlertDialogHeader className="items-center text-center!">

          {/* Vùng Render Status Icon (SVG + CSS animation, currentColor từ textColor class) */}
          <div className={cn(
            "flex size-15 items-center justify-center mx-auto rounded-full mb-2",
            config.bgClass,
            config.textColor,
          )}>
            <StatusIconIllustration
              variant={state}
              size={40}
              label={title}
            />
          </div>

          <AlertDialogTitle className="mx-auto text-xl font-bold">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center w-full whitespace-pre-line text-sm text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {extraContent && (
          <div className="my-3 w-full">
            {extraContent}
          </div>
        )}

        <AlertDialogFooter className="sm:justify-center -mx-3 -mb-3 p-3">
          {cancelText && (
            <AlertDialogCancel disabled={isLoading} onClick={onCancel} className="w-full sm:w-auto flex-1">
              {cancelText}
            </AlertDialogCancel>
          )}
          <AlertDialogAction
            disabled={isLoading}
            onClick={(e) => {
              if (isLoading) {
                e.preventDefault();
                return;
              }
              e.preventDefault();
              onConfirm?.(e);
            }}
            // Sử dụng màu nút được mapping tự động cho từng trạng thái
            className={cn("w-full sm:w-auto flex-1", config.btnClass)}
          >
            {isLoading && <Spinner className="mr-2" />}
            {isLoading ? loadingText : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
