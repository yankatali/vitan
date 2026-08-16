import {PAGE_CONTENT_PX, CARD_GRID_GAP} from "@/constants/pageLayout";

export const PRODUCT_LIST_CLASS_NAMES = {
    mainPageContainer: "flex flex-col gap-2 text-[var(--text-primary)]",
    mainPageRoot: "flex flex-1 flex-col",

    mainPageToolbarSticky: "sticky top-0 z-20 flex flex-col gap-3 pt-3",
    mainPageHeader: "flex items-center justify-between gap-4",
    mainPageToolbarTitleGroup: "flex items-center gap-3",
    mainPageToolbarTitle: "cursor-pointer whitespace-nowrap text-[22px] font-bold leading-7 tracking-[-0.4px] text-[var(--text-primary)] [font-family:var(--font-brand)]",
    mainPageSearch: "min-w-0",
    mainPageActions: "flex items-center justify-end gap-3",
    mainPageToolbarNav: "hidden items-center gap-4 lg:flex",
    mainPageCreator: "flex justify-end",
    mainPageToolbarOuter: PAGE_CONTENT_PX,
    mainPageFilters: "flex flex-wrap gap-2 px-4 lg:px-6",
    mainPageSort: "px-4 lg:px-6",
    mainPageGrid: `grid grid-cols-2 content-start items-stretch ${CARD_GRID_GAP} ${PAGE_CONTENT_PX} pb-4 pt-3 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5`,
    mainPageMessage: "col-span-full rounded-[var(--radius-xl)] px-6 py-16 text-center text-[15px] leading-5 text-[var(--text-secondary)]",
    defaultFilterWrapper: "flex flex-wrap gap-2 px-3",
    defaultSortWrapper: "px-3",
    categoryDropdownWrapper: "relative h-11",
    categoryDropdownButton: "vitan-accent-button inline-flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-200 hover:scale-[1.04] active:scale-[0.96]",
    filterButton: "inline-flex h-10 items-center gap-2 rounded-[var(--radius-capsule)] bg-white/30 px-4 text-[15px] font-semibold leading-none tracking-[-0.1px] text-[var(--text-primary)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),inset_0_-1px_1px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.1),0_0_0_0.5px_rgba(0,0,0,0.04)] backdrop-blur-md transition-transform duration-200 hover:scale-[1.02] active:scale-[0.96]",
    activeFilterCountBadge: "grid h-5 min-w-5 place-items-center rounded-full bg-[#1c1c1e] px-1.5 text-xs font-bold leading-5 text-white",
    categoryDropdownMenu: "liquid-popover absolute left-0 top-[calc(100%+0.5rem)] z-[70] grid max-h-72 min-w-64 gap-2 overflow-y-auto rounded-[var(--radius-xl)] p-2",
    categoryInlineRow: "flex w-full min-w-0 items-center justify-between gap-3 px-4 md:px-[48px] lg:px-[64px] xl:px-[128px]",
    sortDropdownWrapper: "relative flex h-11 items-center",
    sortButton: "relative inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-capsule)] bg-white/30 text-[var(--text-primary)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),inset_0_-1px_1px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.1),0_0_0_0.5px_rgba(0,0,0,0.04)] backdrop-blur-md transition-transform duration-200 hover:scale-[1.04] active:scale-[0.94]",
    sortDropdownMenu: "liquid-popover absolute right-0 top-[calc(100%+0.5rem)] z-[70] grid min-w-64 gap-1 rounded-[var(--radius-xl)] p-2",
    toolbarSortSelect: "vitan-glass-chip h-10 w-fit appearance-none rounded-[var(--radius-capsule)] px-3 pr-7 text-[15px] font-semibold text-[var(--text-primary)] outline-none transition-all [field-sizing:content]",
};

export const PRODUCT_LIST_SORT_OPTION_BASE_CLASS_NAME = "inline-flex min-h-11 w-full items-center justify-between gap-3 rounded-[var(--radius-lg)] px-4 text-left text-[15px] leading-none tracking-[-0.1px] transition-all duration-200 active:scale-[0.98]";
