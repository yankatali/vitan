"use client";

import {useEffect, useMemo, useState} from "react";
import {CART_STORAGE_KEY} from "@/constants/cart";
import {getCartItems} from "@/lib/cartStorage";
import {SAVED_PRODUCTS_CHANGE_EVENT} from "@/lib/savedProductsEvents";
import {getOptPrice, getRetailPriceUah, isWholesaleEligible} from "@/lib/wholesalePricing";
import type {CartStorageItem} from "@/types/cart";
import type {ItemConfig} from "@/types/item";
import type {PricingConfig} from "@/types/pricingConfig";

export const useCartWholesaleStatus = (products: ItemConfig[], pricingConfig?: PricingConfig | null) => {
    const [cartItems, setCartItems] = useState<CartStorageItem[]>([]);
    const productsById = useMemo(() => new Map(products.map(product => [product.id, product])), [products]);

    useEffect(() => {
        const syncCartItems = () => setCartItems(getCartItems());
        const handleStorage = (event: StorageEvent) => {
            if (event.key === CART_STORAGE_KEY) syncCartItems();
        };

        syncCartItems();
        window.addEventListener(SAVED_PRODUCTS_CHANGE_EVENT, syncCartItems);
        window.addEventListener("storage", handleStorage);
        window.addEventListener("pageshow", syncCartItems);

        return () => {
            window.removeEventListener(SAVED_PRODUCTS_CHANGE_EVENT, syncCartItems);
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("pageshow", syncCartItems);
        };
    }, []);

    const retailTotalPrice = useMemo(() => {
        return cartItems.reduce((sum, cartItem) => {
            const product = productsById.get(cartItem.productId);
            const retailPrice = product ? getRetailPriceUah(product, pricingConfig) : cartItem.priceUah;

            return sum + (retailPrice ?? 0) * cartItem.quantity;
        }, 0);
    }, [cartItems, pricingConfig, productsById]);

    const optPrice = getOptPrice(pricingConfig);

    return {
        cartItems,
        hasCartItems: cartItems.length > 0,
        isWholesaleActive: isWholesaleEligible(retailTotalPrice, pricingConfig),
        optPrice,
        remainingToWholesale: Math.max(0, optPrice - retailTotalPrice),
        retailTotalPrice,
    };
};
