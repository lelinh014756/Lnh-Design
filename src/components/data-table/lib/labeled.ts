/** Mirror `StackedCell` for export — same labels, single cell, `null` when
 *  every pair is empty so `toCellValue` writes an empty Excel cell instead of
 *  the literal string "Công ty: / Cá nhân:". */
export function joinLabeled(
  pairs: ReadonlyArray<
    readonly [label: string, value: string | null | undefined]
  >,
): string | null {
  const parts = pairs
    .filter(([, value]) => Boolean(value))
    .map(([label, value]) => `${label}: ${value}`);
  return parts.length > 0 ? parts.join(" / ") : null;
}
