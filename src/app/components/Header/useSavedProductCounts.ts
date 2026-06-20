"use client";

import {useCallback, useEffect, useState} from "react";
import {CART_STORAGE_KEY, getCartItems} from "@/lib/cartStorage";
import {SAVED_PRODUCTS_CHANGE_EVENT} from "@/lib/savedProductsEvents";
import {getWishlistIds, WISHLIST_STORAGE_KEY} from "@/lib/wishlistStorage";

export interface SavedProductCounts {
    cart: number;
    wishlist: number;
}

const getSavedProductCounts = (): SavedProductCounts => ({
    cart: getCartItems().reduce((total, item) => total + item.quantity, 0),
    wishlist: getWishlistIds().length,
});

export const useSavedProductCounts = () => {
    const [counts, setCounts] = useState<SavedProductCounts>({cart: 0, wishlist: 0});
    const refreshCounts = useCallback(() => setCounts(getSavedProductCounts()), []);

    useEffect(() => {
        const handleStorage = (event: StorageEvent) => {
            if (event.key === CART_STORAGE_KEY || event.key === WISHLIST_STORAGE_KEY) {
                refreshCounts();
            }
        };

        refreshCounts();
        window.addEventListener(SAVED_PRODUCTS_CHANGE_EVENT, refreshCounts);
        window.addEventListener("storage", handleStorage);
        window.addEventListener("pageshow", refreshCounts);

        return () => {
            window.removeEventListener(SAVED_PRODUCTS_CHANGE_EVENT, refreshCounts);
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("pageshow", refreshCounts);
        };
    }, [refreshCounts]);

    return counts;
};
