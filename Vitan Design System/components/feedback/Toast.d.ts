import * as React from "react";

export interface ToastProps {
  open: boolean;
  message: string;
  /** Phosphor icon class. @default "ph-fill ph-check-circle" */
  icon?: string;
  /** @default "accent" */
  tone?: "accent" | "favorite" | "neutral";
  style?: React.CSSProperties;
}

/** Liquid Glass confirmation toast that floats above the tab bar. */
export function Toast(props: ToastProps): JSX.Element;
