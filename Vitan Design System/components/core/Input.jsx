import React from "react";

/** Text input / textarea in the iOS rounded-fill style. */
export function Input({
  label,
  hint,
  multiline = false,
  prefix = null,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const Field = multiline ? "textarea" : "input";

  return (
    <label style={{ display: "block", width: "100%" }}>
      {label && (
        <span style={{ display: "block", font: "var(--t-footnote)", color: "var(--text-secondary)", margin: "0 0 6px 4px", fontWeight: 600 }}>
          {label}
        </span>
      )}
      <span
        style={{
          display: "flex",
          alignItems: multiline ? "flex-start" : "center",
          gap: 8,
          background: "var(--fill-tertiary)",
          borderRadius: "var(--radius-sm)",
          padding: multiline ? "12px 14px" : "0 14px",
          minHeight: multiline ? "auto" : 46,
          boxShadow: focus ? "inset 0 0 0 2px var(--accent)" : "inset 0 0 0 1px var(--separator)",
          transition: "box-shadow var(--dur-fast)",
        }}
      >
        {prefix && <i className={prefix} style={{ fontSize: 18, color: "var(--text-tertiary)" }} />}
        <Field
          {...rest}
          rows={multiline ? 4 : undefined}
          onFocus={(e) => { setFocus(true); rest.onFocus && rest.onFocus(e); }}
          onBlur={(e) => { setFocus(false); rest.onBlur && rest.onBlur(e); }}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            font: "var(--t-body)",
            color: "var(--text-primary)",
            resize: multiline ? "vertical" : undefined,
            padding: multiline ? 0 : "12px 0",
            fontFamily: "var(--font-text)",
            ...style,
          }}
        />
      </span>
      {hint && (
        <span style={{ display: "block", font: "var(--t-caption1)", color: "var(--text-tertiary)", margin: "6px 0 0 4px" }}>
          {hint}
        </span>
      )}
    </label>
  );
}
