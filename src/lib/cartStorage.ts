import type {CartStorageItem} from "@/types/cart";
import type {ItemConfig} from "@/types/item";
import {notifySavedProductsChanged} from "@/lib/savedProductsEvents";

export const CART_STORAGE_KEY = "vitan-cart-product-ids";

const MIN_CART_QUANTITY = 1;

export type CartPriceSnapshot = Pick<CartStorageItem, "priceUah" | "priceUahWholesale">;

const isCartStorageItem = (value: unknown): value is CartStorageItem => {
    if (!value || typeof value !== "object") return false;

    const item = value as Partial<CartStorageItem>;
    const quantity = item.quantity;

    const hasValidRetailPrice = item.priceUah === undefined || item.priceUah === null || typeof item.priceUah === "number";
    const hasValidWholesalePrice = item.priceUahWholesale === undefined || item.priceUahWholesale === null || typeof item.priceUahWholesale === "number";

    return typeof item.productId === "string"
        && typeof quantity === "number"
        && Number.isInteger(quantity)
        && quantity >= MIN_CART_QUANTITY
        && hasValidRetailPrice
        && hasValidWholesalePrice;
};

const normalizeCartItems = (items: CartStorageItem[]) => {
    const itemsByProductId = new Map<string, CartStorageItem>();

    items.forEach(item => {
        const existingItem = itemsByProductId.get(item.productId);
        const nextItem = {
            productId: item.productId,
            quantity: (existingItem?.quantity ?? 0) + item.quantity,
            priceUah: item.priceUah ?? existingItem?.priceUah,
            priceUahWholesale: item.priceUahWholesale ?? existingItem?.priceUahWholesale,
        };

        itemsByProductId.set(item.productId, nextItem);
    });

    return Array.from(itemsByProductId.values());
};

const parseCartItems = (value: string | null): CartStorageItem[] => {
    if (!value) return [];

    try {
        const parsedValue: unknown = JSON.parse(value);

        if (Array.isArray(parsedValue) && parsedValue.every(item => typeof item === "string")) {
            return parsedValue.map(productId => ({productId, quantity: MIN_CART_QUANTITY}));
        }

        if (Array.isArray(parsedValue) && parsedValue.every(isCartStorageItem)) {
            return normalizeCartItems(parsedValue);
        }
    } catch {
        return [];
    }

    return [];
};

export const getCartItems = () => {
    return parseCartItems(window.localStorage.getItem(CART_STORAGE_KEY));
};

export const setCartItems = (items: CartStorageItem[]) => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(normalizeCartItems(items)));
    notifySavedProductsChanged();
};

export const getCartPriceSnapshot = (product: ItemConfig): CartPriceSnapshot => ({
    priceUah: product.priceUah ?? null,
    priceUahWholesale: product.priceUahWholesale ?? null,
});

export const getCartQuantity = (productId: string) => {
    return getCartItems().find(item => item.productId === productId)?.quantity ?? 0;
};

export const addProductToCart = (
    productId: string,
    quantity = MIN_CART_QUANTITY,
    priceSnapshot?: CartPriceSnapshot,
) => {
    const currentItems = getCartItems();
    const existingItem = currentItems.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += Math.max(quantity, MIN_CART_QUANTITY);
        existingItem.priceUah = priceSnapshot?.priceUah ?? existingItem.priceUah;
        existingItem.priceUahWholesale = priceSnapshot?.priceUahWholesale ?? existingItem.priceUahWholesale;
        setCartItems(currentItems);

        return existingItem.quantity;
    }

    setCartItems([...currentItems, {
        productId,
        quantity: Math.max(quantity, MIN_CART_QUANTITY),
        ...priceSnapshot,
    }]);

    return Math.max(quantity, MIN_CART_QUANTITY);
};

export const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity < MIN_CART_QUANTITY) {
        const nextItems = getCartItems().filter(item => item.productId !== productId);
        setCartItems(nextItems);

        return nextItems;
    }

    const nextItems = getCartItems().map(item => {
        if (item.productId !== productId) return item;

        return {
            ...item,
            quantity,
        };
    });

    setCartItems(nextItems);

    return nextItems;
};

export const removeProductFromCart = (productId: string) => {
    const nextItems = getCartItems().filter(item => item.productId !== productId);
    setCartItems(nextItems);

    return nextItems;
};

export const clearCart = () => {
    setCartItems([]);
};
