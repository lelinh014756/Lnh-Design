import type { TableLocalization } from "@/lib/table/types";

import { tableLocalizationEn } from "./en";
import { tableLocalizationVi } from "./vi";

export { tableLocalizationEn, tableLocalizationVi };

export const defaultTableLocalization = tableLocalizationEn;

/** Ghi đè theo từng nhóm — mỗi nhóm cho phép chỉ truyền vài khoá. */
export type TableLocalizationOverrides = {
  [K in keyof TableLocalization]?: TableLocalization[K] extends string
    ? string
    : Partial<TableLocalization[K]>;
};

/** Interpolate `{placeholder}` tokens, e.g. `filterByColumn`. */
export function formatLocalized(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/**
 * Trộn phần ghi đè lên bản mặc định.
 *
 * Merge HAI TẦNG, không phải một. Với cấu trúc lồng, `{ ...base, ...overrides }`
 * sẽ thay nguyên cả nhóm: truyền `{ pagination: { rowsPerPage: "…" } }` là mất
 * sạch sáu khoá còn lại của `pagination` và giao diện hiện `undefined`.
 */
export function resolveLocalization(
  overrides?: TableLocalizationOverrides,
): TableLocalization {
  if (!overrides) return defaultTableLocalization;

  const merged = { ...defaultTableLocalization } as Record<string, unknown>;

  for (const [group, value] of Object.entries(overrides)) {
    if (value === undefined) continue;

    const base = merged[group];
    merged[group] =
      typeof base === "object" && base !== null && typeof value === "object"
        ? { ...base, ...value }
        : value;
  }

  return merged as unknown as TableLocalization;
}
