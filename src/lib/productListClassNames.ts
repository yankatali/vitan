import {PRODUCT_LIST_CLASS_NAMES, PRODUCT_LIST_SORT_OPTION_BASE_CLASS_NAME} from "@/constants/productListLayout";

export const getProductListFilterButtonClassName = (isActive: boolean) => {
    if (isActive) return `${PRODUCT_LIST_CLASS_NAMES.filterButton} liquid-button-selected`;

    return PRODUCT_LIST_CLASS_NAMES.filterButton;
};

export const getProductListSortButtonClassName = (isActive: boolean) => {
    if (isActive) return `${PRODUCT_LIST_CLASS_NAMES.sortButton} liquid-button-selected`;

    return PRODUCT_LIST_CLASS_NAMES.sortButton;
};

export const getProductListSortOptionButtonClassName = (isSelected: boolean) => {
    if (isSelected) {
        return `${PRODUCT_LIST_SORT_OPTION_BASE_CLASS_NAME} bg-black/8 font-semibold text-[var(--text-primary)]`;
    }

    return `${PRODUCT_LIST_SORT_OPTION_BASE_CLASS_NAME} font-medium text-[var(--text-primary)] hover:bg-[var(--fill)]`;
};
