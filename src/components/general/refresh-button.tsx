/**
 * Refresh button with cooldown countdown.
 * Extracted from button-app preset="refresh" for isolated, focused behavior.
 */

import { Button, buttonVariants } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import { AppTooltip } from "../data-display"
import type { VariantProps } from "class-variance-authority"

export interface ButtonRefreshProps {
  label?: React.ReactNode
  loading?: boolean
  fetching?: boolean
  loadingText?: string
  cooldown?: number
  disabled?: boolean
  className?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  icon?: React.ComponentType<{ className?: string }>
  /** Display mode: 'icon' = icon only, 'text' = icon+text, 'auto' = use showButtonName */
  display?: "icon" | "text" | "auto"
  /** Show text label alongside icon (only used when display='auto') */
  showButtonName?: boolean
}

export function RefreshButton({
  label = "Làm mới",
  loading = false,
  fetching = false,
  cooldown = 5,
  disabled,
  className,
  showButtonName = false,
  onClick,
  size,
  display = "auto",
  icon: CustomIcon,
}: ButtonRefreshProps & VariantProps<typeof buttonVariants>) {
  const [countdown, setCountdown] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearCountdownInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startCountdownInterval = useCallback(() => {
    if (intervalRef.current) return
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          intervalRef.current = null
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  // Pause interval while loading/fetching; resume when both finish (if countdown still active)
  useEffect(() => {
    if (countdown === 0) return
    if (loading || fetching) {
      clearCountdownInterval()
    } else {
      startCountdownInterval()
    }
  }, [
    loading,
    fetching,
    countdown,
    clearCountdownInterval,
    startCountdownInterval,
  ])

  // Clean up on unmount
  useEffect(() => {
    return () => clearCountdownInterval()
  }, [clearCountdownInterval])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // Only start countdown when not loading/fetching
      if (cooldown > 0 && !loading && !fetching) {
        clearCountdownInterval()
        setCountdown(cooldown)
        startCountdownInterval()
      }
      onClick?.(e)
    },
    [
      cooldown,
      loading,
      fetching,
      onClick,
      clearCountdownInterval,
      startCountdownInterval,
    ]
  )

  // Show countdown UI only when not loading/fetching (both take visual priority)
  const isCoolingDown = countdown > 0 && !loading && !fetching
  const Icon = CustomIcon ?? RefreshCw

  // Determine display mode: explicit display prop overrides showButtonName
  const showText = display === "text" || (display === "auto" && showButtonName)

  return (
    <AppTooltip text={label} disabled={showText}>
      <Button
        variant="outline"
        size={size || (showText ? "lg" : "icon-lg")}
        disabled={loading || disabled || fetching || isCoolingDown}
        className={cn("btn-animate gap-2", className)}
        onClick={handleClick}
      >
        {loading ? (
          <Spinner />
        ) : isCoolingDown ? (
          <span className="text-xs">{countdown}s</span>
        ) : (
          <Icon className={cn(fetching && "animate-spin")} />
        )}
        {showText && label}
      </Button>
    </AppTooltip>
  )
}

export default memo(RefreshButton)
