import React from "react";

/**
 * TabBar — floating Liquid Glass tab bar (iOS-26 / Telegram-iOS).
 * A frosted capsule that hovers above the content; the active tab gets
 * a tinted glass pill, filled icon, and accent color.
 */
export function TabBar({ items = [], value, onChange, floating = true, style = {} }) {
  const activeIdx = Math.max(0, items.findIndex((it) => it.value === value));
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        padding: 6,
        borderRadius: "var(--radius-capsule)",
        background: "var(--glass-tint-regular)",
        backdropFilter: "blur(var(--glass-blur-thick)) saturate(190%)",
        WebkitBackdropFilter: "blur(var(--glass-blur-thick)) saturate(190%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55), 0 8px 30px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.06)",
        ...(floating
          ? { position: "fixed", left: "50%", bottom: 16, transform: "translateX(-50%)", zIndex: 50 }
          : {}),
        ...style,
      }}
    >
      {items.map((it, idx) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            onClick={() => onChange && onChange(it.value)}
            aria-label={it.label}
            aria-current={active ? "page" : undefined}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              minWidth: 64,
              padding: "8px 14px",
              border: "none",
              borderRadius: "var(--radius-capsule)",
              cursor: "pointer",
              background: active ? "color-mix(in srgb, var(--accent) 16%, transparent)" : "transparent",
              boxShadow: "none",
              color: active ? "var(--accent-press)" : "var(--text-secondary)",
              transition: "background var(--dur-base) var(--ease-glass), color var(--dur-base)",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <i
              className={`${active ? "ph-fill" : "ph"} ${it.icon}`}
              style={{ fontSize: 24, lineHeight: 1 }}
            />
            <span style={{ font: "600 11px/1 var(--font-text)", letterSpacing: "0.1px" }}>{it.label}</span>
            {it.badge ? (
              <span style={{
                position: "absolute", top: 4, right: 12, minWidth: 16, height: 16, padding: "0 4px",
                borderRadius: 8, background: "var(--sys-red)", color: "#fff",
                font: "700 10px/16px var(--font-text)", textAlign: "center",
                boxShadow: "0 0 0 2px var(--glass-tint-thick)",
              }}>{it.badge}</span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
