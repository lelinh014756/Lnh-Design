"use client";

import { FileDown, FileInput, FileSpreadsheet } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import AppDialog from "@/components/feedback/app-dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTableLocalization } from "@/lib/table/localization/use-table-localization";

import { TableExcelActionRow } from "./table-excel-action-row";
import type {
  TableExcelActionsLabels,
  TableExcelActionsProps,
} from "./types";

export const DEFAULT_EXCEL_ACCEPT =
  ".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export const DEFAULT_EXCEL_MAX_BYTES = 5 * 1024 * 1024;

export function TableExcelActions({
  labels: labelsProp,
  disabled,
  loading,
  importAccept = DEFAULT_EXCEL_ACCEPT,
  maxImportBytes = DEFAULT_EXCEL_MAX_BYTES,
  onDownloadTemplate,
  onImportFile,
  onError,
}: TableExcelActionsProps) {
  const fallback = useTableLocalization();
  const labels = labelsProp ?? fallback.excelActions;
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const importInputRef = React.useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = React.useCallback(async () => {
    if (!onDownloadTemplate) return;
    setPending(true);
    try {
      await onDownloadTemplate();
    } catch (error) {
      toast.error(labels.templateDownloadFailure);
      onError?.("template", error);
    } finally {
      setPending(false);
    }
  }, [onDownloadTemplate, labels.templateDownloadFailure, onError]);

  const handleImportFile = React.useCallback(
    async (file: File) => {
      if (!onImportFile) return;
      setPending(true);
      try {
        await onImportFile(file);
        toast.success(labels.importSuccess);
      } catch (error) {
        const message = resolveImportError(error, labels);
        toast.error(message);
        onError?.("import", error);
      } finally {
        setPending(false);
      }
    },
    [onImportFile, labels, onError],
  );

  const onFileChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;

      if (!file.name.toLowerCase().endsWith(".xlsx")) {
        toast.error(labels.importInvalidType);
        return;
      }
      if (file.size > maxImportBytes) {
        toast.error(labels.importTooLarge);
        return;
      }
      void handleImportFile(file);
    },
    [handleImportFile, labels.importInvalidType, labels.importTooLarge, maxImportBytes],
  );

  const closeAndRun = (action: () => void) => {
    setOpen(false);
    action();
  };

  const isDisabled = disabled || pending || loading;

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label={labels.trigger}
            variant="outline"
            size="icon"
            className="size-8"
            disabled={isDisabled}
            onClick={() => setOpen(true)}
          >
            <FileSpreadsheet className="text-muted-foreground" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{labels.trigger}</TooltipContent>
      </Tooltip>

      <AppDialog
        open={open}
        onOpenChange={setOpen}
        size="sm"
        title={labels.title}
      >
        <div className="flex flex-col gap-2">
          <TableExcelActionRow
            icon={FileDown}
            label={labels.downloadTemplate}
            disabled={!onDownloadTemplate || pending}
            onClick={() => closeAndRun(() => void handleDownloadTemplate())}
          />
          <TableExcelActionRow
            icon={FileInput}
            label={labels.importFile}
            disabled={!onImportFile || pending}
            onClick={() => closeAndRun(() => importInputRef.current?.click())}
          />
        </div>

        <input
          ref={importInputRef}
          type="file"
          accept={importAccept}
          tabIndex={-1}
          aria-hidden
          className="sr-only"
          onChange={onFileChange}
        />
      </AppDialog>
    </>
  );
}

function resolveImportError(
  error: unknown,
  labels: TableExcelActionsLabels,
): string {
  if (
    error &&
    typeof error === "object" &&
    "missingHeaders" in error &&
    Array.isArray((error as { missingHeaders: unknown }).missingHeaders)
  ) {
    return labels.importHeaderMissing;
  }
  return labels.importFailure;
}
