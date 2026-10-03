import type { ComponentProps } from "react"
import {
  ArrowDownRight,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Box,
  Bug,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  CircleCheckBig,
  CircleDot,
  CircleHelp,
  CircleX,
  Clock,
  Code,
  Component,
  Copy,
  Ellipsis,
  EllipsisVertical,
  ExternalLink,
  Eye,
  EyeOff,
  FileSignature,
  Filter,
  Heart,
  Image as ImageIcon,
  Info,
  Languages,
  Layers,
  LayoutGrid,
  List,
  LoaderCircle,
  Lock,
  LockOpen,
  LogOut,
  type LucideIcon,
  Maximize,
  Minus,
  Monitor,
  Moon,
  Package,
  Palette,
  PanelLeft,
  PanelLeftClose,
  PanelRight,
  Pencil,
  Plus,
  Power,
  PowerOff,
  Printer,
  ReceiptText,
  RefreshCw,
  Rocket,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Sun,
  SwatchBook,
  Tablet,
  Terminal,
  Timer,
  Trash2,
  TrendingDown,
  TrendingUp,
  Type,
  User,
  Wallet,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Bảng tra icon dùng chung. Map tĩnh thay vì đọc cả `icons` của lucide: tra
 * động kéo trọn ~2000 icon vào bundle, còn `DynamicIcon` chạy trên `lazy()`
 * nên không dùng được trong Server Component. Thêm icon mới = thêm một dòng.
 */
export const APP_ICONS = {
  "arrow-down-right": ArrowDownRight,
  "arrow-left-right": ArrowLeftRight,
  "arrow-right": ArrowRight,
  "arrow-up-right": ArrowUpRight,
  "book-open": BookOpen,
  box: Box,
  bug: Bug,
  check: Check,
  "chevron-down": ChevronDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "chevron-up": ChevronUp,
  "circle-alert": CircleAlert,
  "circle-check": CircleCheck,
  "circle-check-big": CircleCheckBig,
  "circle-dot": CircleDot,
  "circle-help": CircleHelp,
  "circle-x": CircleX,
  clock: Clock,
  code: Code,
  component: Component,
  copy: Copy,
  ellipsis: Ellipsis,
  "ellipsis-vertical": EllipsisVertical,
  "external-link": ExternalLink,
  eye: Eye,
  "eye-off": EyeOff,
  "file-signature": FileSignature,
  filter: Filter,
  heart: Heart,
  image: ImageIcon,
  info: Info,
  languages: Languages,
  layers: Layers,
  "layout-grid": LayoutGrid,
  list: List,
  "loader-circle": LoaderCircle,
  lock: Lock,
  "lock-open": LockOpen,
  "log-out": LogOut,
  maximize: Maximize,
  minus: Minus,
  monitor: Monitor,
  moon: Moon,
  package: Package,
  palette: Palette,
  "panel-left": PanelLeft,
  "panel-left-close": PanelLeftClose,
  "panel-right": PanelRight,
  pencil: Pencil,
  plus: Plus,
  power: Power,
  "power-off": PowerOff,
  printer: Printer,
  "receipt-text": ReceiptText,
  "refresh-cw": RefreshCw,
  rocket: Rocket,
  search: Search,
  settings: Settings,
  shield: Shield,
  "shield-check": ShieldCheck,
  smartphone: Smartphone,
  sparkles: Sparkles,
  star: Star,
  sun: Sun,
  "swatch-book": SwatchBook,
  tablet: Tablet,
  terminal: Terminal,
  timer: Timer,
  "trash-2": Trash2,
  "trending-down": TrendingDown,
  "trending-up": TrendingUp,
  type: Type,
  user: User,
  wallet: Wallet,
  x: X,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof APP_ICONS

interface AppIconProps extends Omit<ComponentProps<"svg">, "ref"> {
  /** Tên trong `APP_ICONS`, hoặc component lucide truyền thẳng. */
  icon: IconName | LucideIcon
  size?: number | string
  strokeWidth?: number
}

const AppIcon = ({
  icon,
  size = 20,
  strokeWidth = 1.75,
  className,
  ...props
}: AppIconProps) => {
  const Resolved = typeof icon === "string" ? APP_ICONS[icon] : icon

  if (!Resolved) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[AppIcon] Không có icon "${String(icon)}" trong APP_ICONS.`)
    }
    return null
  }

  return (
    <Resolved
      width={size}
      height={size}
      strokeWidth={strokeWidth}
      className={cn("shrink-0 transition-colors duration-200", className)}
      {...props}
    />
  )
}

export default AppIcon
