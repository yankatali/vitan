import * as React from "react";

export interface SortControlProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current sort key label, e.g. "Price". @default "Sort" */
  label?: string;
  /** Sort direction. @default "desc" */
  direction?: "asc" | "desc";
  /** Tap on the direction arrow (flip asc/desc). */
  onToggleDirection?: () => void;
  /** Tap on the label (open sort-key menu). */
  onPick?: () => void;
}

/** Glass sort capsule: sort-key label + an up/down direction toggle. */
export function SortControl(props: SortControlProps): JSX.Element;
