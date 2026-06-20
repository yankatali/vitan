import React from "react";

/** Small status / category pill. Tones map to semantic colors. */
export function Badge({ children, tone = "neutral", solid = false, style = {}, ...rest }) {
  const tones = {
    neutral: { fg: "var(--text-secondary)", bg: "var(--fill)" },
    accent: { fg: "var(--accent-press)", bg: "var(--vitan-tint)" },
    favorite: { fg: "var(--favorite)", bg: "rgba(255,45,85,0.12)" },
    sale: { fg: "var(--sys-orange)", bg: "rgba(255,149,0,0.14)" },
    blue: { fg: "var(--sys-blue)", bg: "rgba(0,122,255,0.12)" },
  }[tone];

  const c = tones || tones.neutral;
  return (
    <span
      {...rest}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        font: "600 12px/1 var(--font-text)",
        letterSpacing: "0.1px",
        padding: "5px 9px",
        borderRadius: "var(--radius-capsule)",
        color: solid ? "#fff" : c.fg,
        background: solid ? c.fg : c.bg,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
