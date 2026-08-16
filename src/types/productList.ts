import type {CatalogSortOption} from "@/types/catalog";
import type {ProductsResult} from "@/types/product";

export interface ProductListRequest {
    query: string;
    categories: string[];
    sortBy: CatalogSortOption;
    skip: number;
    signal?: AbortSignal;
}

export interface UseProductListParams {
    initialProducts: ProductsResult;
    defaultSort?: CatalogSortOption;
    categories?: string[];
}

export interface LoadProductsParams {
    nextSkip: number;
    append: boolean;
    signal?: AbortSignal;
}

export type {ProductListProps, ProductListResultsProps} from "@/types/props";
