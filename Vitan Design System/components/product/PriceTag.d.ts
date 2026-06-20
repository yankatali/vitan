import * as React from "react";

export interface PriceTagProps {
  /** Current price. */
  amount: number;
  /** Original price (struck through) when on sale. */
  compareAt?: number | null;
  /** Currency symbol. @default "$" */
  currency?: string;
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
}

/** Formatted product price with optional compare-at / sale treatment. */
export function PriceTag(props: PriceTagProps): JSX.Element;
