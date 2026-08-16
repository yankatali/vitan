import {formatUah} from "@/lib/formatters";
import {getProductPriceUah} from "@/lib/wholesalePricing";
import type {CartProductItem, CartStorageItem} from "@/types/cart";
import type {ItemConfig} from "@/types/item";
import type {PricingConfig} from "@/types/pricingConfig";

export const getCheckoutCartProducts = (cartItems: CartStorageItem[], productsById: Map<string, ItemConfig>): CartProductItem[] => {
    return cartItems.flatMap(cartItem => {
        const product = productsById.get(cartItem.productId);
        return product ? [{product, quantity: cartItem.quantity}] : [];
    });
};

export const getCheckoutPayloadItems = (
    cartProducts: CartProductItem[],
    isWholesaleActive: boolean,
    pricingConfig?: PricingConfig | null,
) => {
    return cartProducts.map(({product, quantity}) => {
        const price = getProductPriceUah(product, isWholesaleActive, pricingConfig);

        return {
            id: product.id,
            title: product.title,
            quantity,
            price: price ? formatUah(price * quantity) : "—",
            imageUrl: product.imageUrls?.[0] ?? product.imageUrl ?? undefined,
        };
    });
};

export const getCheckoutTotals = (
    cartProducts: CartProductItem[],
    isWholesaleActive: boolean,
    pricingConfig?: PricingConfig | null,
) => {
    return cartProducts.reduce((totals, item) => {
        const price = getProductPriceUah(item.product, isWholesaleActive, pricingConfig);
        totals.totalQuantity += item.quantity;
        totals.totalPrice += (price ?? 0) * item.quantity;
        return totals;
    }, {totalPrice: 0, totalQuantity: 0});
};
