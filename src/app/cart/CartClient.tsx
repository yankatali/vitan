"use client";

import Image from "next/image";
import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
import {CART_CLASS_NAMES} from "@/constants/cart";
import {getCartItems, removeProductFromCart, updateCartQuantity} from "@/lib/cartStorage";
import type {CartProductItem, CartStorageItem} from "@/types/cart";
import type {ItemConfig} from "@/types/item";
import {ConfirmModal} from "@/app/components/ConfirmModal/ConfirmModal";

interface CartClientProps {
    products: ItemConfig[];
}

const usdFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const getCartProducts = (cartItems: CartStorageItem[], products: ItemConfig[]): CartProductItem[] => {
    return cartItems
        .map(cartItem => {
            const product = products.find(item => item.id === cartItem.productId);
            if (!product) return null;

            return {
                product,
                quantity: cartItem.quantity,
            };
        })
        .filter((item): item is CartProductItem => Boolean(item));
};

export const CartClient = ({products}: CartClientProps) => {
    const [cartItems, setCartItems] = useState<CartStorageItem[]>([]);
    const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

    useEffect(() => {
        setCartItems(getCartItems());
    }, []);

    const cartProducts = useMemo(() => getCartProducts(cartItems, products), [cartItems, products]);
    const totalQuantity = cartProducts.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartProducts.reduce((sum, item) => sum + item.product.priceUsd * item.quantity, 0);

    const handleQuantityChange = (productId: string, quantity: number) => {
        if (quantity < 1) {
            setConfirmRemoveId(productId);
            return;
        }

        setCartItems(updateCartQuantity(productId, quantity));
    };

    const handleRemove = (productId: string) => {
        setCartItems(removeProductFromCart(productId));
    };

    return (
        <main className={CART_CLASS_NAMES.page}>
                <div className={CART_CLASS_NAMES.header}>
                    <h1 className={CART_CLASS_NAMES.title}>Кошик</h1>
                    <Link href="/" className={CART_CLASS_NAMES.backLink}>
                        До покупок
                    </Link>
                </div>

                <section className={CART_CLASS_NAMES.content}>
                {!cartProducts.length ? (
                    <div className={CART_CLASS_NAMES.emptyState}>
                        Кошик порожній. Додайте товари з каталогу.
                    </div>
                ) : (
                    <>
                        <div className={CART_CLASS_NAMES.list}>
                            {cartProducts.map(({product, quantity}) => (
                                <article key={product.id} className={CART_CLASS_NAMES.item}>
                                    {product.imageUrl && (
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.imageAlt ?? product.title}
                                            width={240}
                                            height={240}
                                            className={CART_CLASS_NAMES.image}
                                        />
                                    )}

                                    <div className={CART_CLASS_NAMES.itemInfo}>
                                        <p className={CART_CLASS_NAMES.category}>{product.category}</p>
                                        <h2 className={CART_CLASS_NAMES.name}>{product.title}</h2>
                                        <p className={CART_CLASS_NAMES.price}>
                                            {usdFormatter.format(product.priceUsd)}
                                        </p>
                                    </div>

                                    <div className={CART_CLASS_NAMES.controls}>
                                        <div className={CART_CLASS_NAMES.quantityGroup}>
                                            <button
                                                type="button"
                                                onClick={() => handleQuantityChange(product.id, quantity - 1)}
                                                className={CART_CLASS_NAMES.quantityButton}
                                                aria-label={`Зменшити кількість ${product.title}`}
                                            >
                                                -
                                            </button>
                                            <span className={CART_CLASS_NAMES.quantityValue}>{quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleQuantityChange(product.id, quantity + 1)}
                                                className={CART_CLASS_NAMES.quantityButton}
                                                aria-label={`Збільшити кількість ${product.title}`}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setConfirmRemoveId(product.id)}
                                            className={CART_CLASS_NAMES.removeButton}
                                        >
                                            Видалити
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className={CART_CLASS_NAMES.summary}>
                            <div className={CART_CLASS_NAMES.summaryRow}>
                                <span>Товарів</span>
                                <span>{totalQuantity}</span>
                            </div>
                            <div className={CART_CLASS_NAMES.summaryTotal}>
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
                        text="Ви точно хочете видалити цей товар з кошика?"
                        onCancel={() => setConfirmRemoveId(null)}
                        onConfirm={() => {
                            handleRemove(confirmRemoveId);
                            setConfirmRemoveId(null);
                        }}
                    />
                )}
        </main>
    );
};
