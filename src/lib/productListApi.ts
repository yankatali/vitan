import {PRODUCT_API_PATH, PRODUCT_PAGE_SIZE} from "@/constants/products";
import type {SiteContent} from "@/constants/siteContent";
import type {ProductsResult} from "@/types/product";
import type {ProductListRequest} from "@/types/productList";

const buildProductsUrl = ({
    query,
    categories,
    sortBy,
    skip,
}: Omit<ProductListRequest, "signal">) => {
    const params = new URLSearchParams({
        limit: String(PRODUCT_PAGE_SIZE),
        skip: String(skip),
        sortBy,
        _t: String(Date.now()),
    });

    if (query.trim()) {
        params.set("query", query.trim());
    }

    if (categories.length > 0) {
        params.set("categories", categories.join(","));
    }

    return `${PRODUCT_API_PATH}?${params.toString()}`;
};

const isProductsResult = (value: unknown): value is ProductsResult => {
    if (!value || typeof value !== "object") return false;
    if (!("items" in value) || !("total" in value) || !("skip" in value) || !("limit" in value) || !("hasMore" in value)) return false;

    return Array.isArray(value.items)
        && typeof value.total === "number"
        && typeof value.skip === "number"
        && typeof value.limit === "number"
        && typeof value.hasMore === "boolean";
};

export const fetchProductList = async ({
    signal,
    ...params
}: ProductListRequest, copy: SiteContent["productList"]): Promise<ProductsResult> => {
    const response = await fetch(buildProductsUrl(params), {
        cache: "no-store",
        signal,
    });

    if (!response.ok) {
        throw new Error(copy.loadError);
    }

    const products: unknown = await response.json();

    if (!isProductsResult(products)) {
        throw new Error(copy.invalidResponseError);
    }

    return products;
};
