"use client";

import React, {useRef} from "react";

// ── FilterChip ─────────────────────────────────────────────────────────────

interface FilterChipProps {
    selected: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

const FilterChip = ({selected, onClick, children}: FilterChipProps) => (
    <button
        type="button"
        onClick={onClick}
        style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            font: `600 14px/1 var(--font-text)`,
            letterSpacing: "-0.1px",
            padding: "8px 13px",
            borderRadius: "var(--radius-capsule)",
            border: "none",
            cursor: "pointer",
            color: selected ? "#fff" : "var(--text-primary)",
            background: selected ? "#1c1c1e" : "var(--fill)",
            boxShadow: selected ? "var(--shadow-card)" : "none",
            transition: "background var(--dur-base), color var(--dur-base)",
            WebkitTapHighlightColor: "transparent",
        }}
    >
        {selected && (
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 6.5L5 9.5L11 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        )}
        {children}
    </button>
);

// ── PriceRangeSlider ────────────────────────────────────────────────────────

interface PriceRangeSliderProps {
    min: number;
    max: number;
    absoluteMin: number;
    absoluteMax: number;
    onChange: (min: number, max: number) => void;
}

const PriceRangeSlider = ({min, max, absoluteMin, absoluteMax, onChange}: PriceRangeSliderProps) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const dragging = useRef<"min" | "max" | null>(null);

    const totalRange = absoluteMax - absoluteMin || 1;
    const gap = Math.max(1, Math.round(totalRange * 0.005));

    // Clamped percentage [0..100]
    const pct = (v: number) =>
        Math.max(0, Math.min(100, ((v - absoluteMin) / totalRange) * 100));

    const valueAt = (clientX: number): number => {
        const el = trackRef.current;
        if (!el) return absoluteMin;
        const rect = el.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        return Math.round(absoluteMin + ratio * totalRange);
    };

    const moveThumb = (val: number) => {
        if (dragging.current === "min") {
            onChange(Math.max(absoluteMin, Math.min(val, max - gap)), max);
        } else if (dragging.current === "max") {
            onChange(min, Math.min(absoluteMax, Math.max(val, min + gap)));
        }
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        const val = valueAt(e.clientX);
        const distMin = Math.abs(val - min);
        const distMax = Math.abs(val - max);
        dragging.current = (distMin < distMax || (distMin === distMax && val < (min + max) / 2))
            ? "min" : "max";
        moveThumb(val);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!dragging.current) return;
        moveThumb(valueAt(e.clientX));
    };

    const handlePointerUp = () => { dragging.current = null; };

    const inputStyle: React.CSSProperties = {
        width: 72,
        padding: "7px 8px",
        font: `600 14px/1 var(--font-text)`,
        color: "var(--text-primary)",
        background: "var(--fill)",
        border: "none",
        borderRadius: "var(--radius-sm)",
        outline: "none",
        textAlign: "center",
        WebkitAppearance: "none",
        MozAppearance: "textfield",
    };

    const labelStyle: React.CSSProperties = {
        font: "500 13px/1 var(--font-text)",
        color: "var(--text-secondary)",
        flexShrink: 0,
    };

    const minPct = pct(min);
    const maxPct = pct(max);

    return (
        <div style={{display: "flex", flexDirection: "column", gap: 16}}>
            {/* Inputs row — labels as flex siblings, not absolute */}
            <div style={{display: "flex", alignItems: "center", gap: 6}}>
                <span style={labelStyle}>від</span>
                <input
                    type="number"
                    value={min}
                    onChange={e => {
                        const v = parseInt(e.target.value, 10);
                        if (!isNaN(v)) onChange(Math.max(absoluteMin, Math.min(v, max - gap)), max);
                    }}
                    style={inputStyle}
                />
                <span style={{...labelStyle, flex: 1, textAlign: "center"}}>—</span>
                <span style={labelStyle}>до</span>
                <input
                    type="number"
                    value={max}
                    onChange={e => {
                        const v = parseInt(e.target.value, 10);
                        if (!isNaN(v)) onChange(min, Math.min(absoluteMax, Math.max(v, min + gap)));
                    }}
                    style={inputStyle}
                />
                <span style={labelStyle}>₴</span>
            </div>

            {/* Slider track */}
            <div
                ref={trackRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{position: "relative", height: 36, cursor: "pointer", touchAction: "none"}}
            >
                {/* Background track */}
                <div style={{
                    position: "absolute",
                    top: "50%", left: 0, right: 0,
                    height: 4, borderRadius: 2,
                    background: "var(--fill-secondary)",
                    transform: "translateY(-50%)",
                }}>
                    {/* Active fill between thumbs */}
                    <div style={{
                        position: "absolute",
                        left: `${minPct}%`,
                        right: `${100 - maxPct}%`,
                        height: "100%",
                        borderRadius: 2,
                        background: "#1c1c1e",
                    }} />
                </div>

                {/* Min thumb */}
                <div style={{
                    position: "absolute",
                    left: `${minPct}%`,
                    top: "50%",
                    width: 24, height: 24,
                    borderRadius: "50%",
                    background: "white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.18), 0 0 0 1.5px rgba(0,0,0,0.1)",
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none",
                    willChange: "left",
                }} />
                {/* Max thumb */}
                <div style={{
                    position: "absolute",
                    left: `${maxPct}%`,
                    top: "50%",
                    width: 24, height: 24,
                    borderRadius: "50%",
                    background: "white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.18), 0 0 0 1.5px rgba(0,0,0,0.1)",
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none",
                    willChange: "left",
                }} />
            </div>

            {/* Absolute min/max hint */}
            <div style={{display: "flex", justifyContent: "space-between", font: "var(--t-footnote)", color: "var(--text-tertiary)"}}>
                <span>{absoluteMin} ₴</span>
                <span>{absoluteMax} ₴</span>
            </div>
        </div>
    );
};

// ── FiltersSheet (dropdown popover) ────────────────────────────────────────

interface FiltersSheetProps {
    open: boolean;
    categories: string[];
    selectedCategories: string[];
    onCategoriesChange: (cats: string[]) => void;
    priceMin: number;
    priceMax: number;
    absoluteMin: number;
    absoluteMax: number;
    onPriceChange: (min: number, max: number) => void;
    activeFilterCount: number;
    onClear: () => void;
    onClose: () => void;
}

export const FiltersSheet = ({
    open,
    categories,
    selectedCategories,
    onCategoriesChange,
    priceMin,
    priceMax,
    absoluteMin,
    absoluteMax,
    onPriceChange,
    activeFilterCount,
    onClear,
    onClose,
}: FiltersSheetProps) => {
    const hasPriceData = absoluteMax > absoluteMin;

    const toggleCategory = (cat: string) => {
        onCategoriesChange(
            selectedCategories.includes(cat)
                ? selectedCategories.filter(c => c !== cat)
                : [...selectedCategories, cat]
        );
    };

    if (!open) return null;

    return (
        <div style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            zIndex: 70,
            width: "min(340px, calc(100vw - 32px))",
            background: "var(--glass-tint-thick)",
            backdropFilter: "blur(var(--glass-blur-thick)) saturate(var(--glass-saturate))",
            WebkitBackdropFilter: "blur(var(--glass-blur-thick)) saturate(var(--glass-saturate))",
            borderRadius: "var(--radius-xl)",
            border: "0.5px solid rgba(255, 255, 255, 0.45)",
            boxShadow: [
                "inset 0 1px 0 0 var(--glass-rim-strong)",
                "inset 1px 0 0 0 var(--glass-rim)",
                "inset 0 -1px 0 0 var(--glass-edge-shadow)",
                "var(--shadow-float)",
            ].join(", "),
            overflow: "hidden",
            isolation: "isolate",
        } as React.CSSProperties}>
            {/* Content */}
            <div style={{padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 20}}>
                {/* Categories */}
                {categories.length > 0 && (
                    <div>
                        <p style={{font: "600 11px/1 var(--font-text)", letterSpacing: "0.5px", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10}}>
                            Категорія
                        </p>
                        <div style={{display: "flex", flexWrap: "wrap", gap: 6}}>
                            {categories.map(cat => (
                                <FilterChip
                                    key={cat}
                                    selected={selectedCategories.includes(cat)}
                                    onClick={() => toggleCategory(cat)}
                                >
                                    {cat}
                                </FilterChip>
                            ))}
                        </div>
                    </div>
                )}

                {/* Price range */}
                {hasPriceData && (
                    <div>
                        <p style={{font: "600 11px/1 var(--font-text)", letterSpacing: "0.5px", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 14}}>
                            Ціна, ₴
                        </p>
                        <PriceRangeSlider
                            min={priceMin}
                            max={priceMax}
                            absoluteMin={absoluteMin}
                            absoluteMax={absoluteMax}
                            onChange={onPriceChange}
                        />
                    </div>
                )}
            </div>

            {/* Footer */}
            <div style={{
                padding: "10px 16px 14px",
                borderTop: "1px solid var(--separator)",
                display: "flex", gap: 8, marginTop: 4,
            }}>
                <button
                    type="button"
                    onClick={onClear}
                    style={{
                        flex: 1,
                        padding: "10px 12px",
                        borderRadius: "var(--radius-capsule)",
                        border: "none",
                        background: "var(--fill)",
                        font: `600 14px/1 var(--font-text)`,
                        color: activeFilterCount > 0 ? "var(--destructive)" : "var(--text-secondary)",
                        cursor: "pointer",
                    }}
                >
                    Скинути {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    style={{
                        flex: 2,
                        padding: "10px 12px",
                        borderRadius: "var(--radius-capsule)",
                        border: "none",
                        background: "#1c1c1e",
                        font: `600 14px/1 var(--font-text)`,
                        color: "#fff",
                        cursor: "pointer",
                    }}
                >
                    Показати результати
                </button>
            </div>
        </div>
    );
};
