import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "neutral" */
  tone?: "neutral" | "accent" | "favorite" | "sale" | "blue";
  /** Solid fill vs soft tint. @default false */
  solid?: boolean;
  children?: React.ReactNode;
}

/** Small capsule status / category pill. */
export function Badge(props: BadgeProps): JSX.Element;
