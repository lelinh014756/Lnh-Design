"use client"

/**
 * Toolbar entry point for the settings sheet — trigger plus sheet, so a screen
 * mounts one component.
 *
 * Labels tự đọc từ `table.options.localization.settings` bên trong nếu caller không truyền.
 */

import AppIcon from "@/components/general/app-icon"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { TableSettingsHandle } from "@/hooks/table/use-table-settings"
import { useTableLocalization } from "@/lib/table/localization/use-table-localization";

import { TableSettingsSheet } from "./table-settings-sheet"
import {
  type BaseTableSettings,
  type TableColumnLayoutOption,
  type TableSettingsLabels,
} from "./table-settings-types"

interface TableSettingsProps<TSettings extends BaseTableSettings> {
  settings: TableSettingsHandle<TSettings>
  columns: TableColumnLayoutOption[]
  defaults: () => TSettings
  /** Optional — nếu không truyền, tự đọc từ table.options.localization.settings. */
  labels?: TableSettingsLabels
  disabled?: boolean
  /**
   * Công tắc mục "Hành vi" — mặc định ẩn hết, bật cái nào thì màn hình phải
   * đấu dây cờ tương ứng vào bảng. Không bật cái nào thì mục "Hành vi" không
   * hiện. Xem `TableSettingsSheet`.
   */
  showMultiRowSelectionSwitch?: boolean
  showSummaryFooterSwitch?: boolean
  showInfiniteScrollSwitch?: boolean
  onBeforeApply?: (draft: TSettings, applied: TSettings) => void
}

export function TableSettings<TSettings extends BaseTableSettings>({
  settings,
  columns,
  defaults,
  labels: labelsProp,
  disabled,
  showMultiRowSelectionSwitch,
  showSummaryFooterSwitch,
  showInfiniteScrollSwitch,
  onBeforeApply,
}: TableSettingsProps<TSettings>) {
  const fallback = useTableLocalization()
  const labels = labelsProp ?? fallback.settings
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label={labels.trigger}
            variant="outline"
            size="icon"
            disabled={disabled}
            onClick={() => setOpen(true)}
          >
            <AppIcon icon="sliders-horizontal" className="text-muted-foreground" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{labels.trigger}</TooltipContent>
      </Tooltip>

      <TableSettingsSheet
        open={open}
        onOpenChange={setOpen}
        settings={settings}
        columns={columns}
        labels={labels}
        defaults={defaults}
        showMultiRowSelectionSwitch={showMultiRowSelectionSwitch}
        showSummaryFooterSwitch={showSummaryFooterSwitch}
        showInfiniteScrollSwitch={showInfiniteScrollSwitch}
        onBeforeApply={onBeforeApply}
      />
    </>
  )
}
