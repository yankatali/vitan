"use client";

import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
import {WISHLIST_CLASS_NAMES} from "@/constants/wishlist";
import {PRODUCT_CARD_ACTION_CLASS_NAMES} from "@/constants/productCardActions";
import {addProductToCart, getCartPriceSnapshot, removeProductFromCart} from "@/lib/cartStorage";
import {SAVED_PRODUCTS_CHANGE_EVENT} from "@/lib/savedProductsEvents";
import {getWishlistIds, toggleWishlistProduct, WISHLIST_STORAGE_KEY} from "@/lib/wishlistStorage";
import type {ItemConfig} from "@/types/item";
import type {WishlistProductItem} from "@/types/wishlist";
import {useBarBottom} from "@/hooks/useBarBottom";
import {useCartWholesaleStatus} from "@/hooks/useCartWholesaleStatus";
import {PageHeader} from "@/app/components/PageHeader/PageHeader";
import {ConfirmModal} from "@/app/components/ConfirmModal/ConfirmModal";
import {ProductCardSimple} from "@/app/components/ProductCardSimple/ProductCardSimple";
import {RelatedProductsRow, getCategoriesFromProducts, getRelatedProducts} from "@/app/components/RelatedProductsRow/RelatedProductsRow";
import CartIcon from "@/app/components/icon/CartIcon";
import WishlistIcon from "@/app/components/icon/WishlistIcon";
import {getProductPriceUah, getWholesaleTooltipText} from "@/lib/wholesalePricing";
import type {PricingConfig} from "@/types/pricingConfig";

interface WishlistClientProps {
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

const getWishlistProducts = (wishlistIds: string[], products: ItemConfig[]): WishlistProductItem[] => {
    return wishlistIds
        .map(productId => {
            const product = products.find(item => item.id === productId);
            if (!product) return null;
            return {product};
        })
        .filter((item): item is WishlistProductItem => Boolean(item));
};

export const WishlistClient = ({products, pricingConfig}: WishlistClientProps) => {
    const [wishlistIds, setWishlistIds] = useState<string[]>([]);
    const [confirmCartRemoveId, setConfirmCartRemoveId] = useState<string | null>(null);
    const barBottom = useBarBottom();
    const {cartItems, isWholesaleActive} = useCartWholesaleStatus(products, pricingConfig);
    const productsById = useMemo(() => new Map(products.map(product => [product.id, product])), [products]);

    useEffect(() => {
        if (products.length > 0) {
            const validIds = new Set(products.map(p => p.id));
            const rawWishlist = getWishlistIds();
            const cleanWishlist = rawWishlist.filter(id => validIds.has(id));
            if (cleanWishlist.length !== rawWishlist.length) {
                localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(cleanWishlist));
                window.dispatchEvent(new CustomEvent(SAVED_PRODUCTS_CHANGE_EVENT));
            }
        }

        const syncWishlist = () => setWishlistIds(getWishlistIds());
        const handleStorage = (event: StorageEvent) => {
            if (event.key === WISHLIST_STORAGE_KEY) syncWishlist();
        };

        syncWishlist();
        window.addEventListener(SAVED_PRODUCTS_CHANGE_EVENT, syncWishlist);
        window.addEventListener("storage", handleStorage);
        window.addEventListener("pageshow", syncWishlist);

        return () => {
            window.removeEventListener(SAVED_PRODUCTS_CHANGE_EVENT, syncWishlist);
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("pageshow", syncWishlist);
        };
    }, []);

    const wishlistProducts = useMemo(() => getWishlistProducts(wishlistIds, products), [products, wishlistIds]);
    const cartProductIds = useMemo(() => new Set(cartItems.map(item => item.productId)), [cartItems]);

    const relatedProducts = useMemo(() => {
        const wishlistItemConfigs = wishlistProducts.map(w => w.product);
        const categories = getCategoriesFromProducts(wishlistItemConfigs);
        const excludeIds = new Set(wishlistIds);
        return getRelatedProducts(excludeIds, categories, products);
    }, [wishlistProducts, wishlistIds, products]);

    const wholesaleTooltipText = getWholesaleTooltipText(pricingConfig);

    const totalPrice = useMemo(() => wishlistProducts.reduce((sum, item) => {
        return sum + (getProductPriceUah(item.product, isWholesaleActive, pricingConfig) ?? 0);
    }, 0), [wishlistProducts, isWholesaleActive, pricingConfig]);

    const handleAddToCart = (productId: string) => {
        const product = productsById.get(productId);
        addProductToCart(productId, 1, product ? getCartPriceSnapshot(product) : undefined);
    };

    const handleRemoveFromCart = (productId: string) => {
        removeProductFromCart(productId);
    };

    return (
        <main className={WISHLIST_CLASS_NAMES.page}>
            <div className="sticky top-0 z-20 px-3 pt-3">
                <PageHeader>
                    <div className="flex items-center gap-3">
                        <Link href="/" className="inline-flex h-[28px] w-full items-center justify-start rounded-full text-[var(--text-primary)] transition-opacity active:opacity-60" aria-label="Назад">
                            <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2L2 10l8 8"/></svg>
                        </Link>
                        <Link href="/" className={WISHLIST_CLASS_NAMES.homeLink}>Вітан</Link>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <WishlistIcon size={20} filled />
                        <h1 className={WISHLIST_CLASS_NAMES.title}>Вибране</h1>
                    </div>
                </PageHeader>
            </div>

            <section className={WISHLIST_CLASS_NAMES.content}>
                {!wishlistIds.length ? (
                    <div className={WISHLIST_CLASS_NAMES.emptyState}>
                        Список вибраного порожній. Додайте товари з каталогу.
                    </div>
                ) : (
                    <>
                        <div className={WISHLIST_CLASS_NAMES.list}>
                            {wishlistProducts.map(({product: item}) => {

                                const isInCart = cartProductIds.has(item.id);
                                const priceUah = item.priceUah ?? null;
                                const priceUahWholesale = item.priceUahWholesale ?? null;

                                return (
                                    <ProductCardSimple
                                        key={item.id}
                                        className="vitan-product-card--wishlist"
                                        item={item}
                                        priceUah={priceUah}
                                        priceUahWholesale={priceUahWholesale}
                                        wholesaleDescription={item.wholesaleDescription ?? ""}
                                        wholesaleActiveDescription={wholesaleTooltipText}
                                        wholesaleAsPrimary={isWholesaleActive}
                                        cartAction={
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (isInCart) {
                                                        setConfirmCartRemoveId(item.id);
                                                        return;
                                                    }
                                                    handleAddToCart(item.id);
                                                }}
                                                className={isInCart ? PRODUCT_CARD_ACTION_CLASS_NAMES.activeCartButton : PRODUCT_CARD_ACTION_CLASS_NAMES.cartButton}
                                                aria-pressed={isInCart}
                                                aria-label={isInCart ? "У кошику" : "В кошик"}
                                            >
                                                <CartIcon size={24} checked={isInCart} />
                                            </button>
                                        }
                                    />
                                );
                            })}
                        </div>

                        <RelatedProductsRow
                            products={relatedProducts}
                            onAction={(id) => {
                                toggleWishlistProduct(id);
                            }}
                            isActive={(id) => wishlistIds.includes(id)}
                            actionIcon={<WishlistIcon size={16} />}
                            activeActionIcon={<WishlistIcon size={16} filled />}
                        />
                    </>
                )}
            </section>

            {wishlistProducts.length > 0 && (
                <div className="fixed left-1/2 z-30 w-[min(calc(100vw-1.5rem),30rem)] -translate-x-1/2 transition-[bottom] duration-200 ease-out" style={{bottom: `${barBottom}px`}}>
                    <div className="flex items-stretch justify-between gap-2 overflow-hidden rounded-full border-[0.5px] border-white/35 bg-white/50 pl-[27px] pr-[6px] py-[6px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] backdrop-blur-2xl">
                        <div className="flex flex-col justify-center">
                            <p className="text-[10px] text-[var(--text-secondary)]">{wishlistIds.length} товарів</p>
                            <p className="text-[14px] font-bold leading-5">{formatUah(totalPrice)}</p>
                        </div>
                        <Link
                            href="/cart"
                            className="vitan-accent-button self-stretch shrink-0 flex items-center rounded-[var(--radius-lg)] px-4 text-[12px] font-semibold whitespace-nowrap"
                        >
                            Перейти до кошика
                        </Link>
                    </div>
                </div>
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
