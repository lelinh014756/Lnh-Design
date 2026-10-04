import { cn } from "@/lib/utils"

import type {
  AppStepperSize,
  AppStepperTone,
  AppStepperVariant,
  AppStepperVerticalVariant,
} from "./types"

export type IndicatorKind = "circle" | "bar" | "progress"

export interface LayoutClasses {
  nav: string
  item: string
  trigger: string
  separator: string | null
}

export const SIZE: Record<
  AppStepperSize,
  { box: string; icon: number; title: string; cssVar: string }
> = {
  sm: {
    box: "size-5 text-[0.625rem]",
    icon: 11,
    title: "text-[0.8125rem] leading-5",
    cssVar: "[--app-stepper-ind:1.25rem]",
  },
  md: {
    box: "size-6 text-xs",
    icon: 13,
    title: "text-sm leading-5",
    cssVar: "[--app-stepper-ind:1.5rem]",
  },
  lg: {
    box: "size-8 text-sm",
    icon: 16,
    title: "text-[0.9375rem] leading-6 font-semibold",
    cssVar: "[--app-stepper-ind:2rem]",
  },
}

export const HORIZONTAL_LAYOUT: Record<AppStepperVariant, LayoutClasses> = {
  indicator: {
    nav: "items-center",
    item: "",
    trigger: "",
    separator: "mx-1.5",
  },
  inline: {
    nav: "items-center",
    item: "",
    trigger: "gap-2 rounded-md text-start",
    separator: "mx-2.5 min-w-4",
  },
  stacked: {
    nav: "items-start gap-3",
    item: "relative flex-1 items-start",
    trigger: "grow flex-col items-start gap-2.5 rounded-md text-start",
    separator:
      "absolute m-0 top-[calc(var(--app-stepper-ind)/2_-_1px)] start-[calc(var(--app-stepper-ind)_+_0.375rem)] group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%_-_var(--app-stepper-ind))] group-data-[orientation=horizontal]/stepper-nav:flex-none",
  },
  centered: {
    nav: "items-start",
    item: "relative flex-1 items-start",
    trigger: "flex-col gap-2 rounded-md px-1 text-center",
    separator:
      "absolute m-0 top-[calc(var(--app-stepper-ind)/2_-_1px)] start-[calc(50%_+_var(--app-stepper-ind)/2_+_0.375rem)] group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%_-_var(--app-stepper-ind)_-_0.75rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none",
  },
  bar: {
    nav: "items-start gap-4",
    item: "flex-1 items-start",
    trigger: "grow flex-col items-start gap-3 rounded-sm text-start",
    separator: null,
  },
  progress: {
    nav: "items-center",
    item: "flex-1",
    trigger: "w-full py-2",
    separator: null,
  },
}

export const VERTICAL_LAYOUT: Record<AppStepperVerticalVariant, LayoutClasses> = {
  indicator: {
    nav: "shrink-0",
    item: "",
    trigger: "",
    separator: "my-1",
  },
  inline: {
    nav: "shrink-0",
    item: "relative items-start not-last:flex-1",
    trigger: "items-start gap-2.5 rounded-md pb-7 text-start last:pb-0",
    separator:
      "absolute m-0 start-[calc(var(--app-stepper-ind)/2_-_1px)] top-[calc(var(--app-stepper-ind)_+_0.25rem)] group-data-[orientation=vertical]/stepper-nav:h-[calc(100%_-_var(--app-stepper-ind)_-_0.5rem)]",
  },
}

// Each state gets its own class so tailwind-merge drops the primitive's
// same-variant defaults instead of relying on CSS source order.
const CIRCLE_BASE =
  "border font-medium tabular-nums transition-[background-color,border-color,color,box-shadow] duration-200 ease-out data-[state=inactive]:border-border data-[state=inactive]:bg-background data-[state=inactive]:text-muted-foreground data-[state=active]:border-primary data-[state=active]:ring-3 data-[state=active]:ring-primary/15"

// `success` dùng thang `green-*` của Tailwind chứ không phải token: shadcn init
// không tạo `--success`, và `AppButton` (intent success) cũng đang dùng `green-600`.
const CIRCLE_TONE: Record<AppStepperTone, string> = {
  primary: "data-[state=completed]:border-primary",
  success:
    "data-[state=completed]:border-green-600 data-[state=completed]:bg-green-600 data-[state=completed]:text-white",
}

const CIRCLE_ERROR =
  "data-[state=inactive]:border-destructive data-[state=inactive]:bg-destructive data-[state=inactive]:text-white data-[state=active]:border-destructive data-[state=active]:bg-destructive data-[state=active]:text-white data-[state=active]:ring-destructive/15 data-[state=completed]:border-destructive data-[state=completed]:bg-destructive data-[state=completed]:text-white"

const BAR_BASE =
  "w-full bg-border transition-colors duration-300 ease-in-out data-[state=active]:bg-primary"

const BAR_TONE: Record<AppStepperTone, string> = {
  primary: "data-[state=completed]:bg-primary",
  success: "data-[state=completed]:bg-green-600",
}

const BAR_ERROR =
  "data-[state=inactive]:bg-destructive data-[state=active]:bg-destructive data-[state=completed]:bg-destructive"

export const SEPARATOR_TONE: Record<AppStepperTone, string> = {
  primary: "group-data-[state=completed]/step:bg-primary",
  success: "group-data-[state=completed]/step:bg-green-600",
}

// Ngưỡng thu gọn nhãn tăng theo số bước: 3 bước vừa khung 384px, 5 bước thì không.
export const INLINE_COLLAPSE = {
  few: "@max-sm/app-stepper:group-data-[state=inactive]/step:sr-only @max-sm/app-stepper:group-data-[state=completed]/step:sr-only",
  some: "@max-lg/app-stepper:group-data-[state=inactive]/step:sr-only @max-lg/app-stepper:group-data-[state=completed]/step:sr-only",
  many: "@max-2xl/app-stepper:group-data-[state=inactive]/step:sr-only @max-2xl/app-stepper:group-data-[state=completed]/step:sr-only",
} as const

function progressRadius(index: number, total: number) {
  if (total === 1) return "rounded-full"
  if (index === 0) return "rounded-[999px_0_0_999px]"
  if (index === total - 1) return "rounded-[0_999px_999px_0]"
  return "rounded-none"
}

export function indicatorClass(
  kind: IndicatorKind,
  opts: {
    size: AppStepperSize
    tone: AppStepperTone
    error: boolean
    loading: boolean
    index: number
    total: number
  }
) {
  if (kind === "circle") {
    return cn(
      SIZE[opts.size].box,
      CIRCLE_BASE,
      opts.error ? CIRCLE_ERROR : CIRCLE_TONE[opts.tone]
    )
  }
  return cn(
    BAR_BASE,
    kind === "bar"
      ? "h-1 rounded-full"
      : cn("h-2", progressRadius(opts.index, opts.total)),
    opts.error ? BAR_ERROR : BAR_TONE[opts.tone],
    opts.loading && "animate-pulse"
  )
}
