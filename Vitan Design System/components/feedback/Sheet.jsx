import React from "react";

/**
 * Sheet — Liquid Glass modal that slides up from the bottom (iOS sheet).
 * Use for filters, create/edit forms, confirmations. Includes a grabber,
 * optional title, and a dimmed scrim.
 */
export function Sheet({ open, onClose, title, children, footer = null, maxWidth = 460 }) {
  React.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        pointerEvents: open ? "auto" : "none",
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.28)",
          opacity: open ? 1 : 0,
          transition: "opacity var(--dur-base) var(--ease-glass)",
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "relative",
          width: "100%",
          maxWidth,
          margin: 8,
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          background: "var(--glass-tint-thick)",
          backdropFilter: "blur(var(--glass-blur-thick)) saturate(var(--glass-saturate))",
          WebkitBackdropFilter: "blur(var(--glass-blur-thick)) saturate(var(--glass-saturate))",
          borderRadius: "var(--radius-2xl)",
          boxShadow: "var(--glass-specular), var(--shadow-float)",
          transform: open ? "translateY(0)" : "translateY(110%)",
          opacity: open ? 1 : 0,
          transition: "transform var(--dur-slow) var(--ease-glass), opacity var(--dur-base)",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10 }}>
          <span style={{ width: 38, height: 5, borderRadius: 3, background: "var(--label-quaternary)" }} />
        </div>
        {title && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 18px 10px" }}>
            <h2 style={{ margin: 0, font: "var(--t-title3)", letterSpacing: "-0.4px", color: "var(--text-primary)" }}>{title}</h2>
            <button onClick={onClose} aria-label="Close"
              style={{ border: "none", background: "var(--fill)", width: 30, height: 30, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="ph-bold ph-x" style={{ fontSize: 15, color: "var(--text-secondary)" }} />
            </button>
          </div>
        )}
        <div style={{ overflowY: "auto", padding: "4px 18px 18px", flex: 1 }}>{children}</div>
        {footer && (
          <div style={{ padding: "12px 18px", borderTop: "1px solid var(--separator)" }}>{footer}</div>
        )}
      </div>
    </div>
  );
}
