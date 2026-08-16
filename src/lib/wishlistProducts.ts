import type {ItemConfig} from "@/types/item";
import type {WishlistProductItem} from "@/types/wishlist";

export const getWishlistProducts = (wishlistIds: string[], productsById: Map<string, ItemConfig>): WishlistProductItem[] => {
    return wishlistIds.flatMap(productId => {
        const product = productsById.get(productId);
        return product ? [{product}] : [];
    });
};
