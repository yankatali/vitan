import {NextRequest, NextResponse} from "next/server";
import {getProducts} from "@/lib/products";
import {NO_STORE_CACHE_CONTROL} from "@/constants/cache";
import {isAdminSession} from "@/lib/adminAuth";
import {getPricingConfig} from "@/lib/pricingConfig";
import {getAdminProductsResult, getPublicProductsResult} from "@/lib/publicProducts";
import {getNumberParam, getSortParam} from "@/lib/productRouteParams";
import {getSiteContent} from "@/lib/siteContent";

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
        const [pricingConfig, siteContent] = isAdmin
            ? [null, null]
            : await Promise.all([getPricingConfig(0), getSiteContent()]);
        const visibleProducts = isAdmin
            ? getAdminProductsResult(products)
            : getPublicProductsResult(products, pricingConfig, siteContent?.wholesale);

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
