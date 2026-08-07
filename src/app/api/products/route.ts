import {NextRequest, NextResponse} from "next/server";
import {getProducts} from "@/lib/products";
import {NO_STORE_CACHE_CONTROL} from "@/constants/cache";
import {isAdminSession} from "@/lib/adminAuth";
import {isCatalogSortOption} from "@/lib/catalogSort";
import {getPricingConfig} from "@/lib/pricingConfig";
import {getAdminProductsResult, getPublicProductsResult} from "@/lib/publicProducts";
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
        const isAdmin = await isAdminSession();
        const categoriesParam = params.get("categories");
        const category = categoriesParam ? categoriesParam.split(",").filter(Boolean) : undefined;

        const products = await getProducts({
            query: params.get("query") ?? undefined,
            category,
            sortBy: getSortParam(params.get("sortBy")),
            skip: getNumberParam(params.get("skip")),
            limit: getNumberParam(params.get("limit")),
            revalidateSeconds: 0,
        });
        const visibleProducts = isAdmin
            ? getAdminProductsResult(products)
            : getPublicProductsResult(products, await getPricingConfig(0));

        return NextResponse.json(visibleProducts, {
            headers: {
                "Cache-Control": NO_STORE_CACHE_CONTROL,
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
