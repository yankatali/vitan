import React from "react";

/** Liquid Glass toast — brief confirmation that floats near the tab bar. */
export function Toast({ open, message, icon = "ph-fill ph-check-circle", tone = "accent", style = {} }) {
  const toneColor = { accent: "var(--accent)", favorite: "var(--favorite)", neutral: "var(--text-secondary)" }[tone];
  return (
    <div
      aria-live="polite"
      style={{
        position: "fixed", left: "50%", bottom: 92, zIndex: 120,
        transform: `translateX(-50%) translateY(${open ? "0" : "16px"}) scale(${open ? 1 : 0.96})`,
        opacity: open ? 1 : 0,
        pointerEvents: "none",
        transition: "opacity var(--dur-base), transform var(--dur-base) var(--ease-spring)",
        display: "flex", alignItems: "center", gap: 9,
        padding: "11px 18px",
        borderRadius: "var(--radius-capsule)",
        background: "var(--glass-tint-thick)",
        backdropFilter: "blur(var(--glass-blur-thick)) saturate(var(--glass-saturate))",
        WebkitBackdropFilter: "blur(var(--glass-blur-thick)) saturate(var(--glass-saturate))",
        boxShadow: "var(--glass-specular), var(--shadow-float)",
        font: "var(--t-headline)", color: "var(--text-primary)",
        ...style,
      }}
    >
      <i className={icon} style={{ fontSize: 20, color: toneColor }} />
      {message}
    </div>
  );
}
