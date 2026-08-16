"use client";

import {useEffect} from "react";
import {FOOTER_BOTTOM_CSS_VAR} from "@/constants/footer";

interface UseFooterBottomInsetOptions {
    enabled: boolean;
    insetPx?: number;
    mediaQuery?: string;
}

export const useFooterBottomInset = ({
    enabled,
    insetPx = 200,
    mediaQuery,
}: UseFooterBottomInsetOptions) => {
    useEffect(() => {
        const root = document.documentElement;

        if (!enabled) {
            root.style.removeProperty(FOOTER_BOTTOM_CSS_VAR);
            return;
        }

        const media = mediaQuery ? window.matchMedia(mediaQuery) : null;
        const applyInset = () => {
            if (media && !media.matches) {
                root.style.removeProperty(FOOTER_BOTTOM_CSS_VAR);
                return;
            }

            root.style.setProperty(FOOTER_BOTTOM_CSS_VAR, `${insetPx}px`);
        };

        applyInset();
        media?.addEventListener("change", applyInset);

        return () => {
            media?.removeEventListener("change", applyInset);
            root.style.removeProperty(FOOTER_BOTTOM_CSS_VAR);
        };
    }, [enabled, insetPx, mediaQuery]);
};
