"use client";

import Image from "next/image";
import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
import {CART_CLASS_NAMES} from "@/constants/cart";
import {
    addProductToCart,
    CART_STORAGE_KEY,
    getCartItems,
    getCartPriceSnapshot,
    removeProductFromCart,
    setCartItems as saveCartItems,
    updateCartQuantity,
} from "@/lib/cartStorage";
import {SAVED_PRODUCTS_CHANGE_EVENT} from "@/lib/savedProductsEvents";
import type {CartProductItem, CartStorageItem} from "@/types/cart";
import type {ItemConfig} from "@/types/item";
import {useBarBottom} from "@/hooks/useBarBottom";
import {PageHeader} from "@/app/components/PageHeader/PageHeader";
import {ConfirmModal} from "@/app/components/ConfirmModal/ConfirmModal";
import {ImagePlaceholder} from "@/app/components/ImagePlaceholder/ImagePlaceholder";
import {PriceTooltip} from "@/app/components/PriceTooltip/PriceTooltip";
import {RelatedProductsRow, getCategoriesFromProducts, getRelatedProducts} from "@/app/components/RelatedProductsRow/RelatedProductsRow";
import CartIcon from "@/app/components/icon/CartIcon";
import {TrashIcon} from "@/app/components/icon/TrashIcon";
import {getCartRetailTotal, getOptPrice, getProductPriceUah, getRetailPriceUah, getWholesaleTooltipText, isWholesaleEligible} from "@/lib/wholesalePricing";
import type {PricingConfig} from "@/types/pricingConfig";

interface CartClientProps {
    products: ItemConfig[];
    pricingConfig?: PricingConfig | null;
}

const uahFormatter = new Intl.NumberFormat("uk-UA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const formatUah = (value: number) => {
    return `${uahFormatter.format(value)} ₴`;
};

const getCartProducts = (cartItems: CartStorageItem[], productsById: Map<string, ItemConfig>): CartProductItem[] => {
    return cartItems
        .map(cartItem => {
            const product = productsById.get(cartItem.productId);
            if (!product) return null;
            return {product, quantity: cartItem.quantity};
        })
        .filter((item): item is CartProductItem => Boolean(item));
};

export const CartClient = ({products, pricingConfig}: CartClientProps) => {
    const [cartItems, setCartItems] = useState<CartStorageItem[]>([]);
    const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
    const barBottom = useBarBottom();
    const productsById = useMemo(() => new Map(products.map(product => [product.id, product])), [products]);

    useEffect(() => {
        if (productsById.size > 0) {
            const raw = getCartItems();
            const clean = raw.flatMap(item => {
                const product = productsById.get(item.productId);
                if (!product) return [];

                return [{
                    ...item,
                    ...getCartPriceSnapshot(product),
                }];
            });
            const shouldSaveCleanCart = clean.length !== raw.length
                || clean.some((item, index) => (
                    item.priceUah !== raw[index]?.priceUah
                    || item.priceUahWholesale !== raw[index]?.priceUahWholesale
                ));

            if (shouldSaveCleanCart) {
                saveCartItems(clean);
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
    }, [productsById]);

    const cartProducts = useMemo(() => getCartProducts(cartItems, productsById), [cartItems, productsById]);

    const cartProductIds = useMemo(() => new Set(cartProducts.map(item => item.product.id)), [cartProducts]);

    const relatedProducts = useMemo(() => {
        const cartItemConfigs = cartProducts.map(cp => cp.product);
        const categories = getCategoriesFromProducts(cartItemConfigs);
        return getRelatedProducts(cartProductIds, categories, products);
    }, [cartProducts, cartProductIds, products]);

    const retailTotalPrice = useMemo(() => getCartRetailTotal(cartProducts, pricingConfig), [cartProducts, pricingConfig]);
    const isWholesaleActive = isWholesaleEligible(retailTotalPrice, pricingConfig);
    const optPrice = getOptPrice(pricingConfig);
    const remainingToWholesale = Math.max(0, optPrice - retailTotalPrice);
    const shouldShowWholesaleHint = cartProducts.length > 0 && !isWholesaleActive && remainingToWholesale > 0;
    const wholesaleTooltipText = getWholesaleTooltipText(pricingConfig);

    const {totalPrice, totalQuantity} = useMemo(() => cartProducts.reduce((totals, item) => {
        totals.totalQuantity += item.quantity;
        totals.totalPrice += (getProductPriceUah(item.product, isWholesaleActive, pricingConfig) ?? 0) * item.quantity;
        return totals;
    }, {totalPrice: 0, totalQuantity: 0}), [cartProducts, isWholesaleActive, pricingConfig]);

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
            <div className="sticky top-0 z-20 px-3 pt-3">
                <PageHeader>
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
            </div>

            <section className={CART_CLASS_NAMES.content}>
                {!cartProducts.length ? (
                    <div className={CART_CLASS_NAMES.emptyState}>
                        Кошик порожній. Додайте товари з каталогу.
                    </div>
                ) : (
                    <>
                        <div className={CART_CLASS_NAMES.list}>
                            {cartProducts.map(({product, quantity}) => {
                                const retailPriceUah = getRetailPriceUah(product, pricingConfig);
                                const priceUah = getProductPriceUah(product, isWholesaleActive, pricingConfig);
                                const usesWholesalePrice = isWholesaleActive
                                    && typeof priceUah === "number"
                                    && typeof retailPriceUah === "number"
                                    && priceUah !== retailPriceUah;

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
                                            {typeof priceUah === "number" && (
                                                <div className="grid gap-0.5">
                                                    <p className={usesWholesalePrice ? "text-[15px] font-bold leading-5 text-[#0ba862]" : CART_CLASS_NAMES.price}>
                                                        {formatUah(priceUah)}
                                                    </p>
                                                    {usesWholesalePrice && typeof retailPriceUah === "number" && (
                                                        <p className="text-[12px] font-semibold leading-4 text-[var(--destructive)] line-through">
                                                            {formatUah(retailPriceUah)}
                                                        </p>
                                                    )}
                                                    {usesWholesalePrice && (
                                                        <p className="flex items-center gap-1 text-[12px] font-medium leading-4 text-[#0ba862]">
                                                            Опт
                                                            <PriceTooltip text={wholesaleTooltipText} />
                                                        </p>
                                                    )}
                                                </div>
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

                        {shouldShowWholesaleHint && (
                            <div className="liquid-surface rounded-2xl px-4 py-3 text-[13px] font-semibold leading-5 text-[var(--text-primary)]">
                                Додайте ще {formatUah(remainingToWholesale)}, щоб сума була мінімум {formatUah(optPrice)} і відкрилась оптова ціна.
                            </div>
                        )}

                        <RelatedProductsRow
                            products={relatedProducts}
                            onAction={(id) => {
                                const product = productsById.get(id);
                                addProductToCart(id, 1, product ? getCartPriceSnapshot(product) : undefined);
                            }}
                            isActive={(id) => cartProductIds.has(id)}
                            actionIcon={<CartIcon size={16} />}
                            activeActionIcon={<CartIcon size={16} checked />}
                        />
                    </>
                )}
            </section>

            {cartProducts.length > 0 && (
                <div className="vitan-bottom-cta-global fixed left-1/2 z-30 w-[min(calc(100vw-1.5rem),30rem)] -translate-x-1/2" style={{bottom: `${barBottom}px`}}>
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
