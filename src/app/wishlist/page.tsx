import {WishlistClient} from "@/app/wishlist/WishlistClient";
import {getContentfulRevalidateSeconds} from "@/lib/cache";
import {getPricingConfig} from "@/lib/pricingConfig";
import {getProducts} from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
    const revalidateSeconds = getContentfulRevalidateSeconds();
    const [products, pricingConfig] = await Promise.all([
        getProducts({limit: 100, revalidateSeconds}),
        getPricingConfig(revalidateSeconds),
    ]);

    return <WishlistClient products={products.items} pricingConfig={pricingConfig} />;
}
