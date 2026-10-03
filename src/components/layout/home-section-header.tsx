'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import AppIcon from '@/components/general/app-icon'
import { cn } from '@/lib/utils'

interface HomeSectionHeaderProps {
  title: string
  /** Dropdown / filter bên phải. */
  control?: ReactNode
  /** Link “Xem tất cả”. */
  viewAllHref?: string
  viewAllLabel?: string
  className?: string
}

/** Tiêu đề section trang chủ: title + control hoặc “Xem tất cả”. */
export function HomeSectionHeader({
  title,
  control,
  viewAllHref,
  viewAllLabel = 'Xem tất cả',
  className,
}: HomeSectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">{title}</h2>
      {control ??
        (viewAllHref ? (
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-0.5 text-sm font-medium text-primary"
          >
            {viewAllLabel}
            <AppIcon icon="chevron-right" className="size-4" />
          </Link>
        ) : null)}
    </div>
  )
}
