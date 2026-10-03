"use client"

import { Button } from "@/components/ui/button"
import { AppTooltip } from "../data-display"
import { useTheme } from "next-themes"
import { AppIcon } from "."
import { memo, useSyncExternalStore } from "react"
import { LaptopMinimalIcon } from "lucide-react"

/** Không có gì để theo dõi — chỉ cần phân biệt "trước/sau khi mount". */
const noopSubscribe = () => () => {}
const readMounted = () => true
const readMountedOnServer = () => false

/**
 * `theme` từ next-themes là `undefined` ở lần render đầu (server + client
 * trước khi mount) — so sánh `===` với nó trước đây không khớp nhánh nào,
 * nên server không render icon gì trong khi client (sau mount) lại render
 * icon Laptop (mặc định "system"). Hai bản HTML khác nhau này làm hydration
 * fail cho TOÀN CÂY, không chỉ riêng nút này — kéo theo việc React render
 * lại sạch phía client và xoá luôn các thuộc tính script khác đã kịp gắn lên
 * <html> trước khi hydrate (vd data-sidebar-style/data-brand).
 *
 * Cờ `mounted` giữ output giống hệt nhau ở lần render đầu của cả hai môi
 * trường (Laptop icon), chỉ chuyển sang icon đúng theme sau khi mount xong —
 * đúng pattern next-themes khuyến nghị.
 *
 * Dùng `useSyncExternalStore` thay vì `useState` + `useEffect(() => setState)`:
 * gọi `setState` đồng bộ ngay trong effect kích hoạt cascading render và bị
 * `react-hooks/set-state-in-effect` chặn ở lint. `getServerSnapshot` cho
 * server/lần render đầu, `getSnapshot` cho các lần sau — không có gì để theo
 * dõi nên `subscribe` là no-op.
 */
const ModeToggleButton = () => {
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(noopSubscribe, readMounted, readMountedOnServer)

  const handleToggle = () => {
    if (theme === 'system') setTheme('light')
    else if (theme === 'light') setTheme('dark')
    else setTheme('system')
  }

  return (
    <AppTooltip text="Chế độ hiển thị">
      <Button variant="outline" size="icon-lg" onClick={handleToggle}>
        {mounted && theme === 'light' && <AppIcon icon="sun" className="h-5 w-5" />}
        {mounted && theme === 'dark' && <AppIcon icon="moon" className="h-5 w-5" />}
        {(!mounted || theme === 'system') && (
          <LaptopMinimalIcon className="h-5 w-5 text-current" strokeWidth={1.5} />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </AppTooltip>
  )
}

export default memo(ModeToggleButton);
