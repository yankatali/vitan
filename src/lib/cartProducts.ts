import {getCartPriceSnapshot} from "@/lib/cartStorage";
import type {CartProductItem, CartStorageItem} from "@/types/cart";
import type {ItemConfig} from "@/types/item";

export const getCartProducts = (cartItems: CartStorageItem[], productsById: Map<string, ItemConfig>): CartProductItem[] => {
    return cartItems.flatMap(cartItem => {
        const product = productsById.get(cartItem.productId);
        return product ? [{product, quantity: cartItem.quantity}] : [];
    });
};

export const getCleanCartItems = (cartItems: CartStorageItem[], productsById: Map<string, ItemConfig>): CartStorageItem[] => {
    return cartItems.flatMap(item => {
        const product = productsById.get(item.productId);
        if (!product) return [];

        return [{
            ...item,
            ...getCartPriceSnapshot(product),
        }];
    });
};

export const shouldSaveCleanCartItems = (cleanItems: CartStorageItem[], rawItems: CartStorageItem[]) => {
    return cleanItems.length !== rawItems.length
        || cleanItems.some((item, index) => (
            item.priceUah !== rawItems[index]?.priceUah
            || item.priceUahWholesale !== rawItems[index]?.priceUahWholesale
        ));
};
