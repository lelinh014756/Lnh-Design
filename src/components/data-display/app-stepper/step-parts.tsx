"use client"

import type { ReactNode } from "react"

import AppIcon from "@/components/general/app-icon"
import { Badge } from "@/components/ui/badge"
import { useStepItem } from "@/components/ui/stepper"
import { cn } from "@/lib/utils"

import { formatLabel } from "./labels"
import { SIZE } from "./styles"
import type {
  AppStepperApi,
  AppStepperLabels,
  AppStepperSize,
  AppStepperStep,
  AppStepperVariant,
} from "./types"

export function StepMarker({
  step,
  index,
  marker,
  iconSize,
  showCompletedIcon,
}: {
  step: AppStepperStep
  index: number
  marker: "number" | "dot"
  iconSize: number
  showCompletedIcon: boolean
}) {
  const { state, isLoading } = useStepItem()

  if (isLoading) {
    return (
      <AppIcon
        icon="loader-circle"
        size={iconSize}
        strokeWidth={2}
        className="animate-spin"
      />
    )
  }
  if (step.error) {
    return <AppIcon icon="circle-alert" size={iconSize} strokeWidth={2} />
  }
  if (state === "completed" && showCompletedIcon) {
    return <AppIcon icon="check" size={iconSize} strokeWidth={2.5} />
  }
  if (step.icon) {
    return <AppIcon icon={step.icon} size={iconSize} strokeWidth={1.75} />
  }
  if (marker === "dot") {
    return state === "active" ? (
      <span className="block size-1.5 rounded-full bg-current" />
    ) : null
  }
  return <>{index + 1}</>
}

function StepStatus({
  error,
  copy,
}: {
  error?: boolean
  copy: AppStepperLabels
}) {
  const { state, isLoading } = useStepItem()

  if (error) return <Badge variant="destructive">{copy.statusError}</Badge>
  if (isLoading) return <Badge variant="secondary">{copy.statusLoading}</Badge>
  if (state === "active") return <Badge>{copy.statusActive}</Badge>
  if (state === "completed") {
    return (
      <Badge
        variant="outline"
        className="border-green-600/25 text-green-700 dark:text-green-400"
      >
        {copy.statusCompleted}
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="text-muted-foreground">
      {copy.statusPending}
    </Badge>
  )
}

export function StepText({
  step,
  index,
  variant,
  size,
  vertical,
  collapseClass,
  showStepLabel,
  showStatus,
  copy,
}: {
  step: AppStepperStep
  index: number
  variant: AppStepperVariant
  size: AppStepperSize
  vertical: boolean
  collapseClass?: string
  showStepLabel: boolean
  showStatus: boolean
  copy: AppStepperLabels
}) {
  const centered = variant === "centered"

  return (
    <span
      className={cn(
        "flex min-w-0 flex-col",
        centered ? "items-center" : "items-start",
        size === "lg" || variant === "stacked" ? "gap-1" : "gap-0.5",
        vertical && "min-h-[var(--app-stepper-ind)] justify-center",
        collapseClass
      )}
    >
      {showStepLabel && (
        <span className="text-[0.625rem] leading-4 font-semibold tracking-wide text-muted-foreground uppercase">
          {formatLabel(copy.stepLabel, { step: index + 1 })}
        </span>
      )}
      {(step.title || step.badge) && (
        <span className="flex max-w-full items-center gap-1.5">
          {step.title && (
            <span
              data-slot="stepper-title"
              className={cn(
                SIZE[size].title,
                "tracking-tight",
                size !== "lg" && "font-medium",
                variant === "inline" && !vertical && "whitespace-nowrap",
                step.error
                  ? "text-destructive"
                  : "text-foreground group-data-[state=inactive]/step:text-muted-foreground"
              )}
            >
              {step.title}
            </span>
          )}
          {step.badge}
        </span>
      )}
      {step.description && (
        <span
          data-slot="stepper-description"
          className={cn(
            "text-xs leading-4 text-muted-foreground",
            (variant === "stacked" || centered) && "@max-md/app-stepper:sr-only"
          )}
        >
          {step.description}
        </span>
      )}
      {showStatus && <StepStatus error={step.error} copy={copy} />}
      {step.error && !showStatus && (
        <span className="sr-only">{copy.statusError}</span>
      )}
    </span>
  )
}

// Rendered as its own element instead of calling `renderControls(api)` inline:
// the api's handlers close over refs, which `react-hooks/refs` rejects when
// passed to a call during render. As a side benefit the slot may use hooks.
export function ControlsSlot({
  render,
  api,
}: {
  render: (api: AppStepperApi) => ReactNode
  api: AppStepperApi
}) {
  return render(api)
}
