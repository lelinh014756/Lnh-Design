import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

import type { IconName } from "./icon-providers/icon-names"
// import { hugeiconsProvider as provider } from "./icon-providers/hugeicons-provider"
import { lucideProvider as provider } from "./icon-providers/lucide-provider"

/**
 * Đổi thư viện icon = đổi dòng import `provider` ở trên. Mỗi provider map đủ
 * `ICON_NAMES` sang icon của thư viện tương ứng (tsc báo nếu thiếu tên), nên
 * chỗ gọi chỉ dùng tên — không import thẳng thư viện icon ngoài `icon-providers/`.
 * Provider chưa active không được import nên không vào bundle.
 */
export { ICON_NAMES, type IconName } from "./icon-providers/icon-names"

export const ICON_PROVIDER = {
  id: provider.id,
  defaultStrokeWidth: provider.defaultStrokeWidth,
} as const

interface AppIconProps extends Omit<ComponentProps<"svg">, "ref"> {
  icon: IconName
  size?: number | string
  strokeWidth?: number
}

const AppIcon = ({
  icon,
  size = 20,
  strokeWidth = provider.defaultStrokeWidth,
  className,
  ...props
}: AppIconProps) => {
  const source = provider.icons[icon]

  if (!source) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[AppIcon] Icon "${String(icon)}" chưa được map trong provider "${provider.id}".`)
    }
    return null
  }

  const labelled = props["aria-label"] != null || props["aria-labelledby"] != null

  return provider.render(source, {
    size,
    strokeWidth,
    "aria-hidden": labelled ? undefined : true,
    "data-icon": icon,
    className: cn("shrink-0 transition-colors duration-200", className),
    ...props,
  })
}

export default AppIcon
