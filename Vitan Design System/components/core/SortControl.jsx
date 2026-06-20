import React from "react";

/**
 * SortControl — Liquid Glass capsule that shows the current sort key and
 * a direction arrow that flips between ascending / descending on tap.
 * Tapping the label area is expected to open a sort menu (onPick).
 */
export function SortControl({
  label = "Sort",
  direction = "desc",
  onToggleDirection,
  onPick,
  style = {},
  ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <div
      {...rest}
      style={{
        display: "inline-flex",
        alignItems: "stretch",
        height: 40,
        borderRadius: "var(--radius-capsule)",
        background: "var(--glass-tint-regular)",
        backdropFilter: "blur(var(--glass-blur-regular)) saturate(var(--glass-saturate))",
        WebkitBackdropFilter: "blur(var(--glass-blur-regular)) saturate(var(--glass-saturate))",
        boxShadow: "var(--glass-specular), var(--shadow-card)",
        overflow: "hidden",
        ...style,
      }}
    >
      <button
        onClick={onPick}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "0 10px 0 14px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          font: "600 15px/1 var(--font-text)",
          letterSpacing: "-0.1px",
          color: "var(--text-primary)",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <i className="ph ph-arrows-down-up" style={{ fontSize: 17, color: "var(--text-secondary)" }} />
        {label}
      </button>
      <button
        onClick={onToggleDirection}
        aria-label={direction === "asc" ? "Ascending" : "Descending"}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 38,
          border: "none",
          borderLeft: "1px solid var(--separator)",
          background: "var(--vitan-tint)",
          color: "var(--accent-press)",
          cursor: "pointer",
          transform: pressed ? "scale(0.92)" : "scale(1)",
          transition: "transform var(--dur-fast) var(--ease-spring)",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <i
          className={direction === "asc" ? "ph-bold ph-arrow-up" : "ph-bold ph-arrow-down"}
          style={{ fontSize: 16 }}
        />
      </button>
    </div>
  );
}
