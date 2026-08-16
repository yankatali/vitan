import {forwardRef} from "react";
import {PRODUCT_LIST_CLASS_NAMES} from "@/constants/productListLayout";
import {getProductListSortButtonClassName, getProductListSortOptionButtonClassName} from "@/lib/productListClassNames";
import type {ProductListSortDropdownProps, ProductListSortOptionButtonProps} from "@/types/props";


const ProductListSortIcon = () => {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M6 3.75v10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M3.25 6.5 6 3.75 8.75 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 14.25V3.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M9.25 11.5 12 14.25l2.75-2.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

const ProductListCheckIcon = () => {
    return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <path d="M3.25 7.8 6.15 10.5 11.75 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

const ProductListSortOptionButton = ({option, label, active, onSelect}: ProductListSortOptionButtonProps) => {
    return (
        <button
            type="button"
            onClick={() => onSelect(option)}
            className={getProductListSortOptionButtonClassName(active)}
            aria-pressed={active}
        >
            <span>{label}</span>
            {active && <ProductListCheckIcon />}
        </button>
    );
};

export const ProductListSortDropdown = forwardRef<HTMLDivElement, ProductListSortDropdownProps>(({
    active,
    onSelect,
    onToggle,
    open,
    sortBy,
    sortOptions,
    sortLabels,
    sortAriaPrefix,
}, ref) => (
    <div ref={ref} className={PRODUCT_LIST_CLASS_NAMES.sortDropdownWrapper}>
        <button
            type="button"
            onClick={onToggle}
            className={getProductListSortButtonClassName(open)}
            aria-label={`${sortAriaPrefix} ${sortLabels[sortBy]}`}
            aria-expanded={open}
        >
            <ProductListSortIcon />
            {active && (
                <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-[#1c1c1e] ring-2 ring-white" />
            )}
        </button>

        {open && (
            <div className={PRODUCT_LIST_CLASS_NAMES.sortDropdownMenu}>
                {sortOptions.map(option => (
                    <ProductListSortOptionButton
                        key={option}
                        option={option}
                        active={sortBy === option}
                        label={sortLabels[option]}
                        onSelect={onSelect}
                    />
                ))}
            </div>
        )}
    </div>
));

ProductListSortDropdown.displayName = "ProductListSortDropdown";
