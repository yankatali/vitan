import type {CatalogSortOption} from "@/types/catalog";
import type {ItemConfig} from "@/types/item";

export type ProductOrder =
    | "sys_firstPublishedAt_DESC"
    | "price_ASC"
    | "price_DESC"
    | "name_ASC";

export interface GetProductsParams {
    query?: string;
    category?: string[];
    sortBy?: CatalogSortOption;
    skip?: number;
    limit?: number;
    revalidateSeconds?: number;
}

export interface ProductsResult {
    items: ItemConfig[];
    total: number;
    skip: number;
    limit: number;
    hasMore: boolean;
}
