import type { IllustrationSizeTier, IllustrationSizingProps } from "@/config/illustration-layout";
import { EmptyListIllustration } from "./empty-list";
import { EmptySearchIllustration } from "./empty-search";
import { ErrorGenericIllustration } from "./error-generic";
import { SelectPromptIllustration } from "./select-prompt";

export type EmptyStateVariant = "list" | "search" | "select" | "error";

type EmptyStateIllustrationProps = IllustrationSizingProps & {
  variant: EmptyStateVariant;
  label: string;
  sizeTier?: IllustrationSizeTier;
};

export function EmptyStateIllustration({
  variant,
  label,
  size,
  sizeTier = "inline",
}: EmptyStateIllustrationProps) {
  const shared = { label, size, sizeTier };

  switch (variant) {
    case "search":
      return <EmptySearchIllustration {...shared} />;
    case "select":
      return <SelectPromptIllustration {...shared} />;
    case "error":
      return <ErrorGenericIllustration {...shared} />;
    case "list":
    default:
      return <EmptyListIllustration {...shared} />;
  }
}
