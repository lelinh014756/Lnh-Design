import { cn } from "@/lib/utils";

export interface TableProgressBarLabels {
  /** aria-label for the progressbar role. */
  loading: string;
}

interface TableProgressBarProps extends React.ComponentProps<"div"> {
  visible: boolean;
  labels?: TableProgressBarLabels;
}

const DEFAULT_LOADING_LABEL = "Loading";

/** Indeterminate loading bar, the analog of MRT's `showProgressBars`. */
export function TableProgressBar({
  visible,
  labels,
  className,
  ...props
}: TableProgressBarProps) {
  if (!visible) return null;

  const loadingLabel = labels?.loading ?? DEFAULT_LOADING_LABEL;

  return (
    <div
      role="progressbar"
      aria-label={loadingLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "absolute inset-x-0 top-0 z-20 h-0.5 overflow-hidden bg-primary/20",
        className,
      )}
      {...props}
    >
      <div className="h-full w-1/3 animate-table-progress bg-primary" />
    </div>
  );
}
