/** Two-line cell used by compound columns (emails, phones, id, bank…). Each
 *  row shows `label: value` with the label muted and the value default-weight. */
export function StackedCell({
  rows,
}: {
  rows: ReadonlyArray<
    readonly [label: string, value: string | null | undefined]
  >
}) {
  return (
    <div className="flex flex-col gap-0.5">
      {rows.map(([label, value]) => (
        <span key={label} className="block truncate">
          <span className="text-[11px] font-normal text-muted-foreground/80">
            {label}:{" "}
          </span>
          {value ?? "—"}
        </span>
      ))}
    </div>
  )
}

/** Single muted-value cell for low-emphasis columns (gender, position, dept…). */
export function MutedCell({ value }: { value: string | null | undefined }) {
  return (
    <span className="block truncate text-muted-foreground">{value ?? "—"}</span>
  )
}

export function TruncateCell({ value }: { value: string | null | undefined }) {
  return <span className="block truncate">{value ?? "—"}</span>
}
