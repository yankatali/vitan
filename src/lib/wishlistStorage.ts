import {notifySavedProductsChanged} from "@/lib/savedProductsEvents";

export const WISHLIST_STORAGE_KEY = "vitan-favorite-product-ids";

const normalizeWishlistIds = (ids: string[]) => {
    return Array.from(new Set(ids));
};

export const getWishlistIds = () => {
    const value = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!value) return [];

    try {
        const parsedValue: unknown = JSON.parse(value);
        if (Array.isArray(parsedValue) && parsedValue.every(item => typeof item === "string")) {
            return normalizeWishlistIds(parsedValue);
        }
    } catch {
        return [];
    }

    return [];
};

export const setWishlistIds = (ids: string[]) => {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(normalizeWishlistIds(ids)));
    notifySavedProductsChanged();
};

export const isProductInWishlist = (productId: string) => {
    return getWishlistIds().includes(productId);
};

export const toggleWishlistProduct = (productId: string) => {
    const ids = getWishlistIds();
    const exists = ids.includes(productId);

    if (exists) {
        setWishlistIds(ids.filter(id => id !== productId));

        return false;
    }

    setWishlistIds([...ids, productId]);

    return true;
};

export const removeProductFromWishlist = (productId: string) => {
    const nextIds = getWishlistIds().filter(id => id !== productId);
    setWishlistIds(nextIds);

    return nextIds;
};
