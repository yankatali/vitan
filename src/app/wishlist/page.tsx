import {WishlistClient} from "@/app/wishlist/WishlistClient";
import {getContentfulRevalidateSeconds} from "@/lib/cache";
import {getProducts} from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
    const products = await getProducts({
        limit: 100,
        revalidateSeconds: getContentfulRevalidateSeconds(),
    });

    return <WishlistClient products={products.items} />;
}
