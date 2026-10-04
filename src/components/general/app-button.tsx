"use client"

/**
 * Họ nút của app.
 *
 * - `ButtonApp` (default export) — gốc: loading, icon đầu, hiệu ứng quét,
 *   nền gradient, hộp xác nhận trước khi chạy. Không preset, không intent.
 * - `ButtonAdd` / `ButtonSave` / `ButtonSend` / `ButtonConfirm` / `ButtonCancel`
 *   / `ButtonEdit` — đặt sẵn icon và kiểu cho các hành động lặp lại.
 * - `ButtonIntent` — tô màu theo nghĩa hành động; không kết hợp gradient.
 * - `ButtonRefresh` — tải lại dữ liệu, khoá chống bấm dồn bằng đếm ngược.
 *
 * Cỡ nút (`buttonAppSize`) tách khỏi `buttonVariants` của shadcn để chỉnh chiều
 * cao/padding mà không đụng `Button` gốc dùng chung toàn app. Bộ key giữ nguyên
 * để prop `size` vẫn tương thích với `Button`.
 */

import {
  memo,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { AppTooltip } from "@/components/data-display/app-tooltip"
import { AlertDialogStatus } from "@/components/feedback/alert-dialog-status"
import AppIcon, { type IconName } from "@/components/general/app-icon"
import { Button, buttonVariants } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export type ButtonIntentTone = "success" | "warning" | "destructive" | "info"

type ButtonVariantProps = VariantProps<typeof buttonVariants>

export interface ButtonAppProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Khoá nút, hiện spinner kèm `loadingText`. */
  loading?: boolean
  loadingText?: string
  /** Icon đầu nút, tra theo tên qua provider của `AppIcon`. */
  icon?: IconName
  isGradient?: boolean
  /**
   * Bấm nút mở hộp xác nhận thay vì chạy ngay; chỉ khi bấm "Xác nhận" mới chạy
   * `onConfirm` (vắng thì chạy `onClick` với event của cú bấm gốc).
   */
  needsConfirm?: boolean
  onConfirm?: () => void | Promise<void>
  confirmTitle?: string
  confirmDescription?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  /** Chữ trong hộp xác nhận lúc đang chạy; mặc định lấy `loadingText`. */
  confirmLoadingText?: string
  asChild?: boolean
}

export type AppButtonProps = ButtonAppProps & ButtonVariantProps

export interface ButtonIntentProps extends AppButtonProps {
  intent: ButtonIntentTone
}

const SWEEP_CLASS =
  'select-none cursor-pointer relative isolate overflow-hidden transition-all hover:-translate-y-0.5 before:content-[""] before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:opacity-10 before:-z-10 before:transition-all before:duration-400 before:ease-[cubic-bezier(.165,.84,.44,1)] hover:before:left-auto hover:before:right-0 hover:before:w-full'

const GRADIENT_CLASS =
  "bg-gradient-to-b from-primary to-brand-secondary text-white backdrop-blur-2xl"

const buttonAppSize = cva("", {
  variants: {
    size: {
      default:
        "h-7 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
      xs: "h-6 gap-1 rounded-sm px-2 text-[0.625rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-2.5",
      sm: "h-7 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
      lg: "h-9 gap-1.5 px-3 text-sm has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-5",
      // `Button` của repo này có thêm `xl` (bề mặt marketing) — giữ nguyên cỡ gốc.
      xl: "",
      icon: "size-7 [&_svg:not([class*='size-'])]:size-3.5",
      "icon-xs": "size-6 rounded-sm [&_svg:not([class*='size-'])]:size-3",
      "icon-sm": "size-7 [&_svg:not([class*='size-'])]:size-3.5",
      "icon-lg": "size-9 [&_svg:not([class*='size-'])]:size-4.5",
    },
  },
  defaultVariants: {
    size: "lg",
  },
})

const intentOutlineClassMap: Record<ButtonIntentTone, string> = {
  success:
    "bg-green-500/10 border-green-500/50 text-green-600 dark:text-green-400 hover:bg-green-500/20",
  warning:
    "bg-amber-500/10 border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20",
  destructive:
    "bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-400 hover:bg-red-500/20",
  info: "bg-blue-500/10 border-blue-500/50 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20",
}

const intentGhostClassMap: Record<ButtonIntentTone, string> = {
  success:
    "text-green-600 hover:text-green-700 hover:bg-green-500/10 dark:text-green-400",
  warning:
    "text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 dark:text-amber-400",
  destructive:
    "text-red-600 hover:text-red-700 hover:bg-red-500/10 dark:text-red-400",
  info: "text-blue-600 hover:text-blue-700 hover:bg-blue-500/10 dark:text-blue-400",
}

const intentSolidClassMap: Record<ButtonIntentTone, string> = {
  success: "bg-green-600 text-white hover:bg-green-700",
  warning: "bg-amber-500 text-white hover:bg-amber-600",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  info: "bg-blue-600 text-white hover:bg-blue-700",
}

function resolveIntentClass(
  intent: ButtonIntentTone,
  variant: ButtonVariantProps["variant"]
): string {
  if (variant === "outline") return intentOutlineClassMap[intent]
  if (variant === "ghost") return intentGhostClassMap[intent]
  return intentSolidClassMap[intent]
}

export function ButtonApp({
  children,
  loading = false,
  loadingText = "Đang xử lý...",
  icon,
  variant,
  className,
  disabled,
  isGradient = false,
  asChild = false,
  size = "lg",
  onClick,
  needsConfirm = false,
  onConfirm,
  confirmTitle = "Xác nhận thao tác?",
  confirmDescription,
  confirmLabel = "Xác nhận",
  cancelLabel = "Huỷ bỏ",
  confirmLoadingText,
  ...props
}: AppButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmPending, setConfirmPending] = useState(false)
  // Ref chứ không đọc state: hai cú bấm "Xác nhận" sát nhau cùng thấy state cũ.
  const pendingRef = useRef(false)
  const clickEventRef = useRef<MouseEvent<HTMLButtonElement> | null>(null)

  const busy = loading || confirmPending
  const isIconSize = size?.startsWith("icon") ?? false

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!needsConfirm) {
      onClick?.(event)
      return
    }
    event.preventDefault()
    event.stopPropagation()
    clickEventRef.current = event
    setConfirmOpen(true)
  }

  // Không ném lại lỗi: `AlertDialogStatus` không await `onConfirm`, ném ra chỉ
  // thành unhandled rejection. Hộp giữ nguyên để người dùng thử lại hoặc huỷ;
  // báo lỗi cho người dùng là việc của handler.
  const runConfirm = async () => {
    if (pendingRef.current) return
    pendingRef.current = true
    setConfirmPending(true)
    try {
      if (onConfirm) await onConfirm()
      else if (clickEventRef.current) onClick?.(clickEventRef.current)
      setConfirmOpen(false)
    } catch (error) {
      console.error("[ButtonApp] confirm handler failed", error)
    } finally {
      pendingRef.current = false
      setConfirmPending(false)
    }
  }

  const content = busy ? (
    <>
      <Spinner />
      {!isIconSize && loadingText}
    </>
  ) : (
    <>
      {icon && <AppIcon icon={icon} />}
      {children}
    </>
  )

  return (
    <>
      <Button
        {...props}
        asChild={asChild}
        variant={variant}
        size={size}
        disabled={busy || disabled}
        aria-busy={busy || undefined}
        className={cn(
          SWEEP_CLASS,
          isGradient && GRADIENT_CLASS,
          buttonAppSize({ size }),
          className
        )}
        onClick={handleClick}
      >
        {/* `Slot` chỉ nhận đúng một phần tử con — không chèn icon/spinner vào. */}
        {asChild ? children : content}
      </Button>

      {needsConfirm && (
        <AlertDialogStatus
          open={confirmOpen}
          onOpenChange={(open) => {
            if (!open) setConfirmOpen(false)
          }}
          state="error"
          title={confirmTitle}
          description={confirmDescription}
          confirmText={confirmLabel}
          cancelText={cancelLabel}
          isLoading={confirmPending}
          loadingText={confirmLoadingText ?? loadingText}
          onConfirm={() => void runConfirm()}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </>
  )
}

/** Thêm mới: icon `plus`, nền gradient. */
export const ButtonAdd = ({ icon = "plus", ...props }: AppButtonProps) => (
  <ButtonApp icon={icon} isGradient {...props} />
)

export const ButtonCancel = ({ children, ...props }: AppButtonProps) => (
  <ButtonApp type="button" variant="outline" {...props}>
    {children ?? "Huỷ bỏ"}
  </ButtonApp>
)

export const ButtonSend = ({ icon = "send", ...props }: AppButtonProps) => (
  <ButtonApp icon={icon} {...props} />
)

export const ButtonConfirm = ({ icon = "circle-check", ...props }: AppButtonProps) => (
  <ButtonApp icon={icon} {...props} />
)

interface ButtonSaveProps extends AppButtonProps {
  /** Nhãn mặc định "Lưu thay đổi" thay vì "Thêm mới". */
  isEdit?: boolean
}

export const ButtonSave = ({ icon = "save", isEdit = false, children, ...props }: ButtonSaveProps) => (
  <ButtonApp icon={icon} isGradient {...props}>
    {children ?? (isEdit ? "Lưu thay đổi" : "Thêm mới")}
  </ButtonApp>
)

/** Tô màu theo nghĩa hành động; độ đậm theo `variant`. Không kết hợp gradient. */
export const ButtonIntent = ({ intent, variant, className, ...props }: ButtonIntentProps) => (
  <ButtonApp
    variant={variant}
    className={cn(resolveIntentClass(intent, variant), className)}
    {...props}
  />
)

export const ButtonEdit = ({ icon = "pencil", ...props }: AppButtonProps) => (
  <ButtonIntent intent="success" icon={icon} {...props} />
)

export interface ButtonRefreshProps extends ButtonVariantProps {
  /** Tooltip ở chế độ icon, nhãn ở chế độ text; cũng là `aria-label` khi chỉ có icon. */
  label?: ReactNode
  /** Đang gọi lệnh tải lại: hiện spinner thay icon. */
  loading?: boolean
  /** Dữ liệu đang đồng bộ nền: icon xoay, nút khoá. */
  fetching?: boolean
  /** Chữ lúc `loading` ở chế độ text; mặc định lấy `label` nếu là chuỗi. */
  loadingText?: string
  /** Số giây khoá sau mỗi lần bấm; `0` để tắt. */
  cooldown?: number
  disabled?: boolean
  className?: string
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  icon?: IconName
  /** `icon` chỉ icon, `text` icon + nhãn, `auto` theo `showButtonName`. */
  display?: "icon" | "text" | "auto"
  showButtonName?: boolean
}

/**
 * Nút làm mới có khoá chống bấm dồn: sau mỗi lần bấm, nút đếm ngược `cooldown`
 * giây. Đếm ngược tạm dừng khi đang `loading`/`fetching` — người dùng không bị
 * khoá thêm vì một lần tải chậm — và chạy tiếp khi xong.
 */
export function ButtonRefresh({
  label = "Làm mới",
  loading = false,
  fetching = false,
  loadingText,
  cooldown = 5,
  disabled = false,
  className,
  onClick,
  icon = "refresh-cw",
  display = "auto",
  showButtonName = false,
  size,
  variant = "outline",
}: ButtonRefreshProps) {
  const [countdown, setCountdown] = useState(0)
  const busy = loading || fetching

  useEffect(() => {
    if (countdown === 0 || busy) return
    const tick = setTimeout(() => setCountdown((seconds) => Math.max(0, seconds - 1)), 1000)
    return () => clearTimeout(tick)
  }, [countdown, busy])

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (cooldown > 0 && !busy) setCountdown(cooldown)
    onClick?.(event)
  }

  const isCoolingDown = countdown > 0 && !busy
  const showText = display === "text" || (display === "auto" && showButtonName)
  const textLabel = typeof label === "string" ? label : undefined

  return (
    // `disabled` truyền tường minh xuống nút: `TooltipTrigger asChild` cũng đặt
    // `disabled` lên con khi tắt tooltip, và giá trị của con phải thắng.
    <AppTooltip text={label} disabled={showText}>
      <ButtonApp
        variant={variant}
        size={size ?? (showText ? "lg" : "icon-lg")}
        loading={loading}
        loadingText={loadingText ?? textLabel}
        disabled={disabled || fetching || isCoolingDown}
        aria-label={showText ? undefined : textLabel}
        className={className}
        onClick={handleClick}
      >
        {isCoolingDown ? (
          <span className="text-xs tabular-nums">{countdown}s</span>
        ) : (
          <AppIcon icon={icon} className={cn(fetching && "animate-spin")} />
        )}
        {showText && label}
      </ButtonApp>
    </AppTooltip>
  )
}

export default memo(ButtonApp)
