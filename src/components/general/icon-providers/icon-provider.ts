import type { ReactElement, SVGProps } from "react"

import type { IconName } from "./icon-names"

export interface IconRenderProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
  size: number | string
  strokeWidth: number
  "data-icon"?: IconName
}

/**
 * Adapter cho một thư viện icon. `TSource` là dạng icon của thư viện đó —
 * component (lucide) hay dữ liệu SVG (hugeicons) — nên chỉ provider biết cách render.
 */
export interface IconProvider<TSource> {
  readonly id: string
  /** Độ dày nét mặc định cân theo bộ glyph của thư viện. */
  readonly defaultStrokeWidth: number
  readonly icons: Readonly<Record<IconName, TSource>>
  render: (source: TSource, props: IconRenderProps) => ReactElement
}
