import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Dấu nhận diện AureCook.
 *
 * Vẽ bằng SVG inline thay vì file ảnh: logo phải đổi màu theo token
 * `--primary` ở cả hai theme, một file PNG/SVG tĩnh thì không làm được.
 */
export function AppLogo({
  href = "/",
  showWordmark = true,
  className,
}: {
  href?: string;
  showWordmark?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2.5 outline-none", className)}
      aria-label="AureCook"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="size-4.5" fill="none" aria-hidden>
          <path
            d="M5 17.5 12 4l7 13.5"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.2 14.2h7.6"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
          <circle cx="12" cy="20" r="1.4" fill="currentColor" />
        </svg>
      </span>
      {showWordmark && (
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          Aure<span className="text-primary">Cook</span>
        </span>
      )}
    </Link>
  );
}

export default AppLogo;
