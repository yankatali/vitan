import {useEffect, useState} from "react";

const NAV_BOTTOM = 85;

export const useBarBottom = () => {
    const [bottom, setBottom] = useState(NAV_BOTTOM + 5);

    useEffect(() => {
        const getFooterVisible = () => {
            const footer = document.getElementById("site-footer");
            if (!footer) return 0;
            const rect = footer.getBoundingClientRect();
            return Math.max(0, window.innerHeight - rect.top);
        };

        const update = () => {
            const footerVisible = getFooterVisible();
            setBottom(Math.max(NAV_BOTTOM + 5, footerVisible + 10));
        };

        const footer = document.getElementById("site-footer");
        let observer: IntersectionObserver | null = null;

        if (footer) {
            observer = new IntersectionObserver(
                () => update(),
                {threshold: Array.from({length: 21}, (_, i) => i / 20)},
            );
            observer.observe(footer);
        }

        const onScroll = () => requestAnimationFrame(update);

        window.addEventListener("scroll", onScroll, {passive: true});
        document.addEventListener("scroll", onScroll, {passive: true});
        window.addEventListener("resize", update, {passive: true});

        requestAnimationFrame(update);

        return () => {
            observer?.disconnect();
            window.removeEventListener("scroll", onScroll);
            document.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", update);
        };
    }, []);

    return bottom;
};
