"use client";

import { useOptionalTableContext } from "@/components/table/table-provider";
import type { TableLocalization } from "@/lib/table/types";

import { defaultTableLocalization } from "./index";

/**
 * Chuỗi hiển thị cho component KHÔNG nhận prop `table`.
 *
 * Phần lớn thành phần trong cụm đã có `table` nên đọc thẳng `table.localization`.
 * Ba thành phần đứng riêng (`TableFilters`, `TableSettings`, `TableExcelActions`)
 * thì không — chúng lấy từ `TableProvider` nếu đang nằm trong một bảng, và rơi
 * về bản mặc định nếu không.
 *
 * Không có provider vẫn chạy: đó chính là điều kiện để item cài được vào một
 * repo trống mà không phải dựng thêm gì.
 */
export function useTableLocalization(): TableLocalization {
  return useOptionalTableContext()?.options.localization ?? defaultTableLocalization;
}
