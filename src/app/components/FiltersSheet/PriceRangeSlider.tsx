import {useEffect, useRef} from "react";
import type {PointerEvent} from "react";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {PRICE_RANGE_INPUT_CLASS_NAME, PRICE_RANGE_LABEL_CLASS_NAME, PRICE_RANGE_THUMB_CLASS_NAME} from "@/constants/priceRangeSlider";
import type {PriceRangeSliderProps} from "@/types/props";


export const PriceRangeSlider = ({min, max, absoluteMin, absoluteMax, onChange}: PriceRangeSliderProps) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const dragging = useRef<"min" | "max" | null>(null);

    const totalRange = absoluteMax - absoluteMin || 1;
    const gap = Math.max(1, Math.round(totalRange * 0.005));

    const pct = (value: number) =>
        Math.max(0, Math.min(100, ((value - absoluteMin) / totalRange) * 100));

    const valueAt = (clientX: number): number => {
        const el = trackRef.current;
        if (!el) return absoluteMin;
        const rect = el.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        return Math.round(absoluteMin + ratio * totalRange);
    };

    const moveThumb = (value: number) => {
        if (dragging.current === "min") {
            onChange(Math.max(absoluteMin, Math.min(value, max - gap)), max);
        } else if (dragging.current === "max") {
            onChange(min, Math.min(absoluteMax, Math.max(value, min + gap)));
        }
    };

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        const value = valueAt(event.clientX);
        const distMin = Math.abs(value - min);
        const distMax = Math.abs(value - max);

        dragging.current = (distMin < distMax || (distMin === distMax && value < (min + max) / 2))
            ? "min"
            : "max";

        moveThumb(value);
    };

    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
        if (!dragging.current) return;
        moveThumb(valueAt(event.clientX));
    };

    const handlePointerUp = () => {
        dragging.current = null;
    };

    const minPct = pct(min);
    const maxPct = pct(max);
    const copy = useSiteContent().catalog.filtersSheet;

    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        slider.style.setProperty("--price-min-pct", `${minPct}%`);
        slider.style.setProperty("--price-max-pct", `${maxPct}%`);
    }, [minPct, maxPct]);

    return (
        <div
            ref={sliderRef}
            className="flex flex-col gap-4 [--price-max-pct:100%] [--price-min-pct:0%]"
        >
            <div className="flex items-center gap-1.5">
                <span className={PRICE_RANGE_LABEL_CLASS_NAME}>{copy.rangeFrom}</span>
                <input
                    type="number"
                    value={min}
                    onChange={event => {
                        const value = parseInt(event.target.value, 10);
                        if (!isNaN(value)) onChange(Math.max(absoluteMin, Math.min(value, max - gap)), max);
                    }}
                    className={PRICE_RANGE_INPUT_CLASS_NAME}
                />
                <span className={`${PRICE_RANGE_LABEL_CLASS_NAME} flex-1 text-center`}>—</span>
                <span className={PRICE_RANGE_LABEL_CLASS_NAME}>{copy.rangeTo}</span>
                <input
                    type="number"
                    value={max}
                    onChange={event => {
                        const value = parseInt(event.target.value, 10);
                        if (!isNaN(value)) onChange(min, Math.min(absoluteMax, Math.max(value, min + gap)));
                    }}
                    className={PRICE_RANGE_INPUT_CLASS_NAME}
                />
                <span className={PRICE_RANGE_LABEL_CLASS_NAME}>{copy.currency}</span>
            </div>

            <div
                ref={trackRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="relative h-9 cursor-pointer touch-none"
            >
                <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-sm bg-[var(--fill-secondary)]">
                    <div className="absolute left-[var(--price-min-pct)] right-[calc(100%-var(--price-max-pct))] h-full rounded-sm bg-[#1c1c1e]" />
                </div>

                <div className={`${PRICE_RANGE_THUMB_CLASS_NAME} left-[var(--price-min-pct)]`} />
                <div className={`${PRICE_RANGE_THUMB_CLASS_NAME} left-[var(--price-max-pct)]`} />
            </div>

            <div className="flex justify-between text-[var(--text-tertiary)] [font:var(--t-footnote)]">
                <span>{absoluteMin} {copy.currency}</span>
                <span>{absoluteMax} {copy.currency}</span>
            </div>
        </div>
    );
};
