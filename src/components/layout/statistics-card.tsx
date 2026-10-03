'use client'

import { memo } from 'react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import AppIcon, { type IconName } from '@/components/general/app-icon'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

/**
 * Ô chỉ số dashboard.
 *
 * - `default`: thẻ admin (huy hiệu góc, sparkline) — desktop.
 * - `soft`: thẻ trang chủ mobile (nền xanh nhạt, icon trái, không sparkline).
 */

const TONE_TEXT = {
  neutral: 'text-muted-foreground',
  success: 'text-primary',
  danger: 'text-destructive',
  warning: 'text-amber-600 dark:text-amber-500',
  info: 'text-sky-600 dark:text-sky-400',
} as const

const TONE_BG = {
  neutral: 'bg-muted',
  success: 'bg-primary/10',
  danger: 'bg-destructive/10',
  warning: 'bg-amber-500/10 dark:bg-amber-500/15',
  info: 'bg-sky-500/10 dark:bg-sky-500/15',
} as const

export type StatisticsCardTone = keyof typeof TONE_TEXT

export type StatisticsCardDelta = {
  value: number
  direction: 'up' | 'down' | 'flat'
  label?: string
}

export type StatisticsCardVariant = 'default' | 'soft'

export interface StatisticsCardProps {
  title: string
  value: string
  icon?: IconName
  bgClass?: string
  delta?: StatisticsCardDelta
  sparkline?: number[]
  tone?: StatisticsCardTone
  hint?: string
  loading?: boolean
  className?: string
  variant?: StatisticsCardVariant
}

const DELTA_ICON: Record<StatisticsCardDelta['direction'], IconName> = {
  up: 'arrow-up-right',
  down: 'arrow-down-right',
  flat: 'chevron-right',
}

function DeltaBadge({ delta, tone }: { delta: StatisticsCardDelta; tone: StatisticsCardTone }) {
  return (
    <span className={cn('flex items-center gap-0.5 text-xs font-medium', TONE_TEXT[tone])}>
      <AppIcon icon={DELTA_ICON[delta.direction]} size={13} />
      {delta.value}%
      {delta.label && <span className="ml-1 font-normal text-muted-foreground">{delta.label}</span>}
    </span>
  )
}

function Sparkline({ data, tone }: { data: number[]; tone: StatisticsCardTone }) {
  const points = data.map((value, index) => ({ index, value }))

  return (
    <div className={cn('h-12 w-full', TONE_TEXT[tone])}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <Area
            type="monotone"
            dataKey="value"
            stroke="currentColor"
            strokeWidth={1.5}
            fill="currentColor"
            fillOpacity={0.12}
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function IconBadge({
  icon,
  tone,
  bgClass,
}: {
  icon: IconName
  tone: StatisticsCardTone
  bgClass?: string
}) {
  return (
    <div
      className={cn(
        'absolute -top-6 -right-6 flex size-16 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110 sm:size-24',
        bgClass ?? TONE_BG[tone],
      )}
    >
      <AppIcon
        icon={icon}
        className={cn('relative z-10 mt-3 mr-3 size-4 sm:mt-2 sm:mr-2 sm:size-6', TONE_TEXT[tone])}
      />
    </div>
  )
}

const StatisticsCard = ({
  title,
  value,
  icon,
  bgClass,
  delta,
  sparkline,
  tone = 'neutral',
  hint,
  loading = false,
  className,
  variant = 'default',
}: StatisticsCardProps) => {
  if (variant === 'soft') {
    return (
      <article
        className={cn(
          'flex items-start gap-3 rounded-2xl bg-primary/8 px-3.5 py-3.5 dark:bg-primary/15',
          className,
        )}
      >
        {icon && !loading ? (
          <span
            className={cn(
              'mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl',
              bgClass ?? 'bg-primary/15 text-primary',
            )}
          >
            <AppIcon icon={icon} className="size-5 text-primary" />
          </span>
        ) : null}

        <div className="min-w-0 flex-1">
          {loading ? (
            <>
              <Skeleton className="mb-1.5 h-6 w-20" />
              <Skeleton className="h-3.5 w-16" />
            </>
          ) : (
            <>
              <p className="text-lg font-bold leading-tight tracking-tight text-brand-secondary tabular-nums sm:text-xl">
                {value}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{title}</p>
              {delta ? (
                <div className="mt-1">
                  <DeltaBadge delta={delta} tone={tone} />
                </div>
              ) : null}
            </>
          )}
        </div>
      </article>
    )
  }

  return (
    <article
      className={cn(
        'group relative flex flex-col gap-3 overflow-hidden rounded-lg bg-card p-4 shadow-lg ring-1 ring-foreground/10',
        className,
      )}
    >
      {icon && !loading && <IconBadge icon={icon} tone={tone} bgClass={bgClass} />}

      <h3 className="relative z-10 max-w-[70%] text-xs font-medium tracking-tight text-muted-foreground">
        {title}
      </h3>

      {loading ? (
        <>
          <Skeleton className="h-7 w-24" />
          {sparkline && <Skeleton className="h-12 w-full" />}
          {hint && <Skeleton className="h-3 w-32" />}
        </>
      ) : (
        <>
          <div className="relative z-10 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <p className="text-2xl leading-7 font-semibold tracking-tight whitespace-nowrap tabular-nums">
              {value}
            </p>
            {delta && <DeltaBadge delta={delta} tone={tone} />}
          </div>

          {sparkline && sparkline.length > 1 && (
            <div className="-mx-4 -mb-4">
              <Sparkline data={sparkline} tone={tone} />
            </div>
          )}

          {hint && <p className="text-xs leading-4 text-muted-foreground">{hint}</p>}
        </>
      )}
    </article>
  )
}

export default memo(StatisticsCard)
