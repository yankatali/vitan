import React from "react";

/**
 * FilterChip — toggleable filter pill used in the filters popover and
 * inline filter rows. Selected = Vitan-green tinted glass with a check.
 */
export function FilterChip({ children, selected = false, icon = null, onClick, style = {}, ...rest }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <button
      {...rest}
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        font: "600 15px/1 var(--font-text)",
        letterSpacing: "-0.1px",
        padding: "9px 14px",
        borderRadius: "var(--radius-capsule)",
        border: "none",
        cursor: "pointer",
        color: selected ? "var(--text-on-accent)" : "var(--text-primary)",
        background: selected ? "var(--accent)" : "var(--fill)",
        boxShadow: selected ? "var(--shadow-card)" : "none",
        transform: pressed ? "scale(0.94)" : "scale(1)",
        transition: "transform var(--dur-fast) var(--ease-spring), background var(--dur-base), color var(--dur-base)",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
    >
      {selected && <i className="ph-bold ph-check" style={{ fontSize: 15 }} />}
      {icon && !selected && <i className={icon} style={{ fontSize: 16 }} />}
      {children}
    </button>
  );
}
