import {getContentfulRevalidateSeconds} from "@/lib/cache";
import {getPricingConfig} from "@/lib/pricingConfig";
import {getProducts} from "@/lib/products";
import {OrderClient} from "./OrderClient";

export const dynamic = "force-dynamic";

export default async function OrderPage() {
    const revalidateSeconds = getContentfulRevalidateSeconds();
    const [products, pricingConfig] = await Promise.all([
        getProducts({limit: 100, revalidateSeconds}),
        getPricingConfig(revalidateSeconds),
    ]);

    return <OrderClient products={products.items} pricingConfig={pricingConfig} />;
}
