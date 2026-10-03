import { memo } from "react"
import { cn } from "@/lib/utils"
import AppTitle from "./app-title"

interface HeadingAppProps {
  /** Tiêu đề chính của trang */
  title: string
  /** Mô tả ngắn bên dưới tiêu đề */
  description?: string
  /** Class bổ sung cho wrapper */
  className?: string
}

/**
 * AppHeading — Page heading dùng chung cho mọi feature.
 *
 * Usage:
 * ```tsx
 * <AppHeading
 *   title="Đồng bộ MyHome"
 *   description="Quản lý và đồng bộ dữ liệu merchant từ hệ thống MyHome."
 * />
 * ```
 */
const AppHeading = memo(({ title, description, className }: HeadingAppProps) => {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <AppTitle level={3}>{title}</AppTitle>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
})

AppHeading.displayName = "AppHeading"

export default AppHeading
