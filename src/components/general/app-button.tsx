/**
 * App button with presets and intent styling.
 * Built on shadcn Button, adds loading state, icons, and preset styles.
 */

import { Button, buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import { memo, type JSX, type ComponentType } from "react";
import {
  Download,
  ListFilter,
  Pencil,
  Plus,
  Save,
  type LucideIcon,
} from "lucide-react";

export type ButtonPreset =
  | "add"
  | "edit"
  | "save"
  | "gradient"
  | "excel"
  | "filter";

export type ButtonIntent =
  | "success"
  | "warning"
  | "destructive"
  | "info";

export interface ButtonAppProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Show loading spinner with optional text. */
  loading?: boolean;
  /** Text to display while loading. */
  loadingText?: string;
  /** Custom icon component. Overrides preset icon. */
  icon?: LucideIcon;
  /** Preset style with associated icon. */
  preset?: ButtonPreset;
  /** Intent color for status indication. */
  intent?: ButtonIntent;
}

const presetIconMap: Record<ButtonPreset, ComponentType<{ className?: string }> | null> = {
  add: Plus,
  edit: Pencil,
  save: Save,
  filter: ListFilter,
  excel: Download,
  gradient: null,
};

const presetClassMap: Record<ButtonPreset, string> = {
  add: "",
  edit:
    "text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 dark:border-emerald-900/30 dark:bg-emerald-950/20",
  save: "",
  // Gradient dọc: primary (#6B952A) → xanh phụ (#0F3C04)
  gradient:
    "border-0 bg-gradient-to-b from-primary to-brand-secondary text-white shadow-sm hover:bg-gradient-to-b hover:from-primary/90 hover:to-brand-secondary/90 hover:text-white hover:opacity-95",
  filter: "",
  excel: "bg-green-600 text-white hover:bg-green-700",
};

const intentOutlineClassMap: Record<ButtonIntent, string> = {
  success: "bg-green-500/10 border-green-500/50 text-green-600 dark:text-green-400 hover:bg-green-500/20",
  warning: "bg-amber-500/10 border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20",
  destructive: "bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-400 hover:bg-red-500/20",
  info: "bg-blue-500/10 border-blue-500/50 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20",
};

const intentGhostClassMap: Record<ButtonIntent, string> = {
  success: "text-green-600 hover:text-green-700 hover:bg-green-500/10 dark:text-green-400",
  warning: "text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 dark:text-amber-400",
  destructive: "text-red-600 hover:text-red-700 hover:bg-red-500/10 dark:text-red-400",
  info: "text-blue-600 hover:text-blue-700 hover:bg-blue-500/10 dark:text-blue-400",
};

const intentSolidClassMap: Record<ButtonIntent, string> = {
  success: "bg-green-600 text-white hover:bg-green-700",
  warning: "bg-amber-500 text-white hover:bg-amber-600",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  info: "bg-blue-600 text-white hover:bg-blue-700",
};

export function ButtonApp({
  children,
  loading = false,
  loadingText = "Đang xử lý...",
  icon: Icon,
  preset,
  intent,
  variant,
  className,
  disabled,
  size = "lg",
  onClick,
  ...props
}: ButtonAppProps & VariantProps<typeof buttonVariants>) {
  let presetIcon: JSX.Element | null = null;
  let presetClasses = "";

  if (preset) {
    const PresetIcon = presetIconMap[preset];
    presetIcon = PresetIcon ? <PresetIcon /> : null;
    presetClasses = presetClassMap[preset];

    if (preset === "filter") {
      variant = "outline";
      size = "icon";
    }
    if (preset === "gradient") {
      // Tránh bg-primary của variant default đè lên gradient
      variant = "ghost";
    }
  }

  if (intent) {
    const intentMap =
      variant === "outline"
        ? intentOutlineClassMap
        : variant === "ghost"
          ? intentGhostClassMap
          : intentSolidClassMap;
    presetClasses += ` ${intentMap[intent]}`;
  }

  if (Icon) {
    presetIcon = <Icon />;
  }

  return (
    <Button
      {...props}
      variant={variant}
      disabled={loading || disabled}
      size={size}
      className={cn(
        "btn-animate text-sm",
        'select-none cursor-pointer relative isolate overflow-hidden transition-all hover:-translate-y-0.5 before:content-[""] before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-white before:opacity-10 before:-z-10 before:transition-all before:duration-400 before:ease-[cubic-bezier(.165,.84,.44,1)] hover:before:left-auto hover:before:right-0 hover:before:w-full',
        presetClasses, className)}
      onClick={onClick}
    >
      {loading ? (
        <>
          <Spinner />
          {size !== "icon" && loadingText}
        </>
      ) : (
        <>
          {presetIcon}
          {children}
        </>
      )}
    </Button>
  );
}

export default memo(ButtonApp);