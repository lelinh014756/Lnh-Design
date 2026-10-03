import type { CSSProperties } from "react";

/**
 * Responsive illustration size tiers — sync with docs/design-guidelines.md.
 * Breakpoints: mobile <768 | tablet 768–1023 | desktop ≥1024 (design-breakpoints.ts).
 */
export type IllustrationSizeTier = "grid" | "inline" | "panel" | "fullscreen";

/** Square box width/height via clamp — scales between viewport tiers without JS. */
export const ILLUSTRATION_SIZE_CLAMP: Record<IllustrationSizeTier, string> = {
  /** Admin grid empty cell — keep compact */
  grid: "clamp(5.5rem, 18vw, 8rem)",
  /** EmptyState panels, loading banner */
  inline: "clamp(7.5rem, 22vw, 11rem)",
  /** 404 / error / under-dev inside portal shell */
  panel: "clamp(10rem, 28vw, 16rem)",
  /** FallbackShell full-page, auth redirect */
  fullscreen: "clamp(11rem, 38vw, 18.75rem)",
};

/** Cap height on small viewports so illustration does not dominate the screen. */
export const ILLUSTRATION_MAX_HEIGHT: Partial<Record<IllustrationSizeTier, string>> = {
  panel: "min(40dvh, 16rem)",
  fullscreen: "min(45dvh, 18.75rem)",
};

export type IllustrationSizingProps = {
  /** Fixed px — override tier (dev showcase, one-off) */
  size?: number;
  /** Responsive tier — production default */
  sizeTier?: IllustrationSizeTier;
};

export type IllustrationCommonProps = IllustrationSizingProps & {
  label?: string;
  className?: string;
};

export function getIllustrationBoxStyle({
  size,
  sizeTier = "inline",
}: IllustrationSizingProps): CSSProperties {
  if (size != null) {
    return { width: size, height: size };
  }

  const maxHeight = ILLUSTRATION_MAX_HEIGHT[sizeTier];

  return {
    width: ILLUSTRATION_SIZE_CLAMP[sizeTier],
    aspectRatio: "1 / 1",
    maxHeight,
    maxWidth: "100%",
  };
}
