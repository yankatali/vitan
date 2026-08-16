import {PAGE_CONTENT_PX, CARD_GRID_GAP} from "@/constants/pageLayout";

export const WISHLIST_STORAGE_KEY = "vitan-favorite-product-ids";

export const WISHLIST_CLASS_NAMES = {
    page: "flex flex-col text-[var(--text-primary)] overflow-x-clip",

    homeLink: "whitespace-nowrap text-[22px] font-bold leading-7 tracking-[-0.4px] text-[var(--text-primary)] [font-family:var(--font-brand)]",
    title: "whitespace-nowrap text-[17px] font-bold leading-[22px] text-[var(--text-primary)]",
    content: `grid gap-4 pt-3 pb-4 ${PAGE_CONTENT_PX}`,
    emptyState: "liquid-surface rounded-3xl p-6 text-sm text-[#6b615b]",
    list: `grid grid-cols-2 content-start items-stretch ${CARD_GRID_GAP} md:grid-cols-3 xl:grid-cols-4`,
    item: "liquid-surface grid grid-cols-[80px_1fr] gap-3 rounded-3xl p-2 md:grid-cols-[120px_1fr_auto] md:items-center",
    image: "aspect-square w-full rounded-3xl object-cover",
    imagePlaceholder: "flex aspect-square w-full items-center justify-center rounded-3xl bg-[rgba(255,255,255,0.15)] text-[var(--text-tertiary)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]",
    itemInfo: "grid gap-1 min-w-0",
    category: "text-xs uppercase tracking-wide text-[#98887e]",
    name: "text-base font-semibold",
    price: "text-sm font-semibold text-[#336651]",
    controls: "col-span-2 flex flex-wrap items-center justify-between gap-2 md:col-span-1 md:justify-end",
    cartButton: "liquid-button rounded-full px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.03]",
    activeCartButton: "liquid-button-success rounded-full px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.03]",
    removeButton: "liquid-button-danger rounded-full px-4 py-2 text-sm font-semibold text-[#8c2d1d] transition-transform hover:scale-[1.03]",
    summary: "liquid-button rounded-3xl p-5 text-[var(--text-primary)]",
    summaryRow: "flex items-center justify-between gap-4 text-sm font-semibold",
    summaryTotal: "mt-2 flex items-center justify-between gap-4 text-lg font-bold",
};
