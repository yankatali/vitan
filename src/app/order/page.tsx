import {getContentfulRevalidateSeconds} from "@/lib/cache";
import {getPricingConfig} from "@/lib/pricingConfig";
import {getPublicProductsResult} from "@/lib/publicProducts";
import {getProducts} from "@/lib/products";
import {getSiteContent} from "@/lib/siteContent";
import {OrderClient} from "./OrderClient";

export const dynamic = "force-dynamic";

export default async function OrderPage() {
    const revalidateSeconds = getContentfulRevalidateSeconds();
    const [products, pricingConfig, siteContent] = await Promise.all([
        getProducts({limit: 100, revalidateSeconds}),
        getPricingConfig(revalidateSeconds),
        getSiteContent(),
    ]);
    const publicProducts = getPublicProductsResult(products, pricingConfig, siteContent.wholesale);

    return <OrderClient products={publicProducts.items} />;
}
