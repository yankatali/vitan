import {NextRequest, NextResponse} from "next/server";
import {getProducts} from "@/lib/products";
import {getContentfulRevalidateSeconds, getProductsApiCacheHeaders} from "@/lib/cache";
import {isCatalogSortOption} from "@/lib/catalogSort";
import {CatalogSortOption} from "@/types/catalog";

const getNumberParam = (value: string | null) => {
    if (!value) return undefined;
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) return undefined;

    return parsed;
};

const getSortParam = (value: string | null): CatalogSortOption | undefined => {
    if (!value) return undefined;

    if (!isCatalogSortOption(value)) return undefined;

    return value;
};

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;

    try {
        const revalidateSeconds = getContentfulRevalidateSeconds();
        const categoriesParam = params.get("categories");
        const category = categoriesParam ? categoriesParam.split(",").filter(Boolean) : undefined;

        const products = await getProducts({
            query: params.get("query") ?? undefined,
            category,
            sortBy: getSortParam(params.get("sortBy")),
            skip: getNumberParam(params.get("skip")),
            limit: getNumberParam(params.get("limit")),
            revalidateSeconds,
        });

        return NextResponse.json(products, {
            headers: {
                ...getProductsApiCacheHeaders(),
                "CDN-Cache-Control": "no-store",
            },
        });
    } catch (error) {
        let message = "Unable to load products";
        if (error instanceof Error) {
            message = error.message;
        }

        return NextResponse.json({message}, {status: 500});
    }
}
