import React from "react";

/** Liquid Glass search field for the header (iOS / Telegram style). */
export function SearchField({ placeholder = "Search", value, onChange, onClear, style = {}, ...rest }) {
  return (
    <div
      {...rest}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        height: 40,
        padding: "0 12px",
        borderRadius: "var(--radius-capsule)",
        background: "var(--glass-tint-regular)",
        backdropFilter: "blur(var(--glass-blur-regular)) saturate(var(--glass-saturate))",
        WebkitBackdropFilter: "blur(var(--glass-blur-regular)) saturate(var(--glass-saturate))",
        boxShadow: "var(--glass-specular), var(--shadow-card)",
        ...style,
      }}
    >
      <i className="ph ph-magnifying-glass" style={{ fontSize: 18, color: "var(--text-tertiary)" }} />
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          background: "transparent",
          font: "var(--t-body)",
          color: "var(--text-primary)",
          fontFamily: "var(--font-text)",
          minWidth: 0,
        }}
      />
      {value ? (
        <button
          onClick={onClear}
          aria-label="Clear"
          style={{ border: "none", background: "none", cursor: "pointer", display: "flex", padding: 0 }}
        >
          <i className="ph-fill ph-x-circle" style={{ fontSize: 18, color: "var(--text-tertiary)" }} />
        </button>
      ) : null}
    </div>
  );
}
