import type {CatalogSortOption} from "@/types/catalog";
import type {ProductsResult} from "@/types/product";

export const PRODUCT_PAGE_SIZE = 100;
export const PRODUCT_MIN_SEARCH_LENGTH = 2;
export const PRODUCT_API_PATH = "/api/products";
export const DEFAULT_PRODUCT_SORT: CatalogSortOption = "newest";
export const PRODUCT_CREATOR_WRAPPER_CLASS_NAME = "flex justify-end px-8 pt-2";

export const PRODUCT_SORT_OPTIONS: CatalogSortOption[] = [
    "newest",
    "priceAsc",
    "priceDesc",
    "titleAsc",
];

export const EMPTY_PRODUCTS_RESULT: ProductsResult = {
    items: [],
    total: 0,
    skip: 0,
    limit: PRODUCT_PAGE_SIZE,
    hasMore: false,
};
