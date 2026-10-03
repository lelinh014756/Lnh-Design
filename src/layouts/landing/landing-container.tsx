import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Khung bề rộng của landing.
 *
 * Cố ý hẹp hơn khu vực showcase: bề mặt marketing cần dòng chữ ngắn để đọc
 * được, còn phần tràn viền do từng section tự lo bằng nền full-bleed bao ngoài
 * container này.
 */
export function LandingContainer({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[75rem] px-5 md:px-8", className)}>{children}</div>
  );
}

export default LandingContainer;
