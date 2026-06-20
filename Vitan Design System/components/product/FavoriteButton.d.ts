import * as React from "react";

export interface FavoriteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Favorited state. @default false */
  active?: boolean;
  /** Called with the next state. */
  onToggle?: (next: boolean) => void;
  /** Diameter in px. @default 36 */
  size?: number;
  /** Render the glass chip background (vs bare heart). @default true */
  chip?: boolean;
}

/** Heart favorite toggle with a spring pop; floating glass chip by default. */
export function FavoriteButton(props: FavoriteButtonProps): JSX.Element;
