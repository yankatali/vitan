import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. @default "accent" */
  variant?: "accent" | "glass" | "tinted" | "secondary" | "destructiveTinted" | "plain" | "destructive";
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Full-width. @default false */
  block?: boolean;
  /** Phosphor icon class, e.g. "ph ph-plus". Rendered before children. */
  icon?: string | null;
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * Primary action control in the Vitan Liquid Glass language.
 * @startingPoint section="Core" subtitle="Accent / glass / tinted / destructive button" viewport="700x180"
 */
export function Button(props: ButtonProps): JSX.Element;
