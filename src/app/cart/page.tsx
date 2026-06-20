import {CartClient} from "@/app/cart/CartClient";
import {getContentfulRevalidateSeconds} from "@/lib/cache";
import {getProducts} from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function CartPage() {
    const products = await getProducts({
        limit: 100,
        revalidateSeconds: getContentfulRevalidateSeconds(),
    });

    return <CartClient products={products.items} />;
}
