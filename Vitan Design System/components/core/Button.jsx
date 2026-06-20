import React from "react";

/**
 * Vitan Button — the primary action control.
 * Variants: "accent" (Vitan-green solid), "glass" (Liquid Glass),
 * "tinted" (translucent accent), "plain" (text only), "destructive".
 */
export function Button({
  children,
  variant = "accent",
  size = "md",
  block = false,
  icon = null,
  disabled = false,
  style = {},
  ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  const [hover, setHover] = React.useState(false);

  const sizes = {
    sm: { font: "var(--t-subhead)", pad: "8px 14px", h: 36, radius: "var(--radius-sm)", gap: 6 },
    md: { font: "var(--t-headline)", pad: "12px 20px", h: 44, radius: "var(--radius-md)", gap: 8 },
    lg: { font: "600 19px/22px var(--font-display)", pad: "15px 26px", h: 52, radius: "var(--radius-md)", gap: 9 },
  }[size];

  const base = {
    display: block ? "flex" : "inline-flex",
    width: block ? "100%" : "auto",
    alignItems: "center",
    justifyContent: "center",
    gap: sizes.gap,
    font: sizes.font,
    letterSpacing: "-0.2px",
    padding: sizes.pad,
    minHeight: sizes.h,
    borderRadius: sizes.radius,
    border: "none",
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.4 : 1,
    transform: pressed ? "scale(0.96)" : "scale(1)",
    transition: "transform var(--dur-fast) var(--ease-spring), background var(--dur-fast), box-shadow var(--dur-fast)",
    WebkitTapHighlightColor: "transparent",
    userSelect: "none",
    whiteSpace: "nowrap",
    ...style,
  };

  const variants = {
    accent: {
      background: hover
        ? "linear-gradient(180deg, color-mix(in srgb, var(--accent) 92%, #fff) 0%, var(--accent-press) 100%)"
        : "linear-gradient(180deg, color-mix(in srgb, var(--accent) 88%, #fff) 0%, var(--accent) 100%)",
      color: "var(--text-on-accent)",
      boxShadow: pressed
        ? "inset 0 1px 1px rgba(255,255,255,0.30)"
        : "inset 0 1px 0.5px rgba(255,255,255,0.65), 0 1px 2px rgba(0,0,0,0.10), 0 5px 14px rgba(0,0,0,0.10)",
    },
    destructive: {
      background: hover
        ? "linear-gradient(180deg, color-mix(in srgb, var(--destructive) 92%, #fff) 0%, #E0352B 100%)"
        : "linear-gradient(180deg, color-mix(in srgb, var(--destructive) 88%, #fff) 0%, var(--destructive) 100%)",
      color: "#fff",
      boxShadow: pressed
        ? "inset 0 1px 1px rgba(255,255,255,0.25)"
        : "inset 0 1px 0.5px rgba(255,255,255,0.55), 0 1px 2px rgba(0,0,0,0.10), 0 5px 14px rgba(0,0,0,0.10)",
    },
    tinted: {
      background: hover ? "color-mix(in srgb, var(--accent) 22%, transparent)" : "var(--vitan-tint)",
      color: "var(--accent-press)",
    },
    secondary: {
      background: hover ? "rgba(120,120,128,0.22)" : "rgba(120,120,128,0.14)",
      color: "var(--text-primary)",
    },
    destructiveTinted: {
      background: hover ? "rgba(255,59,48,0.20)" : "rgba(255,59,48,0.12)",
      color: "var(--destructive)",
    },
    glass: {
      background: hover ? "var(--glass-tint-thick)" : "var(--glass-tint-regular)",
      color: "var(--text-primary)",
      backdropFilter: "blur(var(--glass-blur-regular)) saturate(var(--glass-saturate))",
      WebkitBackdropFilter: "blur(var(--glass-blur-regular)) saturate(var(--glass-saturate))",
      boxShadow: "inset 0 1px 0 var(--glass-rim-strong), 0 4px 14px rgba(0,0,0,0.10)",
    },
    plain: {
      background: "transparent",
      color: "var(--accent-press)",
    },
  };

  return (
    <button
      {...rest}
      disabled={disabled}
      style={{ ...base, ...variants[variant] }}
      onPointerDown={() => !disabled && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => { setPressed(false); setHover(false); }}
      onPointerEnter={() => setHover(true)}
    >
      {icon && <i className={icon} style={{ fontSize: size === "sm" ? 16 : 19 }} />}
      {children}
    </button>
  );
}
