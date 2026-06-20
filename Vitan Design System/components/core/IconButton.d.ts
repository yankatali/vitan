import * as React from "react";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Phosphor icon class, e.g. "ph ph-magnifying-glass" / "ph-fill ph-heart". */
  icon: string;
  /** @default "glass" */
  variant?: "glass" | "fill" | "accent" | "plain";
  /** Diameter in px. @default 40 */
  size?: number;
  /** Active/selected — tints the icon with activeColor. */
  active?: boolean;
  /** Tint when active. @default "var(--accent)" */
  activeColor?: string;
  /** Accessible label (also the tooltip). */
  label?: string;
}

/** Circular Liquid-Glass icon button — header actions, favorite heart, controls. */
export function IconButton(props: IconButtonProps): JSX.Element;
