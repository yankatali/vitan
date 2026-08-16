import {forwardRef} from "react";
import {FiltersSheet} from "@/app/components/FiltersSheet/FiltersSheet";
import {PRODUCT_LIST_CLASS_NAMES} from "@/constants/productListLayout";
import {getProductListFilterButtonClassName} from "@/lib/productListClassNames";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";

interface ProductListFilterDropdownProps {
    open: boolean;
    categories: string[];
    selectedCategories: string[];
    priceMin: number;
    priceMax: number;
    absoluteMin: number;
    absoluteMax: number;
    activeFilterCount: number;
    onToggle: () => void;
    onCategoriesChange: (categories: string[]) => void;
    onPriceChange: (min: number, max: number) => void;
    onClear: () => void;
    onClose: () => void;
}

const ProductListFilterIcon = () => {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M3 5.25h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M5.25 9h7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M7.5 12.75h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
};

export const ProductListFilterDropdown = forwardRef<HTMLDivElement, ProductListFilterDropdownProps>(({
    absoluteMax,
    absoluteMin,
    activeFilterCount,
    categories,
    onCategoriesChange,
    onClear,
    onClose,
    onPriceChange,
    onToggle,
    open,
    priceMax,
    priceMin,
    selectedCategories,
}, ref) => {
    const copy = useSiteContent().catalog.categoryLabels;

    return (
        <div ref={ref} className={PRODUCT_LIST_CLASS_NAMES.categoryDropdownWrapper}>
            <button
                type="button"
                onClick={onToggle}
                className={getProductListFilterButtonClassName(open || activeFilterCount > 0)}
                aria-haspopup="dialog"
                aria-expanded={open}
            >
                <ProductListFilterIcon />
                {copy.filters}
                {activeFilterCount > 0 && (
                    <span className={PRODUCT_LIST_CLASS_NAMES.activeFilterCountBadge}>
                        {activeFilterCount}
                    </span>
                )}
            </button>
            <FiltersSheet
                open={open}
                categories={categories}
                selectedCategories={selectedCategories}
                onCategoriesChange={onCategoriesChange}
                priceMin={priceMin}
                priceMax={priceMax}
                absoluteMin={absoluteMin}
                absoluteMax={absoluteMax}
                onPriceChange={onPriceChange}
                activeFilterCount={activeFilterCount}
                onClear={onClear}
                onClose={onClose}
            />
        </div>
    );
});

ProductListFilterDropdown.displayName = "ProductListFilterDropdown";
