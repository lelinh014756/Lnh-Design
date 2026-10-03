import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import StatisticsCard, { type StatisticsCardVariant } from './statistics-card'

const SKELETON_COUNT = 4

interface StatisticsCardGridProps {
  children?: ReactNode
  loading?: boolean
  className?: string
  /** `soft` = lưới 2×2 trang chủ mobile. */
  variant?: StatisticsCardVariant
}

export function StatisticsCardGrid({
  children,
  loading,
  className,
  variant = 'default',
}: StatisticsCardGridProps) {
  return (
    <div
      className={cn(
        variant === 'soft'
          ? 'grid grid-cols-2 gap-2.5 sm:gap-3'
          : 'grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-4',
        className,
      )}
    >
      {loading
        ? Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <StatisticsCard
              key={index}
              loading
              title=""
              value=""
              variant={variant}
              sparkline={variant === 'default' ? [0, 0] : undefined}
            />
          ))
        : children}
    </div>
  )
}
