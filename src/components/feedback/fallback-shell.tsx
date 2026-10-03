"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ErrorGenericIllustration } from "@/components/illustrations/error-generic";
import { NotFoundIllustration } from "@/components/illustrations/not-found";
import { ServerErrorIllustration } from "@/components/illustrations/server-error";

type FallbackVariant = "not-found" | "error" | "critical";

interface FallbackShellProps {
  /** Ghi đè chuỗi hiển thị. Bỏ trống thì dùng bản tiếng Anh gắn sẵn. */
  labels?: FallbackShellLabels;
  variant: FallbackVariant;
  onReset?: () => void;
  fallbackHref?: string;
  title?: string;
  description?: string;
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
}

type ActionIcon =
  | "M11 17l-5-5m0 0l5-5m-5 5h12"
  | "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
  | "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15";

interface VariantConfig {
  gradient: string;
  hoverFrom: string;
  hoverTo: string;
  shadow: string;
  hoverShadow: string;
  borderTL: string;
  borderBR: string;
  badge: string;
  badgeText: string;
  title: string;
  description: string;
  primaryType: "back" | "reload" | "reset";
  primaryLabel: string;
  primaryIcon: ActionIcon;
  secondaryLabel: string;
  secondaryHref: string;
  secondaryIcon: ActionIcon;
  contactColor: string;
  fallbackHref: string;
}

const VARIANT_CONFIG: Record<FallbackVariant, VariantConfig> = {
  "not-found": {
    gradient: "from-primary to-brand-secondary",
    hoverFrom: "hover:from-primary/90",
    hoverTo: "hover:to-brand-secondary/90",
    shadow: "",
    hoverShadow: "",
    borderTL: "border-[var(--color-violet-400)]",
    borderBR: "border-[var(--color-blue-500)]",
    badge: "404",
    badgeText: "text-7xl md:text-8xl",
    title: "Không tìm thấy trang",
    description: "Không tìm thấy trang tại địa chỉ này.",
    primaryType: "back",
    primaryLabel: "Quay lại",
    primaryIcon: "M11 17l-5-5m0 0l5-5m-5 5h12",
    secondaryLabel: "Về trang chủ",
    secondaryHref: "/",
    secondaryIcon:
      "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    contactColor: "text-primary hover:text-primary/90",
    fallbackHref: "/",
  },
  error: {
    gradient: "from-[var(--color-amber-500)] to-[var(--color-amber-600)]",
    hoverFrom: "hover:from-[var(--color-amber-600)]",
    hoverTo: "hover:to-[var(--color-amber-700)]",
    shadow: "",
    hoverShadow: "",
    borderTL: "border-[var(--color-amber-400)]",
    borderBR: "border-[var(--color-amber-400)]",
    badge: "Oops!",
    badgeText: "text-5xl md:text-6xl",
    title: "Đã xảy ra lỗi",
    description:
      "Đã có lỗi xảy ra trong quá trình xử lý. Vui lòng thử lại hoặc liên hệ hỗ trợ.",
    primaryType: "reload",
    primaryLabel: "Thử lại",
    primaryIcon:
      "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    secondaryLabel: "Quay lại đăng nhập",
    secondaryHref: "/auth/login",
    secondaryIcon: "M11 17l-5-5m0 0l5-5m-5 5h12",
    contactColor: "text-[var(--color-amber-500)] hover:text-[var(--color-amber-600)]",
    fallbackHref: "/",
  },
  critical: {
    gradient: "from-[var(--color-rose-500)] to-[var(--color-orange-500)]",
    hoverFrom: "hover:from-[var(--color-rose-600)]",
    hoverTo: "hover:to-[var(--color-orange-600)]",
    shadow: "",
    hoverShadow: "",
    borderTL: "border-[var(--color-rose-400)]",
    borderBR: "border-[var(--color-orange-400)]",
    badge: "500",
    badgeText: "text-5xl md:text-6xl",
    title: "Lỗi hệ thống",
    description:
      "Đã xảy ra lỗi nghiêm trọng. Vui lòng thử khởi động lại ứng dụng hoặc liên hệ hỗ trợ.",
    primaryType: "reset",
    primaryLabel: "Thử lại",
    primaryIcon:
      "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    secondaryLabel: "Về trang chủ",
    secondaryHref: "/",
    secondaryIcon:
      "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    contactColor: "text-[var(--color-rose-500)] hover:text-[var(--color-rose-600)]",
    fallbackHref: "/",
  },
};

function SvgIcon({ d, className }: { d: string; className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={d}
      />
    </svg>
  );
}

export interface FallbackShellLabels {
  errorTitle: string;
  errorDescription: string;
  errorRetry: string;
  criticalErrorTitle: string;
  criticalErrorDescription: string;
  notFoundTitle: string;
  notFoundDescription: string;
  notFoundDashboard: string;
  notFoundLogin: string;
  back: string;
}

/**
 * Mặc định tiếng Anh gắn sẵn — tầng 3 của hợp đồng i18n.
 *
 * Component này đi qua registry, nên không được đòi repo cài về phải có từ điển.
 * Nơi gọi muốn đổi ngôn ngữ thì truyền `labels`; không truyền thì vẫn chạy.
 */
const DEFAULT_LABELS: FallbackShellLabels = {
  errorTitle: "An error occurred",
  errorDescription: "Unable to load data. Please try again.",
  errorRetry: "Retry",
  criticalErrorTitle: "System error",
  criticalErrorDescription: "A critical error occurred. Please try restarting the application or contact support.",
  notFoundTitle: "Page not found",
  notFoundDescription: "The page at this address could not be found.",
  notFoundDashboard: "Back to Dashboard",
  notFoundLogin: "Back to login",
  back: "Back",
};

function FallbackShell({
  variant,
  onReset,
  fallbackHref: fallbackHrefProp,
  title: titleProp,
  description: descriptionProp,
  primaryAction: primaryActionProp,
  secondaryAction: secondaryActionProp,
  labels: c = DEFAULT_LABELS,
}: FallbackShellProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    let active = true;
    setTimeout(() => {
      if (active) setMounted(true);
    }, 0);
    return () => { active = false; };
  }, []);

  const cfg = VARIANT_CONFIG[variant];
  const fallbackHref = fallbackHrefProp ?? cfg.fallbackHref;
  const title =
    titleProp ??
    (variant === "not-found"
      ? c.notFoundTitle
      : variant === "error"
        ? c.errorTitle
        : variant === "critical"
          ? c.criticalErrorTitle
          : cfg.title);
  const description =
    descriptionProp ??
    (variant === "not-found"
      ? c.notFoundDescription
      : variant === "error"
        ? c.errorDescription
        : variant === "critical"
          ? c.criticalErrorDescription
          : cfg.description);
  const secondary = secondaryActionProp
    ? { label: secondaryActionProp.label, href: secondaryActionProp.href }
    : variant === "not-found"
      ? { label: c.notFoundDashboard, href: cfg.secondaryHref }
      : variant === "error"
        ? { label: c.notFoundLogin, href: cfg.secondaryHref }
        : { label: cfg.secondaryLabel, href: cfg.secondaryHref };
  const primaryLabel =
    primaryActionProp?.label ??
    (variant === "not-found"
      ? c.back
      : variant === "error" || variant === "critical"
        ? c.errorRetry
        : cfg.primaryLabel);

  const handleBack = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  }, [router, fallbackHref]);

  const handlePrimaryClick = useCallback(() => {
    if (primaryActionProp?.onClick) {
      primaryActionProp.onClick();
      return;
    }
    if (primaryActionProp?.href) {
      router.push(primaryActionProp.href);
      return;
    }
    switch (cfg.primaryType) {
      case "back":
        handleBack();
        break;
      case "reload":
        window.location.reload();
        break;
      case "reset":
        onReset?.();
        break;
    }
  }, [cfg.primaryType, handleBack, onReset, primaryActionProp, router]);

  const visible = "translate-y-0 opacity-100";
  const hidden = "translate-y-8 opacity-0";

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem]" />

      <div className="absolute left-6 top-6 z-30 inline-flex items-center gap-3">
        <img
          src="/logo/vime_logo.png"
          alt="ECO Farm logo"
          className="rounded-md h-16"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center">
        <div
          className={`mb-8 transition-all duration-1000 ease-out ${mounted
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-12 opacity-0 scale-90"
            }`}
        >
          {variant === "not-found" ? (
            <NotFoundIllustration label={title} sizeTier="fullscreen" />
          ) : variant === "error" ? (
            <ErrorGenericIllustration label={title} sizeTier="fullscreen" />
          ) : variant === "critical" ? (
            <ServerErrorIllustration label={title} sizeTier="fullscreen" />
          ) : (
            <div className="relative inline-block">
              <div
                className={`relative w-48 h-48 md:w-56 md:h-56 bg-gradient-to-br ${cfg.gradient} rounded-full flex items-center justify-center shadow-2xl ${cfg.shadow}`}
              >
                <span className={`${cfg.badgeText} font-bold text-white`}>
                  {cfg.badge}
                </span>
              </div>
              <div
                className={`absolute -top-3 -left-3 w-12 h-12 border-t-4 border-l-4 ${cfg.borderTL} rounded-tl-3xl`}
              />
              <div
                className={`absolute -bottom-3 -right-3 w-12 h-12 border-b-4 border-r-4 ${cfg.borderBR} rounded-br-3xl`}
              />
            </div>
          )}
        </div>

        <div
          className={`max-w-md space-y-4 transition-all duration-700 ease-out delay-300 ${mounted ? visible : hidden
            }`}
        >
          <h1 className="font-heading text-xl font-semibold leading-8 text-foreground md:text-3xl uppercase">
            {title}
          </h1>
          <p className="leading-relaxed text-muted-foreground">{description}</p>
        </div>

        <div
          className={`mt-10 flex flex-col sm:flex-row gap-4 transition-all duration-700 ease-out delay-500 ${mounted ? visible : hidden
            }`}
        >
          <button
            type="button"
            onClick={handlePrimaryClick}
            className={`inline-flex items-center justify-center h-12 px-8 rounded-lg bg-gradient-to-r ${cfg.gradient} text-base font-medium text-white shadow-sm ${cfg.shadow} transition-all duration-300 ${cfg.hoverFrom} ${cfg.hoverTo} hover:scale-105 ${cfg.hoverShadow} active:scale-95`}
          >
            <SvgIcon d={cfg.primaryIcon} className="mr-2 h-5 w-5" />
            {primaryLabel}
          </button>

          <Link
            href={secondary.href}
            className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-border bg-card px-8 text-base font-medium text-foreground shadow-sm transition-all duration-300 hover:scale-105 hover:bg-muted active:scale-95"
          >
            <SvgIcon d={cfg.secondaryIcon} className="w-5 h-5 mr-2" />
            {secondary.label}
          </Link>
        </div>

        <div
          className={`mt-12 transition-all duration-700 ease-out delay-700 ${mounted ? visible : hidden
            }`}
        >
          <p className="text-sm text-muted-foreground">
            Liên hệ hỗ trợ{" "}
            <Link
              href="https://aureus.vn/"
              target="_blank"
              rel="noreferrer"
              className={`${cfg.contactColor} hover:underline`}
            >
              VIME Farm
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
