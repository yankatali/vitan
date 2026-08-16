import {getCartItems} from "@/lib/cartStorage";
import {getWishlistIds} from "@/lib/wishlistStorage";

export interface SavedProductCounts {
    cart: number;
    wishlist: number;
}

export const getSavedProductCounts = (): SavedProductCounts => ({
    cart: getCartItems().reduce((total, item) => total + item.quantity, 0),
    wishlist: getWishlistIds().length,
});
