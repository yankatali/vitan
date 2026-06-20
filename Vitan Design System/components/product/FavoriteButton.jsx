import React from "react";

/** Heart favorite toggle with a spring pop. Defaults to a floating glass chip. */
export function FavoriteButton({ active = false, onToggle, size = 36, chip = true, style = {}, ...rest }) {
  const [burst, setBurst] = React.useState(false);
  const handle = (e) => {
    e.stopPropagation();
    if (!active) { setBurst(true); setTimeout(() => setBurst(false), 360); }
    onToggle && onToggle(!active);
  };
  return (
    <button
      {...rest}
      onClick={handle}
      aria-label={active ? "Remove from Favorites" : "Add to Favorites"}
      aria-pressed={active}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "var(--radius-capsule)",
        border: "none",
        cursor: "pointer",
        background: chip ? "var(--glass-tint-thick)" : "transparent",
        backdropFilter: chip ? "blur(var(--glass-blur-regular)) saturate(var(--glass-saturate))" : "none",
        WebkitBackdropFilter: chip ? "blur(var(--glass-blur-regular)) saturate(var(--glass-saturate))" : "none",
        boxShadow: chip ? "var(--glass-specular), var(--shadow-card)" : "none",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
    >
      <i
        className={active ? "ph-fill ph-heart" : "ph ph-heart"}
        style={{
          fontSize: Math.round(size * 0.52),
          color: active ? "var(--favorite)" : "var(--text-secondary)",
          transform: burst ? "scale(1.3)" : "scale(1)",
          transition: "transform 0.36s var(--ease-spring), color var(--dur-fast)",
        }}
      />
    </button>
  );
}
