import * as React from "react";

export interface GlassPanelProps extends React.HTMLAttributes<HTMLElement> {
  /** Material thickness → blur + tint strength. @default "regular" */
  material?: "ultrathin" | "thin" | "regular" | "thick";
  /** Corner radius (any CSS length / token). @default "var(--radius-lg)" */
  radius?: string;
  /** Render a faint diagonal specular sheen overlay. @default false */
  sheen?: boolean;
  /** Element tag to render. @default "div" */
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}

/** Base Liquid Glass surface — tint + backdrop blur + specular edge + float shadow. */
export function GlassPanel(props: GlassPanelProps): JSX.Element;
