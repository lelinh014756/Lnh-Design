import type { IllustrationSizeTier } from "@/config/illustration-layout";
import { LoadingDataIllustration } from "./loading-data";
import { cn } from "@/lib/utils";

type PageLoadingBannerProps = {
  message: string;
  label?: string;
  className?: string;
  illustrationSizeTier?: IllustrationSizeTier;
  /** Fixed px override — dev/showcase only */
  illustrationSize?: number;
};

/**
 * Compact loading banner: illustration + message above skeleton content.
 */
export function PageLoadingBanner({
  message,
  label,
  className,
  illustrationSizeTier = "inline",
  illustrationSize,
}: PageLoadingBannerProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 py-6", className)}>
      <LoadingDataIllustration
        label={label ?? message}
        size={illustrationSize}
        sizeTier={illustrationSizeTier}
      />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
