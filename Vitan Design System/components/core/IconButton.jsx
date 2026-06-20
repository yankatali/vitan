import React from "react";

/**
 * Circular / capsule icon button. Default is a Liquid Glass chip —
 * the standard for header actions (search, ＋, sort) and the floating
 * favorite heart.
 */
export function IconButton({
  icon,
  variant = "glass",
  size = 40,
  active = false,
  activeColor = "var(--accent)",
  label,
  style = {},
  ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  const [hover, setHover] = React.useState(false);

  const variants = {
    glass: {
      background: hover ? "var(--glass-tint-thick)" : "var(--glass-tint-regular)",
      color: active ? activeColor : "var(--text-primary)",
      backdropFilter: "blur(var(--glass-blur-regular)) saturate(var(--glass-saturate))",
      WebkitBackdropFilter: "blur(var(--glass-blur-regular)) saturate(var(--glass-saturate))",
      boxShadow: "var(--glass-specular), var(--shadow-card)",
    },
    fill: {
      background: "var(--fill)",
      color: active ? activeColor : "var(--text-secondary)",
    },
    accent: {
      background: "linear-gradient(180deg, color-mix(in srgb, var(--accent) 88%, #fff) 0%, var(--accent) 100%)",
      color: "var(--text-on-accent)",
      boxShadow: "inset 0 1px 0.5px rgba(255,255,255,0.65), 0 1px 2px rgba(0,0,0,0.10), 0 5px 14px rgba(0,0,0,0.10)",
    },
    plain: {
      background: "transparent",
      color: active ? activeColor : "var(--text-secondary)",
    },
  };

  return (
    <button
      {...rest}
      aria-label={label}
      title={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "var(--radius-capsule)",
        border: "none",
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
        transform: pressed ? "scale(0.9)" : "scale(1)",
        transition: "transform var(--dur-fast) var(--ease-spring), background var(--dur-fast), color var(--dur-base)",
        ...variants[variant],
        ...style,
      }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => { setPressed(false); setHover(false); }}
      onPointerEnter={() => setHover(true)}
    >
      <i className={icon} style={{ fontSize: Math.round(size * 0.5) }} />
    </button>
  );
}
