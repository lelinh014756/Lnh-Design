
import * as React from 'react'

import { type HTMLMotionProps, type Transition, motion, AnimatePresence } from 'motion/react'

import { cn } from '@/lib/utils'
import {
    ToggleGroup as BaseToggleGroup,
    ToggleGroupItem as BaseToggleGroupItem
} from './toggle-group'

type MotionToggleGroupContextProps = {
    type?: 'single' | 'multiple'
    transition?: Transition
    activeClassName?: string
    globalId: string
}

const MotionToggleGroupContext = React.createContext<MotionToggleGroupContextProps | undefined>(undefined)

const useMotionToggleGroup = (): MotionToggleGroupContextProps => {
    const context = React.useContext(MotionToggleGroupContext)

    if (!context) {
        throw new Error('useMotionToggleGroup must be used within a ToggleGroup')
    }

    return context
}

type ToggleGroupProps = React.ComponentProps<typeof BaseToggleGroup> & {
    transition?: Transition
    activeClassName?: string
}

function ToggleGroup({
    className,
    variant,
    size,
    children,
    transition = { type: 'spring', bounce: 0, stiffness: 200, damping: 25 },
    activeClassName,
    ...props
}: ToggleGroupProps) {
    const globalId = React.useId()

    // For single type, we manage value in local state so clicking the active
    // item cannot deselect it (Radix would otherwise set value to "").
    const isSingle = props.type === 'single'

    const singleProps = props as React.ComponentProps<typeof BaseToggleGroup> & {
        type: 'single'
        value?: string
        defaultValue?: string
        onValueChange?: (value: string) => void
    }

    const [singleValue, setSingleValue] = React.useState<string>(singleProps.defaultValue ?? singleProps.value ?? '')

    // Sync controlled value — render-phase update to keep in sync with prop
    if (isSingle && singleProps.value !== undefined && singleProps.value !== singleValue) {
        setSingleValue(singleProps.value)
    }

    const handleSingleValueChange = React.useCallback(
        (value: string) => {
            if (!value) return // ignore deselect
            setSingleValue(value)
            singleProps.onValueChange?.(value)
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [singleProps.onValueChange]
    )

    return (
        <MotionToggleGroupContext.Provider
            value={{
                type: props.type,
                transition,
                activeClassName,
                globalId
            }}
        >
            {isSingle ? (
                <BaseToggleGroup
                    className={cn('relative', className)}
                    variant={variant}
                    size={size}
                    type='single'
                    value={singleValue}
                    onValueChange={handleSingleValueChange}
                    disabled={singleProps.disabled}
                    rovingFocus={singleProps.rovingFocus}
                    orientation={singleProps.orientation}
                    dir={singleProps.dir}
                    loop={singleProps.loop}
                >
                    {children}
                </BaseToggleGroup>
            ) : (
                <BaseToggleGroup
                    className={cn('relative', className)}
                    variant={variant}
                    size={size}
                    {...(props as React.ComponentProps<typeof BaseToggleGroup>)}
                >
                    {children}
                </BaseToggleGroup>
            )}
        </MotionToggleGroupContext.Provider>
    )
}

type ToggleGroupItemProps = React.ComponentProps<typeof BaseToggleGroupItem> & {
    children?: React.ReactNode
    buttonProps?: HTMLMotionProps<'button'>
    spanProps?: React.ComponentProps<'span'>
}

function ToggleGroupItem({ ref, className, children, buttonProps, spanProps, ...props }: ToggleGroupItemProps) {
    const { activeClassName, transition, type, globalId } = useMotionToggleGroup()
    const itemRef = React.useRef<HTMLButtonElement | null>(null)

    React.useImperativeHandle(ref, () => itemRef.current as HTMLButtonElement)
    const [isActive, setIsActive] = React.useState(false)

    React.useEffect(() => {
        const node = itemRef.current

        if (!node) return

        const observer = new MutationObserver(() => {
            setIsActive(node.getAttribute('data-state') === 'on')
        })

        observer.observe(node, {
            attributes: true,
            attributeFilter: ['data-state']
        })
        setIsActive(node.getAttribute('data-state') === 'on')

        return () => observer.disconnect()
    }, [])

    return (
        <BaseToggleGroupItem
            ref={itemRef}
            {...props}
            asChild
            className={cn('relative hover:bg-transparent data-[state=on]:bg-transparent', className)}
        >
            <motion.button
                data-slot='toggle-group-item'
                initial={{ scale: 1 }}
                whileTap={{ scale: 0.9 }}
                {...buttonProps}
                className={cn('relative', buttonProps?.className)}
            >
                <span {...spanProps} data-state={isActive ? 'on' : 'off'} className={cn('relative z-1', spanProps?.className)}>
                    {children}
                </span>

                <AnimatePresence initial={false}>
                    {isActive && type === 'single' && (
                        <motion.span
                            layoutId={`active-toggle-group-item-${globalId}`}
                            data-slot='active-toggle-group-item'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={transition}
                            className={cn('bg-muted absolute inset-0 z-0 rounded-md', activeClassName)}
                        />
                    )}
                </AnimatePresence>
            </motion.button>
        </BaseToggleGroupItem>
    )
}

export { ToggleGroup, ToggleGroupItem, type ToggleGroupProps, type ToggleGroupItemProps }
