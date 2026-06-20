export type CatalogSortOption = "newest" | "priceAsc" | "priceDesc" | "titleAsc";

export interface CatalogCurrencyConfig {
    base: "USD";
    target: "UAH";
    rateProvider?: "NBU";
    revalidateSeconds?: number;
}

export interface CatalogConfig {
    title: string;
    searchPlaceholder?: string;
    defaultSort?: CatalogSortOption;
    sortOptions?: CatalogSortOption[];
    categories?: string[];
    currency?: CatalogCurrencyConfig;
}
