'use client'

import {
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react'
import { cn } from '@/lib/utils'
import AppIcon, { type IconName } from '@/components/general/app-icon'

export type FloatingInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'prefix'
> & {
  label: string
  /** Icon bên trái (tên trong `ICON_NAMES`). */
  startIcon?: IconName
  /** Nội dung tùy chỉnh bên phải (ưu tiên hơn clear / password toggle). */
  endAdornment?: ReactNode
  /** Hiện nút xóa khi có giá trị (mặc định bật với type text/email/number). */
  clearable?: boolean
  onClear?: () => void
  invalid?: boolean
  errorMessage?: string
  /** Nền đè lên viền dưới label — khớp nền form (vd `bg-white`, `bg-card`). */
  labelBackgroundClassName?: string
  containerClassName?: string
  /** Giữ giao diện sáng dù app đang dark (form login mobile…). */
  forceLight?: boolean
  ref?: Ref<HTMLInputElement>
}

/**
 * Outlined input kiểu Material — label nổi lên mép trên viền khi focus hoặc có giá trị.
 *
 * Dùng `placeholder=" "` (một khoảng trắng) để CSS `:placeholder-shown` biết trạng thái trống.
 */
export function FloatingInput({
  id: idProp,
  label,
  startIcon,
  endAdornment,
  clearable,
  onClear,
  invalid,
  errorMessage,
  labelBackgroundClassName = 'bg-background',
  containerClassName,
  forceLight = false,
  className,
  type = 'text',
  value,
  defaultValue,
  disabled,
  onFocus,
  onBlur,
  onChange,
  ref,
  ...props
}: FloatingInputProps) {
  const autoId = useId()
  const id = idProp ?? autoId
  const errorId = `${id}-error`

  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [uncontrolled, setUncontrolled] = useState(() => String(defaultValue ?? ''))

  const isControlled = value !== undefined
  const rawValue = isControlled ? String(value ?? '') : uncontrolled
  const hasValue = rawValue.length > 0
  const floated = focused || hasValue

  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type
  const showClear =
    (clearable ?? (!isPassword && type !== 'hidden')) && hasValue && !disabled && !endAdornment

  return (
    <div className={cn('w-full', containerClassName)}>
      <div
        data-slot="floating-input"
        data-invalid={invalid || undefined}
        data-floated={floated || undefined}
        data-force-light={forceLight || undefined}
        className={cn(
          'group/floating relative flex h-12 w-full items-center rounded-xl bg-background transition-[border-color,box-shadow]',
          // Chưa focus: không viền. Focus / lỗi mới hiện border.
          'border-0',
          forceLight &&
            'bg-white text-neutral-900 shadow-none dark:bg-white dark:text-neutral-900 [&_span]:text-neutral-500 dark:[&_span]:text-neutral-500 [&_button]:text-neutral-500 dark:[&_button]:text-neutral-500 [&_button:hover]:bg-neutral-100 [&_button:hover]:text-neutral-800 [&_label]:text-neutral-500 dark:[&_label]:text-neutral-500',
          className,
          // className có thể chứa bg-white/90 — forceLight phải thắng dark
          forceLight && 'dark:!bg-white',
          focused && !invalid && 'border border-primary ring-2 ring-primary/30',
          invalid && 'border border-destructive ring-2 ring-destructive/20',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        {startIcon ? (
          <span className="pointer-events-none flex shrink-0 items-center pl-3 text-muted-foreground">
            <AppIcon icon={startIcon} className="size-4" />
          </span>
        ) : null}

        <div className="relative min-w-0 flex-1 self-stretch">
          <input
            {...props}
            ref={ref}
            id={id}
            type={inputType}
            disabled={disabled}
            value={isControlled ? value : undefined}
            defaultValue={isControlled ? undefined : defaultValue}
            // Một khoảng trắng — không hiện placeholder thật, chỉ để :placeholder-shown hoạt động
            placeholder=" "
            aria-invalid={invalid || undefined}
            aria-describedby={invalid && errorMessage ? errorId : undefined}
            className={cn(
              'peer h-full w-full bg-transparent px-3 text-sm outline-none',
              'placeholder:text-transparent',
              startIcon ? 'pl-2' : 'pl-3',
              (showClear || isPassword || endAdornment) && 'pr-2',
            )}
            onFocus={(e) => {
              setFocused(true)
              onFocus?.(e)
            }}
            onBlur={(e) => {
              setFocused(false)
              onBlur?.(e)
            }}
            onChange={(e) => {
              if (!isControlled) setUncontrolled(e.target.value)
              onChange?.(e)
            }}
          />

          <label
            htmlFor={id}
            className={cn(
              'pointer-events-none absolute z-[1] origin-left px-1 text-muted-foreground transition-all duration-200',
              startIcon ? 'left-0' : 'left-2',
              floated
                ? cn(
                    'top-0 -translate-y-1/2 text-[0.7rem] font-medium leading-none',
                    focused && !invalid && 'text-primary',
                    invalid && 'text-destructive',
                    forceLight
                      ? 'bg-white dark:bg-white'
                      : labelBackgroundClassName,
                  )
                : 'top-1/2 -translate-y-1/2 text-sm',
            )}
          >
            {label}
          </label>
        </div>

        <div className="flex shrink-0 items-center gap-0.5 pr-2">
          {endAdornment}

          {showClear ? (
            <button
              type="button"
              tabIndex={-1}
              aria-label="Xóa"
              className="inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (!isControlled) setUncontrolled('')
                onClear?.()
                const el = document.getElementById(id) as HTMLInputElement | null
                if (el && isControlled) {
                  // Controlled: caller phải clear qua onClear / setValue
                } else if (el && !isControlled) {
                  el.value = ''
                  el.dispatchEvent(new Event('input', { bubbles: true }))
                }
                el?.focus()
              }}
            >
              <AppIcon icon="circle-x" className="size-4" />
            </button>
          ) : null}

          {isPassword ? (
            <button
              type="button"
              tabIndex={-1}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              className="inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowPassword((v) => !v)}
            >
              <AppIcon
                icon={showPassword ? 'eye' : 'eye-off'}
                className="size-4"
              />
            </button>
          ) : null}
        </div>
      </div>

      {invalid && errorMessage ? (
        <p id={errorId} className="mt-1.5 text-xs text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}
