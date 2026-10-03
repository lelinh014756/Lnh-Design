import { type ReactNode } from "react"
import { cn } from "@/lib"
import AppHeading from "@/components/general/app-heading"
interface AppWrapperProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
  actions?: ReactNode
  isTableShell?: boolean
}
export function ShowcaseContentShell({
  title,
  description,
  children,
  className,
  actions,
  isTableShell = false,
}: AppWrapperProps) {
  const Children = isTableShell ? (
    <div className="h-full min-h-0 flex-1">{children}</div>
  ) : (
    children
  )

  return (
    <div
      className={cn(
        "space-y-4 p-3",
        // Không tự cuộn: `ShowcaseShell` đã có vùng cuộn, cuộn lồng ở đây làm
        // hỏng `position: sticky` của mục lục.
        isTableShell ? "flex h-full flex-col" : "min-h-full",
        className
      )}
    >
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <AppHeading title={title} description={description} />
          <div className="flex items-center gap-2">{actions} </div>
        </div>
      )}
      {Children}
    </div>
  )
}
