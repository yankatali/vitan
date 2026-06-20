import React from "react";

/**
 * GlassPanel — the base Liquid Glass surface. Wrap any floating chrome
 * (headers, popovers, action bars) in this. Renders tint + backdrop
 * blur/saturate + specular edge + float shadow.
 */
export function GlassPanel({
  children,
  material = "regular",
  radius = "var(--radius-lg)",
  sheen = false,
  style = {},
  as = "div",
  ...rest
}) {
  const blur = {
    ultrathin: "var(--glass-blur-thin)",
    thin: "var(--glass-blur-thin)",
    regular: "var(--glass-blur-regular)",
    thick: "var(--glass-blur-thick)",
  }[material];
  const tint = {
    ultrathin: "var(--glass-tint-ultrathin)",
    thin: "var(--glass-tint-thin)",
    regular: "var(--glass-tint-regular)",
    thick: "var(--glass-tint-thick)",
  }[material];

  const Tag = as;
  return (
    <Tag
      {...rest}
      style={{
        position: "relative",
        background: tint,
        backdropFilter: `blur(${blur}) saturate(var(--glass-saturate))`,
        WebkitBackdropFilter: `blur(${blur}) saturate(var(--glass-saturate))`,
        boxShadow: "var(--glass-specular), var(--shadow-glass)",
        borderRadius: radius,
        overflow: sheen ? "hidden" : undefined,
        ...style,
      }}
    >
      {sheen && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(115deg, rgba(255,255,255,0) 32%, rgba(255,255,255,0.25) 48%, rgba(255,255,255,0) 64%)",
            pointerEvents: "none",
          }}
        />
      )}
      {children}
    </Tag>
  );
}
