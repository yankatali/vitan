"use client";

import Image from "next/image";
import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
import {WISHLIST_CLASS_NAMES} from "@/constants/wishlist";
import {addProductToCart, CART_STORAGE_KEY, getCartItems, removeProductFromCart} from "@/lib/cartStorage";
import {SAVED_PRODUCTS_CHANGE_EVENT} from "@/lib/savedProductsEvents";
import {getWishlistIds, removeProductFromWishlist} from "@/lib/wishlistStorage";
import type {CartStorageItem} from "@/types/cart";
import type {ItemConfig} from "@/types/item";
import type {WishlistProductItem} from "@/types/wishlist";
import {ConfirmModal} from "@/app/components/ConfirmModal/ConfirmModal";

interface WishlistClientProps {
    products: ItemConfig[];
}

const usdFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const getWishlistProducts = (wishlistIds: string[], products: ItemConfig[]): WishlistProductItem[] => {
    return wishlistIds
        .map(productId => {
            const product = products.find(item => item.id === productId);
            if (!product) return null;

            return {product};
        })
        .filter((item): item is WishlistProductItem => Boolean(item));
};

export const WishlistClient = ({products}: WishlistClientProps) => {
    const [cartItems, setCartItems] = useState<CartStorageItem[]>([]);
    const [wishlistIds, setWishlistIds] = useState<string[]>([]);
    const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
    const [confirmCartRemoveId, setConfirmCartRemoveId] = useState<string | null>(null);

    useEffect(() => {
        const syncCartItems = () => setCartItems(getCartItems());
        const handleStorage = (event: StorageEvent) => {
            if (event.key === CART_STORAGE_KEY) syncCartItems();
        };

        syncCartItems();
        setWishlistIds(getWishlistIds());
        window.addEventListener(SAVED_PRODUCTS_CHANGE_EVENT, syncCartItems);
        window.addEventListener("storage", handleStorage);
        window.addEventListener("pageshow", syncCartItems);

        return () => {
            window.removeEventListener(SAVED_PRODUCTS_CHANGE_EVENT, syncCartItems);
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("pageshow", syncCartItems);
        };
    }, []);

    const wishlistProducts = useMemo(() => getWishlistProducts(wishlistIds, products), [products, wishlistIds]);
    const cartProductIds = useMemo(() => new Set(cartItems.map(item => item.productId)), [cartItems]);
    const totalPrice = wishlistProducts.reduce((sum, {product}) => sum + product.priceUsd, 0);

    const handleRemove = (productId: string) => {
        setWishlistIds(removeProductFromWishlist(productId));
    };

    const handleAddToCart = (productId: string) => {
        addProductToCart(productId);
        setCartItems(getCartItems());
    };

    const handleRemoveFromCart = (productId: string) => {
        setCartItems(removeProductFromCart(productId));
    };

    return (
        <main className={WISHLIST_CLASS_NAMES.page}>
                <div className={WISHLIST_CLASS_NAMES.header}>
                    <h1 className={WISHLIST_CLASS_NAMES.title}>Вибране</h1>
                    <Link href="/" className={WISHLIST_CLASS_NAMES.backLink}>
                        До покупок
                    </Link>
                </div>

                <section className={WISHLIST_CLASS_NAMES.content}>
                {!wishlistProducts.length ? (
                    <div className={WISHLIST_CLASS_NAMES.emptyState}>
                        Список вибраного порожній. Додайте товари з каталогу.
                    </div>
                ) : (
                    <>
                        <div className={WISHLIST_CLASS_NAMES.list}>
                            {wishlistProducts.map(({product}) => {
                                const isInCart = cartProductIds.has(product.id);

                                return (
                                    <article key={product.id} className={WISHLIST_CLASS_NAMES.item}>
                                        {product.imageUrl && (
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.imageAlt ?? product.title}
                                                width={240}
                                                height={240}
                                                className={WISHLIST_CLASS_NAMES.image}
                                            />
                                        )}

                                        <div className={WISHLIST_CLASS_NAMES.itemInfo}>
                                            <p className={WISHLIST_CLASS_NAMES.category}>{product.category}</p>
                                            <h2 className={WISHLIST_CLASS_NAMES.name}>{product.title}</h2>
                                            <p className={WISHLIST_CLASS_NAMES.price}>
                                                {usdFormatter.format(product.priceUsd)}
                                            </p>
                                        </div>

                                        <div className={WISHLIST_CLASS_NAMES.controls}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (isInCart) {
                                                        setConfirmCartRemoveId(product.id);
                                                        return;
                                                    }

                                                    handleAddToCart(product.id);
                                                }}
                                                className={isInCart ? WISHLIST_CLASS_NAMES.activeCartButton : WISHLIST_CLASS_NAMES.cartButton}
                                                aria-pressed={isInCart}
                                            >
                                                {isInCart ? "У кошику" : "В кошик"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setConfirmRemoveId(product.id)}
                                                className={WISHLIST_CLASS_NAMES.removeButton}
                                            >
                                                Видалити
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        <div className={WISHLIST_CLASS_NAMES.summary}>
                            <div className={WISHLIST_CLASS_NAMES.summaryRow}>
                                <span>У вибраному</span>
                                <span>{wishlistProducts.length}</span>
                            </div>
                            <div className={WISHLIST_CLASS_NAMES.summaryTotal}>
                                <span>Разом</span>
                                <span>{usdFormatter.format(totalPrice)}</span>
                            </div>
                        </div>
                    </>
                )}
                </section>
                {confirmRemoveId && (
                    <ConfirmModal
                        isOpen={Boolean(confirmRemoveId)}
                        text="Ви точно хочете видалити цей товар?"
                        onCancel={() => setConfirmRemoveId(null)}
                        onConfirm={() => {
                            handleRemove(confirmRemoveId);
                            setConfirmRemoveId(null);
                        }}
                    />
                )}
                {confirmCartRemoveId && (
                    <ConfirmModal
                        isOpen={Boolean(confirmCartRemoveId)}
                        text="Ви точно хочете видалити цей товар з кошика?"
                        onCancel={() => setConfirmCartRemoveId(null)}
                        onConfirm={() => {
                            handleRemoveFromCart(confirmCartRemoveId);
                            setConfirmCartRemoveId(null);
                        }}
                    />
                )}
        </main>
    );
};
