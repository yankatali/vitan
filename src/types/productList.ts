import type {CatalogSortOption} from "@/types/catalog";
import type {HeaderButton} from "@/types/header";
import type {ItemConfig} from "@/types/item";
import type {ProductsResult} from "@/types/product";

export interface ProductListProps {
    initialProducts: ProductsResult;
    defaultSort?: CatalogSortOption;
    searchPlaceholder?: string;
    categories?: string[];
    sortOptions?: CatalogSortOption[];
    showCategories?: boolean;
    showSort?: boolean;
    showCategoryOnCard?: boolean;
    showCreateProductButton?: boolean;
    showDeleteProductButton?: boolean;
    usdToUahRate?: number | null;
    rootClassName?: string;
    productCreatorWrapperClassName?: string;
    toolbarButtons?: HeaderButton[];
    toolbarClassName?: string;
    toolbarTitle?: string;
    searchWrapperClassName?: string;
    filterWrapperClassName?: string;
    sortWrapperClassName?: string;
    gridClassName: string;
    messageClassName: string;
}

export interface ProductListRequest {
    query: string;
    category: string;
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

export interface ProductListResultsProps {
    categoryOptions: string[];
    error: string | null;
    gridRef: React.RefObject<HTMLDivElement | null>;
    gridClassName: string;
    hasMore: boolean;
    isLoading: boolean;
    items: ItemConfig[];
    loadMoreRef: React.RefObject<HTMLDivElement | null>;
    messageClassName: string;
    onProductDeleted: () => void;
    showCategoryOnCard: boolean;
    showAdminActions: boolean;
    usdToUahRate: number | null;
}
