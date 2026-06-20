import * as React from "react";

export interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Selected state — green fill + check. @default false */
  selected?: boolean;
  /** Phosphor icon (shown only when not selected). */
  icon?: string | null;
  children?: React.ReactNode;
}

/** Toggleable filter pill for the filters popover. */
export function FilterChip(props: FilterChipProps): JSX.Element;
