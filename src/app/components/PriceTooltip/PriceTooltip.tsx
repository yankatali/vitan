"use client";

import {useEffect, useId, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {TOOLTIP_GAP, TOOLTIP_WIDTH, VIEWPORT_PADDING} from "@/constants/priceTooltip";

interface PriceTooltipProps {
    text?: string;
}

interface TooltipPosition {
    left: number;
    top: number;
    placement: "top" | "bottom";
}

export const PriceTooltip = ({text}: PriceTooltipProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState<TooltipPosition | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const tooltipId = useId();
    const content = text?.trim();

    useEffect(() => {
        if (!isOpen) return;

        const updatePosition = () => {
            const button = buttonRef.current;
            if (!button) return;

            const rect = button.getBoundingClientRect();
            const left = Math.min(
                window.innerWidth - TOOLTIP_WIDTH - VIEWPORT_PADDING,
                Math.max(VIEWPORT_PADDING, rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2),
            );
            const topPlacementTop = rect.top - TOOLTIP_GAP;
            const placement = topPlacementTop > 48 ? "top" : "bottom";
            const top = placement === "top" ? topPlacementTop : rect.bottom + TOOLTIP_GAP;

            setPosition({left, top, placement});
        };

        updatePosition();
        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);

        return () => {
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [isOpen]);

    if (!content) return null;

    return (
        <span
            className="inline-flex"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
        >
            <button
                ref={buttonRef}
                type="button"
                className="inline-flex h-3.5 w-3.5 cursor-help items-center justify-center rounded-full bg-[#0ba862]/15 text-[9px] font-bold leading-none text-[#0ba862]"
                aria-describedby={isOpen ? tooltipId : undefined}
                aria-expanded={isOpen}
                onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setIsOpen(currentValue => !currentValue);
                }}
            >
                ?
            </button>
            {isOpen && position && typeof document !== "undefined" && createPortal(
                <span
                    id={tooltipId}
                    role="tooltip"
                    className="pointer-events-none fixed z-[260] w-52 rounded-[var(--radius-md)] bg-[#1c1c1e] px-3 py-2 text-left text-[11px] font-semibold leading-4 text-white shadow-[0_8px_24px_rgba(0,0,0,0.22)]"
                    style={{
                        left: position.left,
                        top: position.top,
                        transform: position.placement === "top" ? "translateY(-100%)" : undefined,
                    }}
                >
                    {content}
                </span>,
                document.body,
            )}
        </span>
    );
};
