import { dataDisplayPreviews } from "./data-display";
import { dataEntryPreviews } from "./data-entry";
import { dataTablePreviews } from "./data-table";
import { feedbackPreviews } from "./feedback";
import { generalPreviews } from "./general";
import { layoutPreviews } from "./layout";
import { navigationPreviews } from "./navigation";
import type { PreviewMap } from "./types";

export type { PreviewMap } from "./types";

/**
 * Map `slug → demo`, gộp từ các file theo nhóm.
 *
 * Tách khỏi `component-catalog` có chủ ý: catalog là data thuần, import được từ
 * script Node; file này mang JSX nên chỉ chạy qua bundler. Trang showcase tra
 * ở đây để biết item nào ĐÃ có demo — không có cờ `hasPreview` viết tay nào để
 * lệch với thực tế.
 */
export const previewRegistry: PreviewMap = {
  ...generalPreviews,
  ...layoutPreviews,
  ...navigationPreviews,
  ...dataEntryPreviews,
  ...dataDisplayPreviews,
  ...feedbackPreviews,
  ...dataTablePreviews,
};

export function hasPreview(slug: string): boolean {
  return slug in previewRegistry;
}
