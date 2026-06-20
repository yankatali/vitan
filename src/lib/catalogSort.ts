import {PRODUCT_SORT_OPTIONS} from "@/constants/products";
import type {CatalogSortOption} from "@/types/catalog";

export const isCatalogSortOption = (value: string): value is CatalogSortOption => {
    return PRODUCT_SORT_OPTIONS.some(option => option === value);
};
