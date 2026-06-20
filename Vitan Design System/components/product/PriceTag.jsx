import React from "react";

/** Formatted price. Optional struck-through compare-at price + sale styling. */
export function PriceTag({ amount, compareAt = null, currency = "$", size = "md", style = {} }) {
  const sizes = {
    sm: { main: "700 16px/1 var(--font-display)", was: "12px" },
    md: { main: "700 20px/1 var(--font-display)", was: "13px" },
    lg: { main: "700 28px/1 var(--font-display)", was: "15px" },
  }[size];
  const onSale = compareAt != null && compareAt > amount;
  const fmt = (n) => `${currency}${Number(n).toLocaleString(undefined, {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: 8, letterSpacing: "-0.4px", ...style }}>
      <span style={{ font: sizes.main, color: onSale ? "var(--sys-orange)" : "var(--price)" }}>
        {fmt(amount)}
      </span>
      {onSale && (
        <span style={{ font: `400 ${sizes.was}/1 var(--font-text)`, color: "var(--text-tertiary)", textDecoration: "line-through" }}>
          {fmt(compareAt)}
        </span>
      )}
    </span>
  );
}
