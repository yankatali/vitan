import type {CartStorageItem} from "@/types/cart";
import {notifySavedProductsChanged} from "@/lib/savedProductsEvents";

export const CART_STORAGE_KEY = "vitan-cart-product-ids";

const MIN_CART_QUANTITY = 1;

const isCartStorageItem = (value: unknown): value is CartStorageItem => {
    if (!value || typeof value !== "object") return false;

    const item = value as Partial<CartStorageItem>;
    const quantity = item.quantity;

    return typeof item.productId === "string"
        && typeof quantity === "number"
        && Number.isInteger(quantity)
        && quantity >= MIN_CART_QUANTITY;
};

const normalizeCartItems = (items: CartStorageItem[]) => {
    const quantitiesByProductId = new Map<string, number>();

    items.forEach(({productId, quantity}) => {
        quantitiesByProductId.set(productId, (quantitiesByProductId.get(productId) ?? 0) + quantity);
    });

    return Array.from(quantitiesByProductId.entries()).map(([productId, quantity]) => ({
        productId,
        quantity,
    }));
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

export const getCartQuantity = (productId: string) => {
    return getCartItems().find(item => item.productId === productId)?.quantity ?? 0;
};

export const addProductToCart = (productId: string, quantity = MIN_CART_QUANTITY) => {
    const currentItems = getCartItems();
    const existingItem = currentItems.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += Math.max(quantity, MIN_CART_QUANTITY);
        setCartItems(currentItems);

        return existingItem.quantity;
    }

    setCartItems([...currentItems, {productId, quantity: Math.max(quantity, MIN_CART_QUANTITY)}]);

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
