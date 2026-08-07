import {PAGE_CONTENT_PX} from "@/constants/pageLayout";

export const CART_CLASS_NAMES = {
    page: "flex min-h-screen flex-col text-[var(--text-primary)] overflow-x-clip",

    homeLink: "whitespace-nowrap text-[22px] font-bold leading-7 tracking-[-0.4px] text-[var(--text-primary)] [font-family:var(--font-brand)]",
    title: "whitespace-nowrap text-[17px] font-bold leading-[22px] text-[var(--text-primary)]",
    content: `grid gap-4 pt-3 pb-4 ${PAGE_CONTENT_PX}`,
    emptyState: "liquid-surface rounded-3xl p-6 text-sm text-[#6b615b]",
    list: "grid gap-3",
    item: "liquid-surface grid grid-cols-[80px_1fr] gap-3 rounded-3xl p-2 md:grid-cols-[120px_1fr_auto] md:items-center",
    image: "aspect-square w-full rounded-3xl object-cover",
    imagePlaceholder: "flex aspect-square w-full items-center justify-center rounded-3xl bg-[rgba(255,255,255,0.15)] text-[var(--text-tertiary)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]",
    itemInfo: "grid gap-1 min-w-0",
    name: "text-base font-semibold",
    price: "text-sm font-semibold text-[#336651]",
    controls: "col-span-2 flex items-center justify-between gap-3 md:col-span-1 md:justify-end",
    quantityGroup: "liquid-control inline-flex items-center overflow-hidden rounded-[var(--radius-md)] self-end",
    quantityButton: "h-10 w-10 text-lg font-semibold text-[#17150c] disabled:cursor-not-allowed disabled:opacity-40",
    quantityValue: "min-w-10 text-center text-sm font-semibold",
    removeButton: "inline-flex h-[45px] w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--fill)] text-[var(--destructive)] transition-all duration-200 hover:bg-[rgba(255,59,48,0.2)] active:scale-[0.92]",
    summary: "liquid-button rounded-3xl p-5 text-[var(--text-primary)]",
    summaryRow: "flex items-center justify-between gap-4 text-sm",
    summaryTotal: "mt-2 flex items-center justify-between gap-4 text-lg font-bold",
};
