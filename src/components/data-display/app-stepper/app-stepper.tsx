"use client"

import { useEffect, useRef, useState } from "react"

import AppIcon from "@/components/general/app-icon"
import { Button } from "@/components/ui/button"
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper"
import { cn } from "@/lib/utils"

import { formatLabel, resolveAppStepperLabels } from "./labels"
import { ControlsSlot, StepMarker, StepText } from "./step-parts"
import {
  HORIZONTAL_LAYOUT,
  INLINE_COLLAPSE,
  SEPARATOR_TONE,
  SIZE,
  VERTICAL_LAYOUT,
  indicatorClass,
  type IndicatorKind,
} from "./styles"
import type {
  AppStepperApi,
  AppStepperProps,
  AppStepperVerticalVariant,
} from "./types"

/**
 * Stepper dùng chung cho wizard nhiều bước. Bọc primitive `ui/stepper` bằng API
 * khai báo `steps[]` để màn nghiệp vụ không phải tự dựng lại nav/indicator/
 * đường nối.
 *
 * - Bố cục: `variant` × `orientation`. Dọc chỉ nhận `indicator`/`inline` — ép ở
 *   tầng type vì các bố cục còn lại không có nghĩa khi xếp dọc.
 * - Tiến tới luôn đi qua `beforeNext` (nút Tiếp tục, bấm bước, phím Enter);
 *   lùi thì không. Guard async → bước hiện tại hiện spinner, mọi thao tác điều
 *   hướng bị khoá tới khi xong; kết quả về trễ sau khi bước đã đổi từ bên ngoài
 *   sẽ bị bỏ.
 * - `linear`: chỉ nhảy tới bước mà mọi bước trước nó đã xong (đã đi qua hoặc
 *   `completed`). Không bật thì bấm bước nào cũng được, vẫn qua guard.
 * - `onValueChange` chỉ bắn SAU khi guard cho qua — parent controlled không
 *   phải tự chặn lại.
 * - Chiều ngang tự thu gọn nhãn theo bề rộng container (không theo viewport),
 *   nên đặt trong sheet/dialog hẹp vẫn không vỡ.
 */

const clampStep = (step: number, total: number) =>
  Math.min(Math.max(1, Math.trunc(step) || 1), Math.max(total, 1))

const isThenable = (value: unknown): value is PromiseLike<unknown> =>
  typeof (value as PromiseLike<unknown> | null)?.then === "function"

export function AppStepper(props: AppStepperProps) {
  const {
    steps,
    value,
    defaultValue = 1,
    onValueChange,
    orientation = "horizontal",
    variant = "inline",
    marker = "number",
    size = "md",
    completedTone = "primary",
    showCompletedIcon = true,
    showSeparator = true,
    showStepLabel = false,
    showStatus = false,
    linear = false,
    beforeNext,
    onComplete,
    onError,
    controls = "none",
    renderControls,
    labels,
    keepMounted = false,
    className,
    navClassName,
    panelClassName,
    "aria-label": ariaLabel,
  } = props

  const copy = resolveAppStepperLabels(labels)
  const total = steps.length
  const isControlled = value !== undefined

  const [uncontrolledStep, setUncontrolledStep] = useState(defaultValue)
  const current = clampStep(isControlled ? value : uncontrolledStep, total)

  const [furthest, setFurthest] = useState(current)
  const [finished, setFinished] = useState(false)
  const [prevCurrent, setPrevCurrent] = useState(current)
  if (prevCurrent !== current) {
    setPrevCurrent(current)
    setFinished(false)
    if (current > furthest) setFurthest(current)
  }

  const [isPending, setIsPending] = useState(false)
  const pendingRef = useRef(false)
  const mountedRef = useRef(false)
  const epochRef = useRef(0)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Bumped on every settled step change so a guard that resolves after the
  // parent moved the stepper elsewhere cannot drag it forward again.
  useEffect(() => {
    epochRef.current += 1
  }, [current])

  if (total === 0) return null

  const commit = (target: number) => {
    if (!isControlled) setUncontrolledStep(target)
    onValueChange?.(target)
  }

  const runTask = async (task: () => unknown, step: number) => {
    try {
      let result = task()
      // Only async work flips the pending UI; a sync guard would otherwise
      // flash the spinner for a frame on every click.
      if (isThenable(result)) {
        pendingRef.current = true
        setIsPending(true)
        result = await result
      }
      return result !== false
    } catch (error) {
      if (onError) onError(error, step)
      else console.error("[AppStepper] step task failed", { step, error })
      return false
    } finally {
      if (pendingRef.current) {
        pendingRef.current = false
        if (mountedRef.current) setIsPending(false)
      }
    }
  }

  // A disabled step is "not applicable", so linear mode may pass over it.
  const isDone = (step: number) =>
    Boolean(steps[step - 1]?.completed || steps[step - 1]?.disabled) ||
    step < furthest

  const findEnabled = (from: number, direction: 1 | -1) => {
    for (let step = from; step >= 1 && step <= total; step += direction) {
      if (!steps[step - 1]?.disabled) return step
    }
    return null
  }
  const nextTarget = findEnabled(current + 1, 1)
  const prevTarget = findEnabled(current - 1, -1)

  const isReachable = (target: number) => {
    if (!linear || target <= current) return true
    for (let step = current + 1; step < target; step++) {
      if (!isDone(step)) return false
    }
    return true
  }

  const goTo = async (target: number) => {
    if (pendingRef.current) return false
    if (target === current || target < 1 || target > total) return false
    if (steps[target - 1]?.disabled || !isReachable(target)) return false

    if (target < current) {
      commit(target)
      return true
    }

    const epoch = epochRef.current
    const passed = await runTask(() => beforeNext?.(current) ?? true, current)
    if (!passed || !mountedRef.current || epoch !== epochRef.current) {
      return false
    }
    commit(target)
    return true
  }

  const next = async () => {
    if (nextTarget !== null) return goTo(nextTarget)
    if (!onComplete || pendingRef.current || finished) return false

    const passed = await runTask(() => beforeNext?.(current) ?? true, current)
    if (!passed || !mountedRef.current) return false

    const done = await runTask(onComplete, current)
    if (done && mountedRef.current) setFinished(true)
    return done
  }

  const prev = () => {
    if (prevTarget !== null) void goTo(prevTarget)
  }

  const isFirst = prevTarget === null
  const isLast = nextTarget === null
  const canFinish = Boolean(onComplete)

  const api: AppStepperApi = {
    step: current,
    total,
    isFirst,
    isLast,
    isPending,
    isFinished: finished,
    canFinish,
    next,
    prev,
    goTo,
  }

  const vertical = orientation === "vertical"
  const layout = vertical
    ? (VERTICAL_LAYOUT[variant as AppStepperVerticalVariant] ??
      VERTICAL_LAYOUT.inline)
    : HORIZONTAL_LAYOUT[variant]
  const kind: IndicatorKind =
    variant === "bar" ? "bar" : variant === "progress" ? "progress" : "circle"
  const hasText = variant !== "indicator" && variant !== "progress"
  const hasContent = steps.some((step) => step.content !== undefined)
  const collapseClass =
    !vertical && variant === "inline"
      ? INLINE_COLLAPSE[total <= 3 ? "few" : total === 4 ? "some" : "many"]
      : undefined

  const stepLabel = (index: number) => {
    const base = formatLabel(copy.stepLabel, { step: index + 1 })
    const title = steps[index]?.title
    const label = typeof title === "string" ? `${base}: ${title}` : base
    return steps[index]?.error ? `${label} (${copy.statusError})` : label
  }

  const nextLabel = isLast && canFinish ? copy.finish : copy.next

  const nav = (
    <StepperNav
      aria-label={ariaLabel ?? copy.navLabel}
      className={cn(layout.nav, navClassName)}
    >
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isLastItem = index === total - 1
        const loading = Boolean(
          step.loading || (isPending && stepNumber === current)
        )

        return (
          <StepperItem
            key={step.key ?? index}
            step={stepNumber}
            completed={Boolean(step.completed) || (finished && isLastItem)}
            disabled={
              Boolean(step.disabled) || (linear && !isReachable(stepNumber))
            }
            loading={loading}
            className={layout.item}
          >
            <StepperTrigger
              className={layout.trigger}
              aria-label={hasText ? undefined : stepLabel(index)}
            >
              <StepperIndicator
                className={indicatorClass(kind, {
                  size,
                  tone: completedTone,
                  error: Boolean(step.error),
                  loading: loading && stepNumber === current,
                  index,
                  total,
                })}
              >
                {kind === "circle" && (
                  <StepMarker
                    step={step}
                    index={index}
                    marker={marker}
                    iconSize={SIZE[size].icon}
                    showCompletedIcon={showCompletedIcon}
                  />
                )}
              </StepperIndicator>
              {hasText && (
                <StepText
                  step={step}
                  index={index}
                  variant={variant}
                  size={size}
                  vertical={vertical}
                  collapseClass={collapseClass}
                  showStepLabel={showStepLabel}
                  showStatus={showStatus}
                  copy={copy}
                />
              )}
            </StepperTrigger>

            {showSeparator && layout.separator !== null && !isLastItem && (
              <StepperSeparator
                className={cn(
                  "rounded-full bg-border transition-colors duration-300 ease-in-out",
                  layout.separator,
                  SEPARATOR_TONE[completedTone]
                )}
              />
            )}
          </StepperItem>
        )
      })}
    </StepperNav>
  )

  const nextButton = (
    <Button
      size="lg"
      onClick={() => void next()}
      disabled={isPending || finished || (isLast && !canFinish)}
      aria-busy={isPending || undefined}
    >
      {isPending && (
        <AppIcon
          icon="loader-circle"
          size={14}
          strokeWidth={2}
          className="animate-spin"
          data-icon="inline-start"
        />
      )}
      {nextLabel}
      {!isPending && !isLast && (
        <AppIcon
          icon="chevron-right"
          size={14}
          strokeWidth={2}
          data-icon="inline-end"
        />
      )}
    </Button>
  )

  const compactRow = controls === "compact" && !renderControls && (
    <div className="flex items-center justify-between gap-3">
      <Button
        variant="link"
        onClick={prev}
        disabled={isPending}
        className={cn("h-auto px-0 py-1", isFirst && "invisible")}
      >
        <AppIcon
          icon="chevron-left"
          size={14}
          strokeWidth={2}
          data-icon="inline-start"
        />
        {copy.back}
      </Button>
      <p aria-hidden className="text-sm font-medium tabular-nums">
        <span className="text-foreground">{current}</span>{" "}
        <span className="text-muted-foreground/60">/ {total}</span>
      </p>
    </div>
  )

  const footer = renderControls ? (
    <ControlsSlot render={renderControls} api={api} />
  ) : controls === "buttons" ? (
    <div className="flex items-center justify-between gap-2.5">
      <Button
        size="lg"
        variant="outline"
        onClick={prev}
        disabled={isFirst || isPending}
      >
        <AppIcon
          icon="chevron-left"
          size={14}
          strokeWidth={2}
          data-icon="inline-start"
        />
        {copy.back}
      </Button>
      {nextButton}
    </div>
  ) : controls === "compact" ? (
    <div className="flex justify-end">{nextButton}</div>
  ) : null

  const panel = hasContent && (
    <StepperPanel className={cn("text-sm", panelClassName)}>
      {steps.map(
        (step, index) =>
          step.content !== undefined && (
            <StepperContent
              key={step.key ?? index}
              value={index + 1}
              forceMount={keepMounted || undefined}
            >
              {step.content}
            </StepperContent>
          )
      )}
    </StepperPanel>
  )

  const hasBody = Boolean(panel || footer || compactRow)

  return (
    <div className={cn("@container/app-stepper w-full", SIZE[size].cssVar, className)}>
      <Stepper
        value={current}
        onValueChange={(step) => void goTo(step)}
        orientation={orientation}
        aria-busy={isPending || undefined}
        className={cn(
          "flex",
          vertical
            ? "gap-8 @max-md/app-stepper:flex-col @max-md/app-stepper:gap-6"
            : "flex-col gap-6"
        )}
      >
        {vertical ? (
          <>
            {nav}
            {hasBody && (
              <div className="flex min-w-0 flex-1 flex-col gap-5">
                {compactRow}
                {panel}
                {footer}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              {nav}
              {compactRow}
            </div>
            {panel}
            {footer}
          </>
        )}
        <p className="sr-only" aria-live="polite">
          {formatLabel(copy.progress, { current, total })}
          {typeof steps[current - 1]?.title === "string" &&
            `: ${steps[current - 1]?.title}`}
        </p>
      </Stepper>
    </div>
  )
}
