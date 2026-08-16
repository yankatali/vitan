import {getCartItems} from "@/lib/cartStorage";
import {getWishlistIds} from "@/lib/wishlistStorage";
import type {SavedProductCounts} from "@/types/savedProductCounts";

export type {SavedProductCounts} from "@/types/savedProductCounts";

export const getSavedProductCounts = (): SavedProductCounts => ({
    cart: getCartItems().reduce((total, item) => total + item.quantity, 0),
    wishlist: getWishlistIds().length,
});
