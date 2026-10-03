'use client'

import type { ReactNode } from 'react'
import AppIcon from '@/components/general/app-icon'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const DEFAULT_MIN_HEIGHT = 260
/** Trang chủ mobile: khung chart thấp hơn để vừa một màn hình. */
const HOME_MIN_HEIGHT_CAP = 200
const HOME_SKELETON_HEIGHT = 180

interface ChartCardProps {
  title: string
  description?: string
  control?: ReactNode
  /** Tóm tắt lớn phía trên chart (mobile home). */
  summary?: ReactNode
  children?: ReactNode
  loading?: boolean
  error?: Error | null
  onRetry?: () => void
  minHeight?: number
  className?: string
  /** `home` = thẻ trắng bo lớn, header gọn cho trang chủ mobile. */
  variant?: 'default' | 'home'
}

export function ChartCard({
  title,
  description,
  control,
  summary,
  children,
  loading,
  error,
  onRetry,
  minHeight = DEFAULT_MIN_HEIGHT,
  className,
  variant = 'default',
}: ChartCardProps) {
  const isHome = variant === 'home'
  const bodyMinHeight = isHome ? Math.min(minHeight, HOME_MIN_HEIGHT_CAP) : minHeight
  const skeletonMinHeight = isHome ? HOME_SKELETON_HEIGHT : minHeight

  return (
    <section
      className={cn(
        isHome
          ? 'rounded-3xl bg-white p-4 dark:bg-card'
          : 'rounded-lg bg-card shadow-sm ring-1 ring-foreground/10',
        className,
      )}
    >
      <header
        className={cn(
          'flex items-center justify-between gap-3',
          isHome ? 'mb-3' : 'rounded-t-lg border-b bg-primary/5 px-3 py-2',
        )}
      >
        <div className="min-w-0">
          <h3
            className={cn(
              'truncate tracking-tight',
              isHome ? 'text-base font-bold' : 'font-semibold',
            )}
          >
            {title}
          </h3>
          {description && !isHome && (
            <p className="mt-0.5 text-xs leading-4 text-muted-foreground">{description}</p>
          )}
        </div>
        {control && <div className="shrink-0">{control}</div>}
      </header>

      {summary && !loading && !error ? <div className="mb-3">{summary}</div> : null}

      <div
        style={{ minHeight: bodyMinHeight }}
        className={cn('flex flex-col', isHome ? 'max-h-56' : 'max-h-80 px-3 py-2')}
      >
        {error ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <AppIcon icon="circle-alert" size={20} className="text-destructive" />
            <p className="text-sm text-muted-foreground">{error.message}</p>
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                <AppIcon icon="refresh-cw" size={14} />
                Thử lại
              </Button>
            )}
          </div>
        ) : loading ? (
          <Skeleton className="flex-1" style={{ minHeight: skeletonMinHeight }} />
        ) : (
          children
        )}
      </div>
    </section>
  )
}
