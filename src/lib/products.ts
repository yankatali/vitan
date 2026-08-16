import {getLocalFixtureProducts} from "@/lib/localContentful";
import {PRODUCT_MIN_SEARCH_LENGTH, PRODUCT_PAGE_SIZE} from "@/constants/products";
import {CONTENTFUL_PRODUCTS_CACHE_TAG} from "@/constants/cache";
import {PRODUCT_QUERY} from "@/constants/contentfulQueries";
import {getContentfulFetchCacheOptions} from "@/lib/cache";
import type {CatalogSortOption} from "@/types/catalog";
import type {ItemConfig} from "@/types/item";
import type {GetProductsParams, ProductOrder, ProductsResult} from "@/types/product";

const useLocalFixture = process.env.USE_LOCAL_CONTENTFUL_FIXTURE === "true";
const space = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

interface ContentfulAsset {
    url?: string | null;
    title?: string | null;
    description?: string | null;
}

interface ContentfulProduct {
    sys: {
        id: string;
    };
    name?: string | null;
    description?: string | null;
    price?: number | null;
    category?: string[] | null;
    imagesCollection?: {
        items?: ContentfulAsset[] | null;
    } | null;
}

interface ProductsGraphqlResponse {
    productCollection?: {
        total: number;
        items?: ContentfulProduct[] | null;
    } | null;
}

const clampLimit = (limit?: number) => {
    if (!Number.isFinite(limit)) return PRODUCT_PAGE_SIZE;
    return Math.min(Math.max(Number(limit), 1), PRODUCT_PAGE_SIZE);
};

const normalizeSkip = (skip?: number) => {
    if (!Number.isFinite(skip)) return 0;
    return Math.max(Number(skip), 0);
};

const getNormalizedSearchQuery = (query?: string) => {
    return query?.trim();
};

const isShortSearchQuery = (query?: string) => {
    const normalizedQuery = query?.trim();

    return Boolean(normalizedQuery && normalizedQuery.length < PRODUCT_MIN_SEARCH_LENGTH);
};

const getSearchTokens = (item: ItemConfig) => {
    return [
        item.title,
        item.description,
        item.category,
    ]
        .join(" ")
        .toLowerCase()
        .split(/\s+/)
        .map(token => token.replace(/[^\p{L}\p{N}]+/gu, ""))
        .filter(Boolean);
};

const filterProductsByToken = (items: ItemConfig[], query?: string) => {
    const normalizedQuery = getNormalizedSearchQuery(query)?.toLowerCase();
    if (!normalizedQuery) return items;

    return items.filter(item => getSearchTokens(item).includes(normalizedQuery));
};

const getProductsCollection = async ({
    limit,
    skip,
    where,
    order,
    revalidateSeconds,
}: {
    limit: number;
    skip: number;
    where?: Record<string, unknown>;
    order: ProductOrder[];
    revalidateSeconds?: number;
}) => {
    const response = await fetch(`https://graphql.contentful.com/content/v1/spaces/${space}`, {
        method: "POST",
        ...getContentfulFetchCacheOptions(revalidateSeconds, [CONTENTFUL_PRODUCTS_CACHE_TAG]),
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: PRODUCT_QUERY,
            variables: {
                limit,
                skip,
                where,
                order,
            },
        }),
    });

    if (!response.ok) {
        throw new Error(`Contentful products request failed: ${response.status}`);
    }

    const payload = await response.json() as {
        data?: ProductsGraphqlResponse;
        errors?: {message: string}[];
    };

    if (payload.errors?.length) {
        throw new Error(payload.errors.map(error => error.message).join("; "));
    }

    return payload.data?.productCollection;
};

const getProductsResult = ({
    items,
    total,
    skip,
    limit,
}: {
    items: ItemConfig[];
    total: number;
    skip: number;
    limit: number;
}): ProductsResult => ({
    items,
    total,
    skip,
    limit,
    hasMore: skip + items.length < total,
});

const getProductOrder = (sortBy?: CatalogSortOption): ProductOrder[] => {
    switch (sortBy) {
        case "priceAsc":
            return ["price_ASC"];
        case "priceDesc":
            return ["price_DESC"];
        case "titleAsc":
            return ["name_ASC"];
        case "newest":
        default:
            return ["sys_firstPublishedAt_DESC"];
    }
};

const buildWhere = ({query, category}: Pick<GetProductsParams, "query" | "category">) => {
    const filters: Record<string, unknown>[] = [];
    const normalizedQuery = query?.trim();
    if (normalizedQuery) {
        filters.push({
            OR: [
                {name_contains: normalizedQuery},
                {description_contains: normalizedQuery},
                {category_contains_some: [normalizedQuery]},
            ],
        });
    }

    if (category && category.length > 0) {
        filters.push({category_contains_some: category});
    }

    if (filters.length === 0) return undefined;
    if (filters.length === 1) return filters[0];

    return {AND: filters};
};

const mapProduct = (product: ContentfulProduct): ItemConfig => {
    const images = product.imagesCollection?.items?.filter(image => Boolean(image?.url)) ?? [];
    const primaryImage = images[0];
    const purchasePriceUah = Number(product.price ?? 0);

    return {
        id: product.sys.id,
        sku: product.sys.id,
        slug: product.sys.id,
        title: product.name ?? "",
        description: product.description ?? "",
        category: product.category?.join(", ") ?? "",
        purchasePriceUah,
        imageUrl: primaryImage?.url ?? "",
        imageUrls: images.map(image => image.url).filter((url): url is string => Boolean(url)),
        imageAlt: primaryImage?.description ?? primaryImage?.title ?? product.name ?? "",
        imageAlts: images.map(image => image.description ?? image.title ?? product.name ?? ""),
        isActive: true,
    };
};

export const getProducts = async (params: GetProductsParams = {}): Promise<ProductsResult> => {
    const limit = clampLimit(params.limit);
    const skip = normalizeSkip(params.skip);

    if (useLocalFixture || !space || !accessToken) {
        return getLocalFixtureProducts({...params, limit, skip});
    }

    if (isShortSearchQuery(params.query)) {
        const collection = await getProductsCollection({
            limit,
            skip,
            where: buildWhere({...params, query: undefined}),
            order: getProductOrder(params.sortBy),
            revalidateSeconds: params.revalidateSeconds,
        });
        const items = filterProductsByToken(collection?.items?.map(mapProduct) ?? [], params.query);

        return getProductsResult({
            items,
            total: items.length,
            skip,
            limit,
        });
    }

    const collection = await getProductsCollection({
        limit,
        skip,
        where: buildWhere(params),
        order: getProductOrder(params.sortBy),
        revalidateSeconds: params.revalidateSeconds,
    });
    const items = collection?.items?.map(mapProduct) ?? [];
    const total = collection?.total ?? 0;

    return getProductsResult({
        items,
        total,
        skip,
        limit,
    });
};
