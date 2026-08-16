"use client";

import {useCallback, useEffect, useState} from "react";
import {useDeleteProduct} from "@/hooks/useDeleteProduct";
import {CART_STORAGE_KEY} from "@/constants/cart";
import {WISHLIST_STORAGE_KEY} from "@/constants/wishlist";
import {addProductToCart, getCartPriceSnapshot, getCartQuantity, removeProductFromCart} from "@/lib/cartStorage";
import {isProductInWishlist, toggleWishlistProduct} from "@/lib/wishlistStorage";
import {SAVED_PRODUCTS_CHANGE_EVENT} from "@/lib/savedProductsEvents";
import type {UseProductCardActionsParams} from "@/types/productCardActions";

export const useProductCardActions = ({onProductChanged, product}: UseProductCardActionsParams) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isInCart, setIsInCart] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const {error, handleDelete, isDeleting} = useDeleteProduct({
        productId: product.id,
        onDeleted: onProductChanged,
    });

    const syncSavedState = useCallback(() => {
        setIsInCart(getCartQuantity(product.id) > 0);
        setIsFavorite(isProductInWishlist(product.id));
    }, [product.id]);

    useEffect(() => {
        const handleStorage = (event: StorageEvent) => {
            if (event.key === CART_STORAGE_KEY || event.key === WISHLIST_STORAGE_KEY) {
                syncSavedState();
            }
        };

        syncSavedState();
        window.addEventListener(SAVED_PRODUCTS_CHANGE_EVENT, syncSavedState);
        window.addEventListener("storage", handleStorage);
        window.addEventListener("pageshow", syncSavedState);

        return () => {
            window.removeEventListener(SAVED_PRODUCTS_CHANGE_EVENT, syncSavedState);
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("pageshow", syncSavedState);
        };
    }, [syncSavedState]);

    const handleCartAdd = () => {
        addProductToCart(product.id, 1, getCartPriceSnapshot(product));
        setIsInCart(true);
    };

    const handleCartRemove = () => {
        removeProductFromCart(product.id);
        setIsInCart(false);
    };

    const handleFavoriteToggle = () => {
        setIsFavorite(toggleWishlistProduct(product.id));
    };

    const openEdit = () => setIsEditOpen(true);
    const closeEdit = () => setIsEditOpen(false);

    return {
        closeEdit,
        error,
        handleCartAdd,
        handleCartRemove,
        handleDelete,
        handleFavoriteToggle,
        isDeleting,
        isEditOpen,
        isFavorite,
        isInCart,
        openEdit,
    };
};
