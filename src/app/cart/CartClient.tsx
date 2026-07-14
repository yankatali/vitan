"use client";

import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
import {CART_CLASS_NAMES} from "@/constants/cart";
import {addProductToCart, CART_STORAGE_KEY, getCartItems, removeProductFromCart, updateCartQuantity} from "@/lib/cartStorage";
import {SAVED_PRODUCTS_CHANGE_EVENT} from "@/lib/savedProductsEvents";
import type {CartProductItem, CartStorageItem} from "@/types/cart";
import type {ItemConfig} from "@/types/item";
import type {PricingConfig} from "@/types/pricingConfig";

import {PageHeader} from "@/app/components/PageHeader/PageHeader";
import {ConfirmModal} from "@/app/components/ConfirmModal/ConfirmModal";
import Image from "next/image";
import {ImagePlaceholder} from "@/app/components/ImagePlaceholder/ImagePlaceholder";
import {RelatedProductsRow, getCategoriesFromProducts, getRelatedProducts} from "@/app/components/RelatedProductsRow/RelatedProductsRow";
import CartIcon from "@/app/components/icon/CartIcon";
import {TrashIcon} from "@/app/components/icon/TrashIcon";

interface CartClientProps {
    products: ItemConfig[];
    pricingConfig?: PricingConfig | null;
}

const formatUah = (value: number) => {
    const formatted = new Intl.NumberFormat("uk-UA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
    return `${formatted} ₴`;
};

const getRetailPriceUah = (usdToUahRate: number | null, priceUsd: number, retailMarkup: number) => {
    if (!usdToUahRate) return null;
    return Number((priceUsd * (1 + retailMarkup / 100) * usdToUahRate).toFixed(2));
};

const getWholesalePriceUah = (usdToUahRate: number | null, priceUsd: number, wholesaleMarkup: number) => {
    if (!usdToUahRate) return null;
    return Number((priceUsd * (1 + wholesaleMarkup / 100) * usdToUahRate).toFixed(2));
};

const getCartProducts = (cartItems: CartStorageItem[], products: ItemConfig[]): CartProductItem[] => {
    return cartItems
        .map(cartItem => {
            const product = products.find(item => item.id === cartItem.productId);
            if (!product) return null;
            return {product, quantity: cartItem.quantity};
        })
        .filter((item): item is CartProductItem => Boolean(item));
};

export const CartClient = ({products, pricingConfig}: CartClientProps) => {
    const [cartItems, setCartItems] = useState<CartStorageItem[]>([]);
    const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

    useEffect(() => {
        if (products.length > 0) {
            const validIds = new Set(products.map(p => p.id));
            const raw = getCartItems();
            const clean = raw.filter(item => validIds.has(item.productId));
            if (clean.length !== raw.length) {
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(clean));
                window.dispatchEvent(new CustomEvent(SAVED_PRODUCTS_CHANGE_EVENT));
            }
        }

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

    const cartProducts = useMemo(() => getCartProducts(cartItems, products), [cartItems, products]);
    const totalQuantity = cartProducts.reduce((sum, item) => sum + item.quantity, 0);

    const cartProductIds = useMemo(() => new Set(cartItems.map(i => i.productId)), [cartItems]);

    const relatedProducts = useMemo(() => {
        const cartItemConfigs = cartProducts.map(cp => cp.product);
        const categories = getCategoriesFromProducts(cartItemConfigs);
        return getRelatedProducts(cartProductIds, categories, products);
    }, [cartProducts, cartProductIds, products]);

    const usdToUahRate = pricingConfig?.usdToUahRate ?? null;
    const retailMarkup = pricingConfig?.retailMarkup ?? 30;
    const wholesaleMarkup = pricingConfig?.wholesaleMarkup ?? 15;
    const wholesaleDescription = pricingConfig?.wholesaleDescription ?? "";

    const totalPrice = cartProducts.reduce((sum, item) => {
        const price = getRetailPriceUah(usdToUahRate, item.product.priceUsd ?? 0, retailMarkup);
        return sum + (price ?? 0) * item.quantity;
    }, 0);

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
            <PageHeader className="sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <Link href="/" className="inline-flex h-[28px] w-full items-center justify-start rounded-full text-[var(--text-primary)] transition-opacity active:opacity-60" aria-label="Назад">
                        <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2L2 10l8 8"/></svg>
                    </Link>
                    <Link href="/" className={CART_CLASS_NAMES.homeLink}>Вітан</Link>
                </div>
                <div className="flex items-center gap-1.5">
                    <CartIcon size={20} strokeWidth="2.2" className="!mb-[2px]" />
                    <h1 className={CART_CLASS_NAMES.title}>Кошик</h1>
                </div>
            </PageHeader>

            <section className={CART_CLASS_NAMES.content}>
                {!cartProducts.length ? (
                    <div className={CART_CLASS_NAMES.emptyState}>
                        Кошик порожній. Додайте товари з каталогу.
                    </div>
                ) : (
                    <>
                        <div className={CART_CLASS_NAMES.list}>
                            {cartProducts.map(({product, quantity}) => {
                                const priceUah = getRetailPriceUah(usdToUahRate, product.priceUsd ?? 0, retailMarkup);

                                return (
                                    <article key={product.id} className={CART_CLASS_NAMES.item}>
                                        {product.imageUrl ? (
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.imageAlt ?? product.title}
                                                width={120}
                                                height={120}
                                                className={CART_CLASS_NAMES.image}
                                            />
                                        ) : (
                                            <div className={CART_CLASS_NAMES.imagePlaceholder}>
                                                <ImagePlaceholder iconSize={24} />
                                            </div>
                                        )}

                                        <div className={CART_CLASS_NAMES.itemInfo}>
                                            <h2 className={CART_CLASS_NAMES.name}>{product.title}</h2>
                                            {priceUah !== null && (
                                                <p className={CART_CLASS_NAMES.price}>{formatUah(priceUah)}</p>
                                            )}
                                        </div>

                                        <div className={CART_CLASS_NAMES.controls}>
                                            <div className={CART_CLASS_NAMES.quantityGroup}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuantityChange(product.id, quantity - 1)}
                                                    className={CART_CLASS_NAMES.quantityButton}
                                                    aria-label={`Зменшити кількість ${product.title}`}
                                                >
                                                    −
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
                                                aria-label={`Видалити ${product.title}`}
                                            >
                                                <TrashIcon size={18} />
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        <RelatedProductsRow
                            products={relatedProducts}
                            pricingConfig={pricingConfig}
                            onAction={(id) => {
                                addProductToCart(id);
                            }}
                            isActive={(id) => cartProductIds.has(id)}
                            actionIcon={<CartIcon size={16} />}
                            activeActionIcon={<CartIcon size={16} checked />}
                        />
                    </>
                )}
            </section>

            {cartProducts.length > 0 && (
                <div className="fixed left-1/2 z-30 w-[min(calc(100vw-1.5rem),30rem)] -translate-x-1/2" style={{bottom: "calc(env(safe-area-inset-bottom) + 16px)"}}>
                    <div className="flex items-stretch justify-between gap-2 overflow-hidden rounded-full border-[0.5px] border-white/35 bg-white/50 pl-[27px] pr-[6px] py-[6px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] backdrop-blur-2xl">
                        <div className="flex flex-col justify-center">
                            <p className="text-[10px] text-[var(--text-secondary)]">{totalQuantity} товарів</p>
                            <p className="text-[14px] font-bold leading-5">{formatUah(totalPrice)}</p>
                        </div>
                        <Link
                            href="/checkout"
                            className="vitan-accent-button self-stretch shrink-0 flex items-center rounded-[var(--radius-lg)] px-4 text-[12px] font-semibold whitespace-nowrap"
                        >
                            Оформити замовлення
                        </Link>
                    </div>
                </div>
            )}

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
