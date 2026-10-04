import * as React from "react"
import AppIcon from "@/components/general/app-icon"
import { AlertDialogStatus } from "../feedback"
import { PingIndicator } from "../feedback"
import { Spinner } from "@/components/ui/spinner"

// Utility hợp nhất classnames
function cn(...classes: (string | boolean | undefined | null)[]) {
    return classes.filter(Boolean).join(" ")
}

export type SwitchSize = "sm" | "md" | "lg"

export interface StatusSwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
    checked?: boolean
    defaultChecked?: boolean
    onCheckedChange?: (checked: boolean) => void | Promise<void>
    size?: SwitchSize
    disabled?: boolean
    loading?: boolean
    showLabel?: boolean
    labelPosition?: "left" | "right"
    activeText?: string
    inactiveText?: string
    activeColor?: "emerald" | "blue" | "brand"
    requireConfirm?: boolean
    confirmTitle?: string
    confirmDescription?: string
}

export const StatusSwitch = React.forwardRef<HTMLButtonElement, StatusSwitchProps>(
    (
        {
            checked: controlledChecked,
            defaultChecked = false,
            onCheckedChange,
            size = "md",
            disabled = false,
            loading: controlledLoading = false,
            showLabel = false,
            labelPosition = "right",
            activeText = "Hoạt động",
            inactiveText = "Ngưng hoạt động",
            activeColor = "emerald",
            requireConfirm = false,
            confirmTitle = "Xác nhận thay đổi trạng thái?",
            confirmDescription = "Hành động này sẽ thay đổi quyền hạn hoạt động của đối tượng trong hệ thống.",
            className,
            ...props
        },
        ref
    ) => {
        // Uncontrolled & Controlled state handling
        const [uncontrolledChecked, setUncontrolledChecked] = React.useState<boolean>(defaultChecked)
        const [internalLoading, setInternalLoading] = React.useState<boolean>(false)
        const [showConfirmModal, setShowConfirmModal] = React.useState<boolean>(false)

        const isChecked = controlledChecked !== undefined ? controlledChecked : uncontrolledChecked
        const isLoading = controlledLoading || internalLoading

        // Config Kích thước Switch Track & Thumb
        const sizeConfig = {
            sm: {
                track: "h-5 w-9 min-w-[2.25rem]",
                thumb: "h-3.5 w-3.5 data-[state=checked]:translate-x-4",
                icon: "h-2.5 w-2.5",
                textSize: "text-xs",
                dotSize: "h-1.5 w-1.5",
            },
            md: {
                track: "h-6 w-11 min-w-[2.75rem]",
                thumb: "h-[18px] w-[18px] data-[state=checked]:translate-x-[20px]",
                icon: "h-3 w-3",
                textSize: "text-sm",
                dotSize: "h-2 w-2",
            },
            lg: {
                track: "h-7 w-14 min-w-[3.5rem]",
                thumb: "h-[22px] w-[22px] data-[state=checked]:translate-x-[28px]",
                icon: "h-3.5 w-3.5",
                textSize: "text-base",
                dotSize: "h-2.5 w-2.5",
            },
        }[size]

        // Style màu sắc khi Active
        const activeBgColor = {
            emerald: "data-[state=checked]:bg-emerald-500 dark:data-[state=checked]:bg-emerald-500",
            blue: "data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-blue-500",
            brand: "data-[state=checked]:bg-[hsl(var(--primary))]",
        }[activeColor]

        const activeTextColor = {
            emerald: "text-emerald-700 dark:text-emerald-400",
            blue: "text-blue-700 dark:text-blue-400",
            brand: "text-primary",
        }[activeColor]

        const executeToggle = async () => {
            const nextState = !isChecked

            if (controlledChecked === undefined) {
                setUncontrolledChecked(nextState)
            }

            if (onCheckedChange) {
                try {
                    const result = onCheckedChange(nextState)
                    if (result && typeof (result as any).then === "function") {
                        setInternalLoading(true)
                        await result
                    }
                } catch (error) {
                    if (controlledChecked === undefined) {
                        setUncontrolledChecked(isChecked)
                    }
                    console.error("Failed to update status:", error)
                } finally {
                    setInternalLoading(false)
                }
            }
        }

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault()
            e.stopPropagation()

            if (disabled || isLoading) return

            if (requireConfirm) {
                setShowConfirmModal(true)
            } else {
                executeToggle()
            }
        }

        const handleConfirm = () => {
            setShowConfirmModal(false)
            executeToggle()
        }

        const renderLabel = () => {
            if (!showLabel) return null

            return (
                <span
                    className={cn(
                        "inline-flex items-center gap-1.5 font-medium transition-colors select-none",
                        sizeConfig.textSize,
                        isChecked ? activeTextColor : "text-slate-500 dark:text-slate-400",
                        disabled && "opacity-50"
                    )}
                >
                    <PingIndicator
                        variant="success"
                        disabled={!isChecked || disabled}
                    />
                    {isChecked ? activeText : inactiveText}
                </span>
            )
        }

        return (
            <div className={cn("inline-flex items-center gap-2.5", className)}>
                {showLabel && labelPosition === "left" && renderLabel()}

                <button
                    ref={ref}
                    type="button"
                    role="switch"
                    aria-checked={isChecked}
                    data-state={isChecked ? "checked" : "unchecked"}
                    disabled={disabled || isLoading}
                    onClick={handleClick}
                    className={cn(
                        "peer relative inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
                        sizeConfig.track,
                        "bg-slate-200 dark:bg-slate-700",
                        activeBgColor
                    )}
                    {...props}
                >
                    {/* Thumb element */}
                    <span
                        data-state={isChecked ? "checked" : "unchecked"}
                        className={cn(
                            "pointer-events-none flex items-center justify-center rounded-full bg-white dark:bg-slate-100 shadow-md ring-0 transition-transform duration-200 ease-in-out dark:text-slate-900",
                            sizeConfig.thumb
                        )}
                    >
                        {isLoading ? (
                            <Spinner className={sizeConfig.icon} />
                        ) : isChecked ? (
                            <AppIcon icon="check" strokeWidth={3} className={cn("text-emerald-600", sizeConfig.icon)} />
                        ) : (
                            <AppIcon icon="x" strokeWidth={2.5} className={cn("text-slate-400", sizeConfig.icon)} />
                        )}
                    </span>
                </button>

                {showLabel && labelPosition === "right" && renderLabel()}

                {/* Modal xác nhận */}
                {requireConfirm && (
                    <AlertDialogStatus
                        state="warning"
                        open={showConfirmModal}
                        onOpenChange={(open) => {
                            if (!isLoading) setShowConfirmModal(open)
                        }}
                        title={confirmTitle}
                        description={confirmDescription}
                        confirmText="Xác nhận thay đổi"
                        cancelText="Hủy bỏ"
                        onConfirm={handleConfirm}
                        onCancel={() => setShowConfirmModal(false)}
                        isLoading={isLoading}
                        trigger={<span className="sr-only" />}
                    />
                )}
            </div>
        )
    }
)
StatusSwitch.displayName = "StatusSwitch"