"use client";

import AppButton from "@/components/general/app-button";

/** `isGradient` cho hành động chính; cỡ riêng của AppButton (mặc định `lg`, cao 36px) không đụng `Button` gốc. */
export default function AppButtonGradientSizes() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {(["xs", "sm", "default", "lg"] as const).map((size) => (
          <AppButton key={size} size={size} icon="sparkles" isGradient>
            Nâng cấp · {size}
          </AppButton>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {(["icon-xs", "icon-sm", "icon", "icon-lg"] as const).map((size) => (
          <AppButton key={size} size={size} variant="outline" icon="printer" aria-label={`In phiếu (${size})`} />
        ))}
      </div>
    </div>
  );
}
