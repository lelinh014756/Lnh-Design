import type { ReactNode } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { APP_PAGE_IMAGES } from '@/config/assets'

interface PageBackgroundProps {
  children: ReactNode
  /** Đường dẫn ảnh nền. Mặc định `APP_PAGE_IMAGES.background`. */
  src?: string
  className?: string
  /** Chỉ hiện nền dưới breakpoint `lg` (trang chủ mobile/tablet). */
  mobileOnly?: boolean
}

/**
 * Nền trang: ảnh ghim `fixed` theo viewport — nội dung cuộn, ảnh đứng yên.
 * `mix-blend-multiply` để PNG trong suốt đóng dấu lên nền trắng.
 */
export function PageBackground({
  children,
  src = APP_PAGE_IMAGES.background,
  className,
  mobileOnly = false,
}: PageBackgroundProps) {
  return (
    <div className={cn('relative min-h-full', className)}>
      <div
        className={cn(
          'pointer-events-none fixed inset-0 z-0 overflow-hidden bg-white',
          mobileOnly && 'lg:hidden',
        )}
        aria-hidden
      >
        <Image
          src={src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top mix-blend-multiply"
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
