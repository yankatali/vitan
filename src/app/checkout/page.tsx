import {CheckoutClient} from "@/app/checkout/CheckoutClient";
import {getContentfulRevalidateSeconds} from "@/lib/cache";
import {getPricingConfig} from "@/lib/pricingConfig";
import {getProducts} from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
    const revalidateSeconds = getContentfulRevalidateSeconds();
    const [products, pricingConfig] = await Promise.all([
        getProducts({limit: 100, revalidateSeconds}),
        getPricingConfig(revalidateSeconds),
    ]);

    return <CheckoutClient products={products.items} pricingConfig={pricingConfig} />;
}
