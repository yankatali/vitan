import React from "react";

/** iOS segmented control. Sliding glass thumb under the active segment. */
export function SegmentedControl({ options = [], value, onChange, style = {} }) {
  const idx = Math.max(0, options.findIndex((o) => (o.value ?? o) === value));
  return (
    <div
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: `repeat(${options.length}, 1fr)`,
        padding: 3,
        borderRadius: "var(--radius-sm)",
        background: "var(--fill)",
        ...style,
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 3,
          bottom: 3,
          left: `calc(${(idx / options.length) * 100}% + 3px)`,
          width: `calc(${100 / options.length}% - 6px)`,
          borderRadius: "calc(var(--radius-sm) - 3px)",
          background: "var(--bg-elevated)",
          boxShadow: "var(--shadow-card)",
          transition: "left var(--dur-base) var(--ease-glass)",
        }}
      />
      {options.map((o) => {
        const val = o.value ?? o;
        const label = o.label ?? o;
        const active = val === value;
        return (
          <button
            key={val}
            onClick={() => onChange && onChange(val)}
            style={{
              position: "relative",
              zIndex: 1,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: "7px 12px",
              font: `${active ? 600 : 500} 14px/1 var(--font-text)`,
              color: active ? "var(--text-primary)" : "var(--text-secondary)",
              transition: "color var(--dur-base)",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
