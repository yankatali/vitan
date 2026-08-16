export const RELATED_PRODUCTS_SCROLL_STEP = 300;

export const RELATED_PRODUCTS_CLASS_NAMES = {
    section: "min-w-0",
    title: "mb-2 px-0.5 text-[13px] font-semibold text-[var(--text-primary)]",
    viewportWrapper: "relative min-w-0",
    scroller: "flex gap-2 pb-1 [-ms-overflow-style:none] [overscroll-behavior-x:contain] [overflow-x:auto] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
    item: "w-[140px] shrink-0",
    scrollButton: "absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 shadow-[0_2px_8px_rgba(0,0,0,0.14)] backdrop-blur-md transition-opacity active:opacity-70",
    scrollButtonLeft: "left-0",
    scrollButtonRight: "right-0",
};
