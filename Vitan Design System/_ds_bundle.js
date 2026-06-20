/* @ds-bundle: {"format":3,"namespace":"VitanDesignSystem_b00aee","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"FilterChip","sourcePath":"components/core/FilterChip.jsx"},{"name":"GlassPanel","sourcePath":"components/core/GlassPanel.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"SearchField","sourcePath":"components/core/SearchField.jsx"},{"name":"SegmentedControl","sourcePath":"components/core/SegmentedControl.jsx"},{"name":"SortControl","sourcePath":"components/core/SortControl.jsx"},{"name":"Sheet","sourcePath":"components/feedback/Sheet.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"TabBar","sourcePath":"components/navigation/TabBar.jsx"},{"name":"FavoriteButton","sourcePath":"components/product/FavoriteButton.jsx"},{"name":"PriceTag","sourcePath":"components/product/PriceTag.jsx"},{"name":"ProductCard","sourcePath":"components/product/ProductCard.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"c8c047114cf7","components/core/Button.jsx":"7aa4195c811e","components/core/FilterChip.jsx":"174304bb4f78","components/core/GlassPanel.jsx":"9078af4cc1fd","components/core/IconButton.jsx":"40a6ddd532d5","components/core/Input.jsx":"d4112dcb2bb5","components/core/SearchField.jsx":"1c5dcd73bc8e","components/core/SegmentedControl.jsx":"ac4ba9ba0eb6","components/core/SortControl.jsx":"288aac90a958","components/feedback/Sheet.jsx":"1a0fdd6c5c95","components/feedback/Toast.jsx":"eb57cd079898","components/navigation/TabBar.jsx":"eaecd032c8d0","components/product/FavoriteButton.jsx":"ee40d67148e7","components/product/PriceTag.jsx":"6a36e641f551","components/product/ProductCard.jsx":"fc3a2433cc6d","ui_kits/vitan-app/Catalog.jsx":"8e4a00a3afb3","ui_kits/vitan-app/FiltersSheet.jsx":"1b2d6fd8a205","ui_kits/vitan-app/ItemForm.jsx":"8074aaedaf1d","ui_kits/vitan-app/ProductDetail.jsx":"7f3c515f4be1","ui_kits/vitan-app/data.js":"99c2e4673109"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.VitanDesignSystem_b00aee = window.VitanDesignSystem_b00aee || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Small status / category pill. Tones map to semantic colors. */
function Badge({
  children,
  tone = "neutral",
  solid = false,
  style = {},
  ...rest
}) {
  const tones = {
    neutral: {
      fg: "var(--text-secondary)",
      bg: "var(--fill)"
    },
    accent: {
      fg: "var(--accent-press)",
      bg: "var(--vitan-tint)"
    },
    favorite: {
      fg: "var(--favorite)",
      bg: "rgba(255,45,85,0.12)"
    },
    sale: {
      fg: "var(--sys-orange)",
      bg: "rgba(255,149,0,0.14)"
    },
    blue: {
      fg: "var(--sys-blue)",
      bg: "rgba(0,122,255,0.12)"
    }
  }[tone];
  const c = tones || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      font: "600 12px/1 var(--font-text)",
      letterSpacing: "0.1px",
      padding: "5px 9px",
      borderRadius: "var(--radius-capsule)",
      color: solid ? "#fff" : c.fg,
      background: solid ? c.fg : c.bg,
      ...style
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Vitan Button — the primary action control.
 * Variants: "accent" (Vitan-green solid), "glass" (Liquid Glass),
 * "tinted" (translucent accent), "plain" (text only), "destructive".
 */
function Button({
  children,
  variant = "accent",
  size = "md",
  block = false,
  icon = null,
  disabled = false,
  style = {},
  ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const sizes = {
    sm: {
      font: "var(--t-subhead)",
      pad: "8px 14px",
      h: 36,
      radius: "var(--radius-sm)",
      gap: 6
    },
    md: {
      font: "var(--t-headline)",
      pad: "12px 20px",
      h: 44,
      radius: "var(--radius-md)",
      gap: 8
    },
    lg: {
      font: "600 19px/22px var(--font-display)",
      pad: "15px 26px",
      h: 52,
      radius: "var(--radius-md)",
      gap: 9
    }
  }[size];
  const base = {
    display: block ? "flex" : "inline-flex",
    width: block ? "100%" : "auto",
    alignItems: "center",
    justifyContent: "center",
    gap: sizes.gap,
    font: sizes.font,
    letterSpacing: "-0.2px",
    padding: sizes.pad,
    minHeight: sizes.h,
    borderRadius: sizes.radius,
    border: "none",
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.4 : 1,
    transform: pressed ? "scale(0.96)" : "scale(1)",
    transition: "transform var(--dur-fast) var(--ease-spring), background var(--dur-fast), box-shadow var(--dur-fast)",
    WebkitTapHighlightColor: "transparent",
    userSelect: "none",
    whiteSpace: "nowrap",
    ...style
  };
  const variants = {
    accent: {
      background: hover ? "linear-gradient(180deg, color-mix(in srgb, var(--accent) 86%, #fff), var(--accent-press))" : "linear-gradient(180deg, color-mix(in srgb, var(--accent) 82%, #fff), var(--accent))",
      color: "var(--text-on-accent)",
      backdropFilter: "saturate(var(--glass-saturate))",
      WebkitBackdropFilter: "saturate(var(--glass-saturate))",
      boxShadow: pressed ? "inset 0 1px 0 rgba(255,255,255,0.35), var(--shadow-press)" : "inset 0 1.5px 0 rgba(255,255,255,0.55), inset 0 -1px 1px rgba(0,0,0,0.12), 0 4px 14px color-mix(in srgb, var(--accent) 38%, transparent)"
    },
    destructive: {
      background: hover ? "linear-gradient(180deg, color-mix(in srgb, var(--destructive) 86%, #fff), #E0352B)" : "linear-gradient(180deg, color-mix(in srgb, var(--destructive) 82%, #fff), var(--destructive))",
      color: "#fff",
      boxShadow: pressed ? "inset 0 1px 0 rgba(255,255,255,0.3), var(--shadow-press)" : "inset 0 1.5px 0 rgba(255,255,255,0.5), inset 0 -1px 1px rgba(0,0,0,0.12), 0 4px 14px rgba(255,59,48,0.34)"
    },
    tinted: {
      background: "var(--vitan-tint)",
      color: "var(--accent-press)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)"
    },
    secondary: {
      background: hover ? "var(--glass-tint-thick)" : "var(--glass-tint-regular)",
      color: "var(--text-primary)",
      backdropFilter: "blur(var(--glass-blur-regular)) saturate(var(--glass-saturate))",
      WebkitBackdropFilter: "blur(var(--glass-blur-regular)) saturate(var(--glass-saturate))",
      boxShadow: "var(--glass-specular), var(--shadow-card)"
    },
    glass: {
      background: hover ? "var(--glass-tint-thick)" : "var(--glass-tint-regular)",
      color: "var(--text-primary)",
      backdropFilter: "blur(var(--glass-blur-regular)) saturate(var(--glass-saturate))",
      WebkitBackdropFilter: "blur(var(--glass-blur-regular)) saturate(var(--glass-saturate))",
      boxShadow: "var(--glass-specular), var(--shadow-card)"
    },
    plain: {
      background: "transparent",
      color: "var(--accent-press)"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({}, rest, {
    disabled: disabled,
    style: {
      ...base,
      ...variants[variant]
    },
    onPointerDown: () => !disabled && setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => {
      setPressed(false);
      setHover(false);
    },
    onPointerEnter: () => setHover(true)
  }), icon && /*#__PURE__*/React.createElement("i", {
    className: icon,
    style: {
      fontSize: size === "sm" ? 16 : 19
    }
  }), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/FilterChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * FilterChip — toggleable filter pill used in the filters popover and
 * inline filter rows. Selected = Vitan-green tinted glass with a check.
 */
function FilterChip({
  children,
  selected = false,
  icon = null,
  onClick,
  style = {},
  ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({}, rest, {
    onClick: onClick,
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    style: {
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
      ...style
    }
  }), selected && /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-check",
    style: {
      fontSize: 15
    }
  }), icon && !selected && /*#__PURE__*/React.createElement("i", {
    className: icon,
    style: {
      fontSize: 16
    }
  }), children);
}
Object.assign(__ds_scope, { FilterChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/FilterChip.jsx", error: String((e && e.message) || e) }); }

// components/core/GlassPanel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GlassPanel — the base Liquid Glass surface. Wrap any floating chrome
 * (headers, popovers, action bars) in this. Renders tint + backdrop
 * blur/saturate + specular edge + float shadow.
 */
function GlassPanel({
  children,
  material = "regular",
  radius = "var(--radius-lg)",
  sheen = false,
  style = {},
  as = "div",
  ...rest
}) {
  const blur = {
    ultrathin: "var(--glass-blur-thin)",
    thin: "var(--glass-blur-thin)",
    regular: "var(--glass-blur-regular)",
    thick: "var(--glass-blur-thick)"
  }[material];
  const tint = {
    ultrathin: "var(--glass-tint-ultrathin)",
    thin: "var(--glass-tint-thin)",
    regular: "var(--glass-tint-regular)",
    thick: "var(--glass-tint-thick)"
  }[material];
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({}, rest, {
    style: {
      position: "relative",
      background: tint,
      backdropFilter: `blur(${blur}) saturate(var(--glass-saturate))`,
      WebkitBackdropFilter: `blur(${blur}) saturate(var(--glass-saturate))`,
      boxShadow: "var(--glass-specular), var(--shadow-glass)",
      borderRadius: radius,
      overflow: sheen ? "hidden" : undefined,
      ...style
    }
  }), sheen && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(115deg, rgba(255,255,255,0) 32%, rgba(255,255,255,0.25) 48%, rgba(255,255,255,0) 64%)",
      pointerEvents: "none"
    }
  }), children);
}
Object.assign(__ds_scope, { GlassPanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/GlassPanel.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Circular / capsule icon button. Default is a Liquid Glass chip —
 * the standard for header actions (search, ＋, sort) and the floating
 * favorite heart.
 */
function IconButton({
  icon,
  variant = "glass",
  size = 40,
  active = false,
  activeColor = "var(--accent)",
  label,
  style = {},
  ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const variants = {
    glass: {
      background: hover ? "var(--glass-tint-thick)" : "var(--glass-tint-regular)",
      color: active ? activeColor : "var(--text-primary)",
      backdropFilter: "blur(var(--glass-blur-regular)) saturate(var(--glass-saturate))",
      WebkitBackdropFilter: "blur(var(--glass-blur-regular)) saturate(var(--glass-saturate))",
      boxShadow: "var(--glass-specular), var(--shadow-card)"
    },
    fill: {
      background: "var(--fill)",
      color: active ? activeColor : "var(--text-secondary)"
    },
    accent: {
      background: "linear-gradient(180deg, color-mix(in srgb, var(--accent) 82%, #fff), var(--accent))",
      color: "var(--text-on-accent)",
      boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.55), inset 0 -1px 1px rgba(0,0,0,0.12), 0 4px 12px color-mix(in srgb, var(--accent) 36%, transparent)"
    },
    plain: {
      background: "transparent",
      color: active ? activeColor : "var(--text-secondary)"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({}, rest, {
    "aria-label": label,
    title: label,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: "var(--radius-capsule)",
      border: "none",
      cursor: "pointer",
      WebkitTapHighlightColor: "transparent",
      transform: pressed ? "scale(0.9)" : "scale(1)",
      transition: "transform var(--dur-fast) var(--ease-spring), background var(--dur-fast), color var(--dur-base)",
      ...variants[variant],
      ...style
    },
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => {
      setPressed(false);
      setHover(false);
    },
    onPointerEnter: () => setHover(true)
  }), /*#__PURE__*/React.createElement("i", {
    className: icon,
    style: {
      fontSize: Math.round(size * 0.5)
    }
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Text input / textarea in the iOS rounded-fill style. */
function Input({
  label,
  hint,
  multiline = false,
  prefix = null,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const Field = multiline ? "textarea" : "input";
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      width: "100%"
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      font: "var(--t-footnote)",
      color: "var(--text-secondary)",
      margin: "0 0 6px 4px",
      fontWeight: 600
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: multiline ? "flex-start" : "center",
      gap: 8,
      background: "var(--fill-tertiary)",
      borderRadius: "var(--radius-sm)",
      padding: multiline ? "12px 14px" : "0 14px",
      minHeight: multiline ? "auto" : 46,
      boxShadow: focus ? "inset 0 0 0 2px var(--accent)" : "inset 0 0 0 1px var(--separator)",
      transition: "box-shadow var(--dur-fast)"
    }
  }, prefix && /*#__PURE__*/React.createElement("i", {
    className: prefix,
    style: {
      fontSize: 18,
      color: "var(--text-tertiary)"
    }
  }), /*#__PURE__*/React.createElement(Field, _extends({}, rest, {
    rows: multiline ? 4 : undefined,
    onFocus: e => {
      setFocus(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocus(false);
      rest.onBlur && rest.onBlur(e);
    },
    style: {
      flex: 1,
      border: "none",
      outline: "none",
      background: "transparent",
      font: "var(--t-body)",
      color: "var(--text-primary)",
      resize: multiline ? "vertical" : undefined,
      padding: multiline ? 0 : "12px 0",
      fontFamily: "var(--font-text)",
      ...style
    }
  }))), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      font: "var(--t-caption1)",
      color: "var(--text-tertiary)",
      margin: "6px 0 0 4px"
    }
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/SearchField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Liquid Glass search field for the header (iOS / Telegram style). */
function SearchField({
  placeholder = "Search",
  value,
  onChange,
  onClear,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
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
      ...style
    }
  }), /*#__PURE__*/React.createElement("i", {
    className: "ph ph-magnifying-glass",
    style: {
      fontSize: 18,
      color: "var(--text-tertiary)"
    }
  }), /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    style: {
      flex: 1,
      border: "none",
      outline: "none",
      background: "transparent",
      font: "var(--t-body)",
      color: "var(--text-primary)",
      fontFamily: "var(--font-text)",
      minWidth: 0
    }
  }), value ? /*#__PURE__*/React.createElement("button", {
    onClick: onClear,
    "aria-label": "Clear",
    style: {
      border: "none",
      background: "none",
      cursor: "pointer",
      display: "flex",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-x-circle",
    style: {
      fontSize: 18,
      color: "var(--text-tertiary)"
    }
  })) : null);
}
Object.assign(__ds_scope, { SearchField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SearchField.jsx", error: String((e && e.message) || e) }); }

// components/core/SegmentedControl.jsx
try { (() => {
/** iOS segmented control. Sliding glass thumb under the active segment. */
function SegmentedControl({
  options = [],
  value,
  onChange,
  style = {}
}) {
  const idx = Math.max(0, options.findIndex(o => (o.value ?? o) === value));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "grid",
      gridTemplateColumns: `repeat(${options.length}, 1fr)`,
      padding: 3,
      borderRadius: "var(--radius-sm)",
      background: "var(--fill)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      top: 3,
      bottom: 3,
      left: `calc(${idx / options.length * 100}% + 3px)`,
      width: `calc(${100 / options.length}% - 6px)`,
      borderRadius: "calc(var(--radius-sm) - 3px)",
      background: "var(--bg-elevated)",
      boxShadow: "var(--shadow-card)",
      transition: "left var(--dur-base) var(--ease-glass)"
    }
  }), options.map(o => {
    const val = o.value ?? o;
    const label = o.label ?? o;
    const active = val === value;
    return /*#__PURE__*/React.createElement("button", {
      key: val,
      onClick: () => onChange && onChange(val),
      style: {
        position: "relative",
        zIndex: 1,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        padding: "7px 12px",
        font: `${active ? 600 : 500} 14px/1 var(--font-text)`,
        color: active ? "var(--text-primary)" : "var(--text-secondary)",
        transition: "color var(--dur-base)",
        WebkitTapHighlightColor: "transparent"
      }
    }, label);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/core/SortControl.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SortControl — Liquid Glass capsule that shows the current sort key and
 * a direction arrow that flips between ascending / descending on tap.
 * Tapping the label area is expected to open a sort menu (onPick).
 */
function SortControl({
  label = "Sort",
  direction = "desc",
  onToggleDirection,
  onPick,
  style = {},
  ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      display: "inline-flex",
      alignItems: "stretch",
      height: 40,
      borderRadius: "var(--radius-capsule)",
      background: "var(--glass-tint-regular)",
      backdropFilter: "blur(var(--glass-blur-regular)) saturate(var(--glass-saturate))",
      WebkitBackdropFilter: "blur(var(--glass-blur-regular)) saturate(var(--glass-saturate))",
      boxShadow: "var(--glass-specular), var(--shadow-card)",
      overflow: "hidden",
      ...style
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onPick,
    style: {
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
      WebkitTapHighlightColor: "transparent"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-arrows-down-up",
    style: {
      fontSize: 17,
      color: "var(--text-secondary)"
    }
  }), label), /*#__PURE__*/React.createElement("button", {
    onClick: onToggleDirection,
    "aria-label": direction === "asc" ? "Ascending" : "Descending",
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    style: {
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
      WebkitTapHighlightColor: "transparent"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: direction === "asc" ? "ph-bold ph-arrow-up" : "ph-bold ph-arrow-down",
    style: {
      fontSize: 16
    }
  })));
}
Object.assign(__ds_scope, { SortControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SortControl.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Sheet.jsx
try { (() => {
/**
 * Sheet — Liquid Glass modal that slides up from the bottom (iOS sheet).
 * Use for filters, create/edit forms, confirmations. Includes a grabber,
 * optional title, and a dimmed scrim.
 */
function Sheet({
  open,
  onClose,
  title,
  children,
  footer = null,
  maxWidth = 460
}) {
  React.useEffect(() => {
    const onKey = e => e.key === "Escape" && onClose && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": !open,
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 100,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      pointerEvents: open ? "auto" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,0.28)",
      opacity: open ? 1 : 0,
      transition: "opacity var(--dur-base) var(--ease-glass)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    style: {
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
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      paddingTop: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 5,
      borderRadius: 3,
      background: "var(--label-quaternary)"
    }
  })), title && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "8px 18px 10px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: "var(--t-title3)",
      letterSpacing: "-0.4px",
      color: "var(--text-primary)"
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      border: "none",
      background: "var(--fill)",
      width: 30,
      height: 30,
      borderRadius: "50%",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-x",
    style: {
      fontSize: 15,
      color: "var(--text-secondary)"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowY: "auto",
      padding: "4px 18px 18px",
      flex: 1
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 18px",
      borderTop: "1px solid var(--separator)"
    }
  }, footer)));
}
Object.assign(__ds_scope, { Sheet });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Sheet.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
/** Liquid Glass toast — brief confirmation that floats near the tab bar. */
function Toast({
  open,
  message,
  icon = "ph-fill ph-check-circle",
  tone = "accent",
  style = {}
}) {
  const toneColor = {
    accent: "var(--accent)",
    favorite: "var(--favorite)",
    neutral: "var(--text-secondary)"
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    "aria-live": "polite",
    style: {
      position: "fixed",
      left: "50%",
      bottom: 92,
      zIndex: 120,
      transform: `translateX(-50%) translateY(${open ? "0" : "16px"}) scale(${open ? 1 : 0.96})`,
      opacity: open ? 1 : 0,
      pointerEvents: "none",
      transition: "opacity var(--dur-base), transform var(--dur-base) var(--ease-spring)",
      display: "flex",
      alignItems: "center",
      gap: 9,
      padding: "11px 18px",
      borderRadius: "var(--radius-capsule)",
      background: "var(--glass-tint-thick)",
      backdropFilter: "blur(var(--glass-blur-thick)) saturate(var(--glass-saturate))",
      WebkitBackdropFilter: "blur(var(--glass-blur-thick)) saturate(var(--glass-saturate))",
      boxShadow: "var(--glass-specular), var(--shadow-float)",
      font: "var(--t-headline)",
      color: "var(--text-primary)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: icon,
    style: {
      fontSize: 20,
      color: toneColor
    }
  }), message);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TabBar.jsx
try { (() => {
/**
 * TabBar — floating Liquid Glass tab bar (iOS-26 / Telegram-iOS).
 * A frosted capsule that hovers above the content; the active tab gets
 * a tinted glass pill, filled icon, and accent color.
 */
function TabBar({
  items = [],
  value,
  onChange,
  floating = true,
  style = {}
}) {
  const activeIdx = Math.max(0, items.findIndex(it => it.value === value));
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 2,
      padding: 6,
      borderRadius: "var(--radius-capsule)",
      background: "var(--glass-tint-thin)",
      backdropFilter: "blur(var(--glass-blur-thick)) saturate(200%)",
      WebkitBackdropFilter: "blur(var(--glass-blur-thick)) saturate(200%)",
      boxShadow: "inset 0 1.5px 0 var(--glass-rim-strong), inset 1px 0 0 var(--glass-rim), inset 0 -1px 0 var(--glass-edge-shadow), 0 6px 16px rgba(0,0,0,0.10), 0 18px 40px rgba(0,0,0,0.16)",
      ...(floating ? {
        position: "fixed",
        left: "50%",
        bottom: 16,
        transform: "translateX(-50%)",
        zIndex: 50
      } : {}),
      ...style
    }
  }, items.map((it, idx) => {
    const active = it.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: it.value,
      onClick: () => onChange && onChange(it.value),
      "aria-label": it.label,
      "aria-current": active ? "page" : undefined,
      style: {
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
        background: active ? "color-mix(in srgb, var(--accent) 20%, transparent)" : "transparent",
        boxShadow: active ? "inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 1px rgba(0,0,0,0.04)" : "none",
        color: active ? "var(--accent-press)" : "var(--text-secondary)",
        transition: "background var(--dur-base) var(--ease-glass), color var(--dur-base)",
        WebkitTapHighlightColor: "transparent"
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: `${active ? "ph-fill" : "ph"} ${it.icon}`,
      style: {
        fontSize: 24,
        lineHeight: 1
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: "600 11px/1 var(--font-text)",
        letterSpacing: "0.1px"
      }
    }, it.label), it.badge ? /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        top: 4,
        right: 12,
        minWidth: 16,
        height: 16,
        padding: "0 4px",
        borderRadius: 8,
        background: "var(--sys-red)",
        color: "#fff",
        font: "700 10px/16px var(--font-text)",
        textAlign: "center",
        boxShadow: "0 0 0 2px var(--glass-tint-thick)"
      }
    }, it.badge) : null);
  }));
}
Object.assign(__ds_scope, { TabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TabBar.jsx", error: String((e && e.message) || e) }); }

// components/product/FavoriteButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Heart favorite toggle with a spring pop. Defaults to a floating glass chip. */
function FavoriteButton({
  active = false,
  onToggle,
  size = 36,
  chip = true,
  style = {},
  ...rest
}) {
  const [burst, setBurst] = React.useState(false);
  const handle = e => {
    e.stopPropagation();
    if (!active) {
      setBurst(true);
      setTimeout(() => setBurst(false), 360);
    }
    onToggle && onToggle(!active);
  };
  return /*#__PURE__*/React.createElement("button", _extends({}, rest, {
    onClick: handle,
    "aria-label": active ? "Remove from Favorites" : "Add to Favorites",
    "aria-pressed": active,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: "var(--radius-capsule)",
      border: "none",
      cursor: "pointer",
      background: chip ? "var(--glass-tint-thick)" : "transparent",
      backdropFilter: chip ? "blur(var(--glass-blur-regular)) saturate(var(--glass-saturate))" : "none",
      WebkitBackdropFilter: chip ? "blur(var(--glass-blur-regular)) saturate(var(--glass-saturate))" : "none",
      boxShadow: chip ? "var(--glass-specular), var(--shadow-card)" : "none",
      WebkitTapHighlightColor: "transparent",
      ...style
    }
  }), /*#__PURE__*/React.createElement("i", {
    className: active ? "ph-fill ph-heart" : "ph ph-heart",
    style: {
      fontSize: Math.round(size * 0.52),
      color: active ? "var(--favorite)" : "var(--text-secondary)",
      transform: burst ? "scale(1.3)" : "scale(1)",
      transition: "transform 0.36s var(--ease-spring), color var(--dur-fast)"
    }
  }));
}
Object.assign(__ds_scope, { FavoriteButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/FavoriteButton.jsx", error: String((e && e.message) || e) }); }

// components/product/PriceTag.jsx
try { (() => {
/** Formatted price. Optional struck-through compare-at price + sale styling. */
function PriceTag({
  amount,
  compareAt = null,
  currency = "$",
  size = "md",
  style = {}
}) {
  const sizes = {
    sm: {
      main: "700 16px/1 var(--font-display)",
      was: "12px"
    },
    md: {
      main: "700 20px/1 var(--font-display)",
      was: "13px"
    },
    lg: {
      main: "700 28px/1 var(--font-display)",
      was: "15px"
    }
  }[size];
  const onSale = compareAt != null && compareAt > amount;
  const fmt = n => `${currency}${Number(n).toLocaleString(undefined, {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2
  })}`;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "baseline",
      gap: 8,
      letterSpacing: "-0.4px",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: sizes.main,
      color: onSale ? "var(--sys-orange)" : "var(--price)"
    }
  }, fmt(amount)), onSale && /*#__PURE__*/React.createElement("span", {
    style: {
      font: `400 ${sizes.was}/1 var(--font-text)`,
      color: "var(--text-tertiary)",
      textDecoration: "line-through"
    }
  }, fmt(compareAt)));
}
Object.assign(__ds_scope, { PriceTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/PriceTag.jsx", error: String((e && e.message) || e) }); }

// components/product/ProductCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Internal swipeable image carousel with dots + tap zones. */
function ImageCarousel({
  images,
  ratio = "1 / 1",
  radius
}) {
  const [i, setI] = React.useState(0);
  const start = React.useRef(null);
  const list = images && images.length ? images : [null];
  const n = list.length;
  const go = d => setI(p => (p + d + n) % n);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: ratio,
      borderRadius: radius,
      overflow: "hidden",
      background: "var(--fill)"
    },
    onTouchStart: e => start.current = e.touches[0].clientX,
    onTouchEnd: e => {
      if (start.current == null) return;
      const dx = e.changedTouches[0].clientX - start.current;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      start.current = null;
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      height: "100%",
      transform: `translateX(-${i * 100}%)`,
      transition: "transform var(--dur-base) var(--ease-glass)"
    }
  }, list.map((src, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    style: {
      flex: "0 0 100%",
      height: "100%"
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--text-tertiary)"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-image",
    style: {
      fontSize: 40
    }
  }))))), n > 1 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    "aria-label": "Previous",
    onClick: () => go(-1),
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: "32%",
      border: "none",
      background: "transparent",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Next",
    onClick: () => go(1),
    style: {
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      width: "32%",
      border: "none",
      background: "transparent",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 10,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      gap: 5
    }
  }, list.map((_, idx) => /*#__PURE__*/React.createElement("span", {
    key: idx,
    style: {
      width: idx === i ? 16 : 6,
      height: 6,
      borderRadius: 3,
      background: idx === i ? "#fff" : "rgba(255,255,255,0.6)",
      boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
      transition: "width var(--dur-base) var(--ease-glass)"
    }
  })))));
}

/**
 * ProductCard — the central Vitan surface. Swipeable photo(s), name,
 * price, description, and actions (Add to Cart + favorite; Edit/Delete
 * for owners).
 */
function ProductCard({
  name,
  price,
  compareAt = null,
  description,
  images = [],
  badge = null,
  favorite = false,
  onToggleFavorite,
  onAddToCart,
  onEdit,
  onDelete,
  owner = false,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("article", _extends({}, rest, {
    style: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "var(--surface-card)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-card)",
      overflow: "hidden",
      ...style
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(ImageCarousel, {
    images: images,
    radius: "0"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 10,
      right: 10
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.FavoriteButton, {
    active: favorite,
    onToggle: onToggleFavorite
  })), badge && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 12,
      left: 12
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: badge.tone || "sale",
    solid: badge.solid
  }, badge.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 7,
      padding: "12px 13px 13px",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      font: "var(--t-headline)",
      color: "var(--text-primary)",
      letterSpacing: "-0.3px",
      display: "-webkit-box",
      WebkitLineClamp: 1,
      WebkitBoxOrient: "vertical",
      overflow: "hidden"
    }
  }, name), /*#__PURE__*/React.createElement(__ds_scope.PriceTag, {
    amount: price,
    compareAt: compareAt,
    size: "md"
  }), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: "var(--t-subhead)",
      color: "var(--text-secondary)",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden"
    }
  }, description), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      marginTop: "auto",
      paddingTop: 6
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "accent",
    size: "sm",
    icon: "ph ph-shopping-bag",
    block: true,
    onClick: onAddToCart
  }, "Add to Cart"), owner && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "glass",
    size: "sm",
    icon: "ph ph-pencil-simple",
    onClick: onEdit,
    style: {
      flex: 1
    }
  }, "Edit"), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "destructive",
    size: "sm",
    icon: "ph ph-trash",
    onClick: onDelete,
    style: {
      flex: 1
    }
  }, "Delete")))));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/ProductCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/vitan-app/Catalog.jsx
try { (() => {
// Catalog screen — header (name + search + create in one row), filter + sort
// toolbar, and the product grid. Composes DS components from the bundle.
const {
  Button,
  IconButton,
  SearchField,
  FilterChip,
  ProductCard,
  GlassPanel
} = window.VitanDesignSystem_b00aee;
const SORT_OPTIONS = [{
  value: "recent",
  label: "Most Recent",
  icon: "ph ph-clock-counter-clockwise"
}, {
  value: "price-asc",
  label: "Price: Low to High",
  icon: "ph ph-arrow-up"
}, {
  value: "price-desc",
  label: "Price: High to Low",
  icon: "ph ph-arrow-down"
}, {
  value: "name",
  label: "Name: A to Z",
  icon: "ph ph-sort-ascending"
}];
function CatalogHeader({
  query,
  setQuery,
  onCreate
}) {
  return /*#__PURE__*/React.createElement(GlassPanel, {
    material: "thick",
    radius: "0",
    style: {
      position: "sticky",
      top: 0,
      zIndex: 40,
      padding: "calc(env(safe-area-inset-top, 8px) + 12px) 16px 14px",
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--t-title1)",
      letterSpacing: "-0.5px",
      color: "var(--text-primary)",
      flexShrink: 0
    }
  }, "Vitan"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(SearchField, {
    value: query,
    onChange: e => setQuery(e.target.value),
    onClear: () => setQuery(""),
    placeholder: "Search"
  })), /*#__PURE__*/React.createElement(IconButton, {
    icon: "ph ph-plus",
    variant: "accent",
    label: "New Item",
    onClick: onCreate
  }));
}
function SortMenu({
  sort,
  setSort,
  open,
  onClose
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 44
    }
  }), /*#__PURE__*/React.createElement(GlassPanel, {
    material: "thick",
    radius: "var(--radius-md)",
    style: {
      position: "absolute",
      top: "calc(100% + 6px)",
      right: 0,
      zIndex: 45,
      width: 232,
      padding: 6,
      overflow: "hidden"
    }
  }, SORT_OPTIONS.map((o, i) => {
    const active = sort === o.value;
    return /*#__PURE__*/React.createElement("button", {
      key: o.value,
      onClick: () => {
        setSort(o.value);
        onClose();
      },
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        padding: "11px 12px",
        border: "none",
        cursor: "pointer",
        background: active ? "var(--vitan-tint)" : "transparent",
        borderRadius: "var(--radius-xs)",
        color: active ? "var(--accent-press)" : "var(--text-primary)",
        font: `${active ? 600 : 500} 15px/1 var(--font-text)`,
        WebkitTapHighlightColor: "transparent"
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: o.icon,
      style: {
        fontSize: 18,
        color: active ? "var(--accent)" : "var(--text-secondary)"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        textAlign: "left"
      }
    }, o.label), active && /*#__PURE__*/React.createElement("i", {
      className: "ph-bold ph-check",
      style: {
        fontSize: 16,
        color: "var(--accent)"
      }
    }));
  })));
}
function Toolbar({
  activeCount,
  onOpenFilters,
  sort,
  setSort
}) {
  const [sortOpen, setSortOpen] = React.useState(false);
  const isDefault = sort === "recent";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 16px 8px",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onOpenFilters,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      height: 40,
      padding: "0 14px",
      borderRadius: "var(--radius-capsule)",
      border: "none",
      cursor: "pointer",
      background: "var(--glass-tint-regular)",
      backdropFilter: "blur(var(--glass-blur-regular)) saturate(var(--glass-saturate))",
      WebkitBackdropFilter: "blur(var(--glass-blur-regular)) saturate(var(--glass-saturate))",
      boxShadow: "var(--glass-specular), var(--shadow-card)",
      font: "600 15px/1 var(--font-text)",
      color: "var(--text-primary)",
      letterSpacing: "-0.1px"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-sliders-horizontal",
    style: {
      fontSize: 18
    }
  }), "Filters", activeCount > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 20,
      height: 20,
      padding: "0 6px",
      borderRadius: 10,
      background: "var(--accent)",
      color: "#fff",
      font: "700 12px/20px var(--font-text)",
      textAlign: "center"
    }
  }, activeCount)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "ph ph-arrows-down-up",
    variant: "glass",
    label: "Sort",
    active: !isDefault || sortOpen,
    onClick: () => setSortOpen(o => !o)
  }), !isDefault && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 1,
      right: 1,
      width: 10,
      height: 10,
      borderRadius: 5,
      background: "var(--accent)",
      boxShadow: "0 0 0 2px var(--bg-elevated)"
    }
  }), /*#__PURE__*/React.createElement(SortMenu, {
    sort: sort,
    setSort: setSort,
    open: sortOpen,
    onClose: () => setSortOpen(false)
  })));
}
function Catalog({
  products,
  favs,
  onToggleFav,
  onAddToCart,
  onOpen,
  onCreate,
  onEdit,
  onDelete,
  onOpenFilters,
  query,
  setQuery,
  activeFilterCount,
  sort,
  setSort
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(CatalogHeader, {
    query: query,
    setQuery: setQuery,
    onCreate: onCreate
  }), /*#__PURE__*/React.createElement(Toolbar, {
    activeCount: activeFilterCount,
    onOpenFilters: onOpenFilters,
    sort: sort,
    setSort: setSort
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "4px 16px 130px"
    }
  }, products.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "64px 24px",
      color: "var(--text-secondary)"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-magnifying-glass",
    style: {
      fontSize: 40,
      color: "var(--text-tertiary)"
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--t-body)",
      marginTop: 12
    }
  }, "No items match these filters.")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 14
    }
  }, products.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    onClick: () => onOpen(p),
    style: {
      cursor: "pointer",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement(ProductCard, {
    name: p.name,
    price: p.price,
    compareAt: p.compareAt,
    description: p.description,
    images: p.images.map(window.VITAN_DATA.img),
    badge: p.compareAt ? {
      label: `-${Math.round((1 - p.price / p.compareAt) * 100)}%`,
      tone: "sale",
      solid: true
    } : !p.stock ? {
      label: "Sold Out",
      tone: "neutral"
    } : null,
    favorite: !!favs[p.id],
    onToggleFavorite: () => onToggleFav(p.id),
    onAddToCart: e => {
      e && e.stopPropagation && e.stopPropagation();
      onAddToCart(p);
    },
    owner: p.owner,
    onEdit: e => {
      e && e.stopPropagation && e.stopPropagation();
      onEdit(p);
    },
    onDelete: e => {
      e && e.stopPropagation && e.stopPropagation();
      onDelete(p);
    }
  }))))));
}
Object.assign(window, {
  Catalog
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/vitan-app/Catalog.jsx", error: String((e && e.message) || e) }); }

// ui_kits/vitan-app/FiltersSheet.jsx
try { (() => {
// Filters sheet — availability scope + category multi-select + sort key.
const {
  Sheet,
  SegmentedControl,
  FilterChip,
  Button
} = window.VitanDesignSystem_b00aee;
function FiltersSheet({
  open,
  onClose,
  scope,
  setScope,
  cats,
  setCats,
  onClear
}) {
  const categories = window.VITAN_DATA.categories;
  const toggle = k => setCats(cats.includes(k) ? cats.filter(x => x !== k) : [...cats, k]);
  const Label = ({
    children
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--t-footnote)",
      fontWeight: 600,
      color: "var(--text-secondary)",
      margin: "0 0 10px 4px"
    }
  }, children);
  return /*#__PURE__*/React.createElement(Sheet, {
    open: open,
    onClose: onClose,
    title: "Filters",
    footer: /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "lg",
      style: {
        flex: 1,
        borderRadius: "var(--radius-capsule)"
      },
      onClick: onClear
    }, "Clear All"), /*#__PURE__*/React.createElement(Button, {
      variant: "accent",
      size: "lg",
      style: {
        flex: 2,
        borderRadius: "var(--radius-capsule)"
      },
      onClick: onClose
    }, "Show Results"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Availability"), /*#__PURE__*/React.createElement(SegmentedControl, {
    options: [{
      label: "All",
      value: "all"
    }, {
      label: "In Stock",
      value: "stock"
    }, {
      label: "On Sale",
      value: "sale"
    }],
    value: scope,
    onChange: setScope
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Category"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8
    }
  }, categories.map(c => /*#__PURE__*/React.createElement(FilterChip, {
    key: c.key,
    icon: c.icon,
    selected: cats.includes(c.key),
    onClick: () => toggle(c.key)
  }, c.label))))));
}
Object.assign(window, {
  FiltersSheet
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/vitan-app/FiltersSheet.jsx", error: String((e && e.message) || e) }); }

// ui_kits/vitan-app/ItemForm.jsx
try { (() => {
// Create / Edit item form, presented in a Liquid Glass Sheet.
const {
  Sheet,
  Input,
  FilterChip,
  Button
} = window.VitanDesignSystem_b00aee;
function ItemForm({
  open,
  item,
  onClose,
  onSave
}) {
  const editing = !!item;
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [cat, setCat] = React.useState("furniture");
  React.useEffect(() => {
    if (open) {
      setName(item?.name || "");
      setPrice(item ? String(item.price) : "");
      setDesc(item?.description || "");
      setCat(item?.category || "furniture");
    }
  }, [open, item]);
  const cats = window.VITAN_DATA.categories;
  const save = () => {
    onSave({
      id: item?.id,
      name: name.trim() || "Untitled Item",
      price: parseFloat(price) || 0,
      description: desc.trim(),
      category: cat
    });
  };
  return /*#__PURE__*/React.createElement(Sheet, {
    open: open,
    onClose: onClose,
    title: editing ? "Edit Item" : "New Item",
    footer: /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "lg",
      style: {
        flex: 1,
        borderRadius: "var(--radius-capsule)"
      },
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      variant: "accent",
      size: "lg",
      style: {
        flex: 2,
        borderRadius: "var(--radius-capsule)"
      },
      icon: "ph ph-check",
      onClick: save
    }, editing ? "Save Changes" : "Add Item"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--t-footnote)",
      fontWeight: 600,
      color: "var(--text-secondary)",
      margin: "0 0 8px 4px"
    }
  }, "Photos"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      aspectRatio: "1 / 1",
      borderRadius: "var(--radius-sm)",
      background: "var(--fill-tertiary)",
      border: "1.5px dashed var(--separator)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--text-tertiary)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: i === 0 ? "ph ph-camera" : "ph ph-plus",
    style: {
      fontSize: i === 0 ? 24 : 20
    }
  }))))), /*#__PURE__*/React.createElement(Input, {
    label: "Item Name",
    placeholder: "e.g. Walnut Side Table",
    value: name,
    onChange: e => setName(e.target.value)
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Price",
    prefix: "ph ph-currency-dollar",
    placeholder: "0",
    inputMode: "decimal",
    value: price,
    onChange: e => setPrice(e.target.value.replace(/[^0-9.]/g, ""))
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--t-footnote)",
      fontWeight: 600,
      color: "var(--text-secondary)",
      margin: "0 0 8px 4px"
    }
  }, "Category"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8
    }
  }, cats.map(c => /*#__PURE__*/React.createElement(FilterChip, {
    key: c.key,
    icon: c.icon,
    selected: cat === c.key,
    onClick: () => setCat(c.key)
  }, c.label)))), /*#__PURE__*/React.createElement(Input, {
    label: "Description",
    multiline: true,
    placeholder: "Describe your item \u2014 material, size, condition\u2026",
    value: desc,
    onChange: e => setDesc(e.target.value)
  })));
}
Object.assign(window, {
  ItemForm
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/vitan-app/ItemForm.jsx", error: String((e && e.message) || e) }); }

// ui_kits/vitan-app/ProductDetail.jsx
try { (() => {
// Product detail screen — full-bleed photo carousel, glass back/favorite
// controls, info, and a pinned glass Add-to-Cart bar.
const {
  IconButton,
  FavoriteButton,
  PriceTag,
  Button,
  Badge,
  GlassPanel
} = window.VitanDesignSystem_b00aee;
function DetailCarousel({
  images
}) {
  const [i, setI] = React.useState(0);
  const start = React.useRef(null);
  const n = images.length;
  const go = d => setI(p => (p + d + n) % n);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: "4 / 3",
      background: "var(--fill)",
      overflow: "hidden"
    },
    onTouchStart: e => start.current = e.touches[0].clientX,
    onTouchEnd: e => {
      if (start.current == null) return;
      const dx = e.changedTouches[0].clientX - start.current;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      start.current = null;
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      height: "100%",
      transform: `translateX(-${i * 100}%)`,
      transition: "transform var(--dur-base) var(--ease-glass)"
    }
  }, images.map((src, idx) => /*#__PURE__*/React.createElement("img", {
    key: idx,
    src: src,
    alt: "",
    style: {
      flex: "0 0 100%",
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }))), n > 1 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    "aria-label": "Previous",
    onClick: () => go(-1),
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: "32%",
      border: "none",
      background: "transparent",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Next",
    onClick: () => go(1),
    style: {
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      width: "32%",
      border: "none",
      background: "transparent",
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 14,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      gap: 6
    }
  }, images.map((_, idx) => /*#__PURE__*/React.createElement("span", {
    key: idx,
    style: {
      width: idx === i ? 18 : 7,
      height: 7,
      borderRadius: 4,
      background: idx === i ? "#fff" : "rgba(255,255,255,0.6)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
      transition: "width var(--dur-base) var(--ease-glass)"
    }
  })))));
}
function ProductDetail({
  product,
  fav,
  onToggleFav,
  onBack,
  onAddToCart,
  onEdit,
  onDelete
}) {
  const p = product;
  const cat = window.VITAN_DATA.categories.find(c => c.key === p.category);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      minHeight: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(DetailCarousel, {
    images: p.images.map(window.VITAN_DATA.img)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "calc(env(safe-area-inset-top, 8px) + 10px)",
      left: 14,
      right: 14,
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "ph-bold ph-arrow-left",
    size: 40,
    label: "Back",
    onClick: onBack
  }), /*#__PURE__*/React.createElement(FavoriteButton, {
    active: fav,
    onToggle: onToggleFav,
    size: 40
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 18px 150px",
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, cat && /*#__PURE__*/React.createElement(Badge, {
    tone: "accent"
  }, /*#__PURE__*/React.createElement("i", {
    className: cat.icon,
    style: {
      fontSize: 13,
      marginRight: 2
    }
  }), cat.label), !p.stock && /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, "Sold Out")), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      font: "var(--t-title1)",
      letterSpacing: "-0.5px",
      color: "var(--text-primary)"
    }
  }, p.name), /*#__PURE__*/React.createElement(PriceTag, {
    amount: p.price,
    compareAt: p.compareAt,
    size: "lg"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: "var(--t-body)",
      color: "var(--text-secondary)"
    }
  }, p.description), p.owner && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "glass",
    icon: "ph ph-pencil-simple",
    style: {
      flex: 1
    },
    onClick: onEdit
  }, "Edit Item"), /*#__PURE__*/React.createElement(Button, {
    variant: "destructive",
    icon: "ph ph-trash",
    style: {
      flex: 1
    },
    onClick: onDelete
  }, "Delete"))), /*#__PURE__*/React.createElement(GlassPanel, {
    material: "thick",
    radius: "0",
    style: {
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 0,
      padding: "14px 18px calc(env(safe-area-inset-bottom, 10px) + 14px)",
      display: "flex",
      alignItems: "center",
      gap: 14,
      zIndex: 60
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--t-caption1)",
      color: "var(--text-secondary)"
    }
  }, "Price"), /*#__PURE__*/React.createElement(PriceTag, {
    amount: p.price,
    size: "md"
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    icon: "ph ph-shopping-bag",
    block: true,
    style: {
      flex: 1
    },
    onClick: () => onAddToCart(p),
    disabled: !p.stock
  }, p.stock ? "Add to Cart" : "Sold Out")));
}
Object.assign(window, {
  ProductDetail
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/vitan-app/ProductDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/vitan-app/data.js
try { (() => {
// Sample catalog data for the Vitan UI kit.
window.VITAN_DATA = {
  categories: [{
    key: "furniture",
    label: "Furniture",
    icon: "ph ph-armchair"
  }, {
    key: "lighting",
    label: "Lighting",
    icon: "ph ph-lamp"
  }, {
    key: "plants",
    label: "Plants",
    icon: "ph ph-plant"
  }, {
    key: "decor",
    label: "Decor",
    icon: "ph ph-frame-corners"
  }, {
    key: "kitchen",
    label: "Kitchen",
    icon: "ph ph-cooking-pot"
  }],
  img: s => `https://picsum.photos/seed/${s}/700/700`,
  products: [{
    id: "p1",
    name: "Walnut Side Table",
    price: 129,
    compareAt: 159,
    category: "furniture",
    stock: true,
    description: "Solid walnut with a hand-oiled finish. 45cm tall, ships flat with tool-free assembly.",
    images: ["vitan-table-a", "vitan-table-b", "vitan-table-c"],
    owner: true
  }, {
    id: "p2",
    name: "Arc Floor Lamp",
    price: 89,
    category: "lighting",
    stock: true,
    description: "Brushed-brass arc with a linen drum shade. Dimmable, 1.8m reach.",
    images: ["vitan-lamp-a", "vitan-lamp-b"]
  }, {
    id: "p3",
    name: "Stoneware Planter",
    price: 34,
    category: "plants",
    stock: true,
    description: "Matte stoneware with a hidden drainage tray. Pairs with mid-size foliage.",
    images: ["vitan-planter-a", "vitan-planter-b"],
    owner: true
  }, {
    id: "p4",
    name: "Linen Throw",
    price: 48,
    compareAt: 60,
    category: "decor",
    stock: true,
    description: "Stonewashed French linen, fringed edge. Warm sand colourway.",
    images: ["vitan-throw-a"]
  }, {
    id: "p5",
    name: "Ceramic Pour-Over",
    price: 42,
    category: "kitchen",
    stock: false,
    description: "Single-cup pour-over in speckled clay. Fits standard #2 filters.",
    images: ["vitan-pour-a", "vitan-pour-b"]
  }, {
    id: "p6",
    name: "Oak Stool",
    price: 76,
    category: "furniture",
    stock: true,
    description: "Stackable solid-oak stool with a sculpted seat. 45cm.",
    images: ["vitan-stool-a", "vitan-stool-b"]
  }, {
    id: "p7",
    name: "Paper Pendant",
    price: 64,
    category: "lighting",
    stock: true,
    description: "Hand-folded rice-paper pendant. Soft, even glow. 40cm dia.",
    images: ["vitan-pendant-a"]
  }, {
    id: "p8",
    name: "Trailing Pothos",
    price: 22,
    category: "plants",
    stock: true,
    description: "Easy-care trailing pothos in a 14cm nursery pot.",
    images: ["vitan-pothos-a", "vitan-pothos-b"]
  }]
};
// This is the user's own catalog — they own every listing (edit/delete everywhere).
window.VITAN_DATA.products.forEach(p => {
  p.owner = true;
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/vitan-app/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.FilterChip = __ds_scope.FilterChip;

__ds_ns.GlassPanel = __ds_scope.GlassPanel;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.SearchField = __ds_scope.SearchField;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.SortControl = __ds_scope.SortControl;

__ds_ns.Sheet = __ds_scope.Sheet;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.TabBar = __ds_scope.TabBar;

__ds_ns.FavoriteButton = __ds_scope.FavoriteButton;

__ds_ns.PriceTag = __ds_scope.PriceTag;

__ds_ns.ProductCard = __ds_scope.ProductCard;

})();
