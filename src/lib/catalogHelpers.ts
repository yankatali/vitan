import {PRODUCT_SORT_OPTIONS} from "@/constants/products";
import type {CatalogConfig} from "@/types/catalog";

export const getCatalogSortOptions = (config: CatalogConfig) => {
    if (config.sortOptions?.length) return config.sortOptions;

    return PRODUCT_SORT_OPTIONS;
};
