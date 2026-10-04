import type { ReactNode } from "react"

import type { IconName } from "@/components/general/app-icon"

export type AppStepperVariant =
  | "indicator"
  | "inline"
  | "stacked"
  | "centered"
  | "bar"
  | "progress"
export type AppStepperVerticalVariant = Extract<
  AppStepperVariant,
  "indicator" | "inline"
>
export type AppStepperSize = "sm" | "md" | "lg"
export type AppStepperTone = "primary" | "success"
export type AppStepperControls = "none" | "buttons" | "compact"

export interface AppStepperStep {
  /** Khoá ổn định khi danh sách bước thay đổi động; mặc định dùng chỉ số. */
  key?: string
  title?: ReactNode
  description?: ReactNode
  icon?: IconName
  /** Nhãn phụ cạnh tiêu đề — "Tuỳ chọn", "Mới"… */
  badge?: ReactNode
  content?: ReactNode
  /** Đánh dấu xong từ dữ liệu có sẵn (resume wizard), kể cả khi chưa đi qua. */
  completed?: boolean
  disabled?: boolean
  /** Chỉ hiển thị khi bước đang active — giống primitive. */
  loading?: boolean
  error?: boolean
}

export interface AppStepperApi {
  step: number
  total: number
  /** Không còn bước khả dụng phía trước / phía sau (đã bỏ qua bước disabled). */
  isFirst: boolean
  isLast: boolean
  isPending: boolean
  isFinished: boolean
  canFinish: boolean
  next: () => Promise<boolean>
  prev: () => void
  goTo: (step: number) => Promise<boolean>
}

/**
 * Mọi chuỗi hiển thị của stepper. Item registry không được đọc từ điển của app,
 * nên nhãn đi vào bằng prop: `labels` ghi đè từng phần trên nền mặc định tiếng
 * Anh, hoặc truyền nguyên `appStepperLabelsVi`.
 *
 * Chuỗi mẫu `{step}` / `{current}` / `{total}` thay vì hàm: trang server truyền
 * `labels` xuống client component này, mà hàm thì không serialize qua ranh giới.
 */
export interface AppStepperLabels {
  navLabel: string
  back: ReactNode
  next: ReactNode
  finish: ReactNode
  /** Mẫu có `{step}`. */
  stepLabel: string
  /** Mẫu có `{current}` và `{total}`. */
  progress: string
  statusActive: string
  statusCompleted: string
  statusPending: string
  statusError: string
  statusLoading: string
}

type AppStepperLayoutProps =
  | { orientation?: "horizontal"; variant?: AppStepperVariant }
  | { orientation: "vertical"; variant?: AppStepperVerticalVariant }

export type AppStepperProps = AppStepperLayoutProps & {
  steps: readonly AppStepperStep[]
  /** Bước hiện tại, đánh số từ 1. */
  value?: number
  defaultValue?: number
  onValueChange?: (step: number) => void
  marker?: "number" | "dot"
  size?: AppStepperSize
  completedTone?: AppStepperTone
  showCompletedIcon?: boolean
  showSeparator?: boolean
  /** Dòng "Bước N" phía trên tiêu đề. */
  showStepLabel?: boolean
  /** Badge trạng thái tự đổi theo bước: đang làm / xong / chưa bắt đầu / lỗi. */
  showStatus?: boolean
  linear?: boolean
  /** Trả `false` (hoặc ném lỗi) để chặn tiến tới. Nhận bước đang đứng. */
  beforeNext?: (step: number) => boolean | Promise<boolean>
  /** Bấm Hoàn tất ở bước cuối, sau khi `beforeNext` cho qua. */
  onComplete?: () => void | Promise<void>
  /** Lỗi ném ra từ `beforeNext`/`onComplete`. Không truyền thì ghi console. */
  onError?: (error: unknown, step: number) => void
  controls?: AppStepperControls
  /** Thay toàn bộ cụm điều khiển mặc định. */
  renderControls?: (api: AppStepperApi) => ReactNode
  labels?: Partial<AppStepperLabels>
  /** Giữ DOM của các bước ẩn — input không-controlled không mất giá trị. */
  keepMounted?: boolean
  className?: string
  navClassName?: string
  panelClassName?: string
  "aria-label"?: string
}
