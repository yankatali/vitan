"use client";

import {useCallback, useEffect, useState} from "react";
import {CART_STORAGE_KEY} from "@/constants/cart";
import {WISHLIST_STORAGE_KEY} from "@/constants/wishlist";
import {getSavedProductCounts, type SavedProductCounts} from "@/lib/savedProductCounts";
import {SAVED_PRODUCTS_CHANGE_EVENT} from "@/lib/savedProductsEvents";

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
