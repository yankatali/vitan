import type {ReactNode} from "react";
import {PriceRangeSlider} from "@/app/components/FiltersSheet/PriceRangeSlider";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import type {FilterChipProps, FiltersSheetProps} from "@/types/props";


const FilterChip = ({selected, onClick, children}: FilterChipProps) => (
    <button
        type="button"
        onClick={onClick}
        className={[
            "inline-flex cursor-pointer items-center gap-1.5 rounded-[var(--radius-capsule)] border-0 px-[13px] py-2",
            "text-sm font-semibold leading-none tracking-normal [font-family:var(--font-text)]",
            "transition-[background,color] duration-[var(--dur-base)] [-webkit-tap-highlight-color:transparent]",
            selected
                ? "bg-[#1c1c1e] text-white shadow-[var(--shadow-card)]"
                : "bg-[var(--fill)] text-[var(--text-primary)]",
        ].join(" ")}
    >
        {selected && (
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 6.5L5 9.5L11 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        )}
        {children}
    </button>
);

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
    const copy = useSiteContent().catalog.filtersSheet;

    const toggleCategory = (cat: string) => {
        onCategoriesChange(
            selectedCategories.includes(cat)
                ? selectedCategories.filter(c => c !== cat)
                : [...selectedCategories, cat]
        );
    };

    if (!open) return null;

    return (
        <div className="absolute left-0 top-[calc(100%+8px)] z-[70] isolate w-[min(340px,calc(100vw-32px))] overflow-hidden rounded-[var(--radius-xl)] border-[0.5px] border-[rgba(255,255,255,0.45)] bg-[var(--glass-tint-thick)] shadow-[inset_0_1px_0_0_var(--glass-rim-strong),inset_1px_0_0_0_var(--glass-rim),inset_0_-1px_0_0_var(--glass-edge-shadow),var(--shadow-float)] backdrop-blur-[var(--glass-blur-thick)] backdrop-saturate-[var(--glass-saturate)]">
            <div className="flex flex-col gap-5 px-4 pb-2 pt-4">
                {categories.length > 0 && (
                    <div>
                        <p className="mb-2.5 text-[11px] font-semibold uppercase leading-none tracking-normal text-[var(--text-secondary)] [font-family:var(--font-text)]">
                            {copy.categoryTitle}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
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

                {hasPriceData && (
                    <div>
                        <p className="mb-3.5 text-[11px] font-semibold uppercase leading-none tracking-normal text-[var(--text-secondary)] [font-family:var(--font-text)]">
                            {copy.priceTitle}
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

            <div className="mt-1 flex gap-2 border-t border-[var(--separator)] px-4 pb-3.5 pt-2.5">
                <button
                    type="button"
                    onClick={onClear}
                    className={[
                        "flex-1 cursor-pointer rounded-[var(--radius-capsule)] border-0 bg-[var(--fill)] px-3 py-2.5",
                        "text-sm font-semibold leading-none tracking-normal [font-family:var(--font-text)]",
                        activeFilterCount > 0 ? "text-[var(--destructive)]" : "text-[var(--text-secondary)]",
                    ].join(" ")}
                >
                    {copy.resetButton} {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-[2] cursor-pointer rounded-[var(--radius-capsule)] border-0 bg-[#1c1c1e] px-3 py-2.5 text-sm font-semibold leading-none tracking-normal text-white [font-family:var(--font-text)]"
                >
                    {copy.showResultsButton}
                </button>
            </div>
        </div>
    );
};
