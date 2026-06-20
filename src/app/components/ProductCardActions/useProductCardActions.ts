"use client";

import {useEffect, useState} from "react";
import {useDeleteProduct} from "@/app/components/ProductDeleteButton/useDeleteProduct";
import {addProductToCart, CART_STORAGE_KEY, getCartQuantity, removeProductFromCart} from "@/lib/cartStorage";
import {isProductInWishlist, toggleWishlistProduct, WISHLIST_STORAGE_KEY} from "@/lib/wishlistStorage";
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

    const syncSavedState = () => {
        setIsInCart(getCartQuantity(product.id) > 0);
        setIsFavorite(isProductInWishlist(product.id));
    };

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
    }, [product.id]);

    const handleCartAdd = () => {
        addProductToCart(product.id);
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
