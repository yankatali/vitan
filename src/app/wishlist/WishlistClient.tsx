"use client";

import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
import {WISHLIST_CLASS_NAMES, WISHLIST_STORAGE_KEY} from "@/constants/wishlist";
import {PAGE_CONTENT_PX} from "@/constants/pageLayout";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {addProductToCart, getCartPriceSnapshot, removeProductFromCart} from "@/lib/cartStorage";
import {SAVED_PRODUCTS_CHANGE_EVENT} from "@/lib/savedProductsEvents";
import {getWishlistIds, toggleWishlistProduct} from "@/lib/wishlistStorage";
import type {ItemConfig} from "@/types/item";
import {useBarBottom} from "@/hooks/useBarBottom";
import {useCartWholesaleStatus} from "@/hooks/useCartWholesaleStatus";
import {useFooterBottomInset} from "@/hooks/useFooterBottomInset";
import {PageHeader} from "@/app/components/PageHeader/PageHeader";
import {HeaderBrandLink} from "@/app/components/HeaderBrandLink/HeaderBrandLink";
import {ConfirmModal} from "@/app/components/ConfirmModal/ConfirmModal";
import {RelatedProductsRow} from "@/app/components/RelatedProductsRow/RelatedProductsRow";
import {WishlistProductCard} from "@/app/wishlist/WishlistProductCard";
import {getWishlistProducts} from "@/lib/wishlistProducts";
import {getCategoriesFromProducts, getRelatedProducts} from "@/lib/relatedProducts";
import WishlistIcon from "@/app/components/icon/WishlistIcon";
import {formatUah} from "@/lib/formatters";
import {getProductPriceUah, getWholesaleTooltipText} from "@/lib/wholesalePricing";
import type {PricingConfig} from "@/types/pricingConfig";
import type {WishlistBottomCtaProps, WishlistClientProps} from "@/types/props";


const WishlistBottomCta = ({bottom, productCount, totalPrice, buttonText}: WishlistBottomCtaProps) => {
    const copy = useSiteContent().common;

    return (
        <div className="vitan-bottom-cta-global fixed left-1/2 z-30 w-[min(calc(100vw-1.5rem),30rem)] -translate-x-1/2" style={{bottom: `${bottom}px`}}>
            <div className="flex items-stretch justify-between gap-2 overflow-hidden rounded-full border-[0.5px] border-white/55 bg-white/90 pl-[27px] pr-[6px] py-[6px] shadow-[0_1px_8px_rgba(0,0,0,0.08)]">
                <div className="flex flex-col justify-center">
                    <p className="text-[10px] text-[var(--text-secondary)]">{productCount} {copy.productCountSuffix}</p>
                    <p className="text-[14px] font-bold leading-5">{formatUah(totalPrice)}</p>
                </div>
                <Link
                    href="/cart"
                    className="vitan-accent-button self-stretch shrink-0 flex items-center rounded-[var(--radius-lg)] px-4 text-[12px] font-semibold whitespace-nowrap"
                >
                    {buttonText}
                </Link>
            </div>
        </div>
    );
};

export const WishlistClient = ({products, pricingConfig}: WishlistClientProps) => {
    const [wishlistIds, setWishlistIds] = useState<string[]>([]);
    const [confirmCartRemoveId, setConfirmCartRemoveId] = useState<string | null>(null);

    const siteContent = useSiteContent();
    const copy = siteContent.wishlist;
    const wholesaleTooltipText = getWholesaleTooltipText(pricingConfig, "", siteContent.wholesale);
    const barBottom = useBarBottom();
    const {cartItems, isWholesaleActive} = useCartWholesaleStatus(products, pricingConfig);

    const productsById = useMemo(() => new Map(products.map(product => [product.id, product])), [products]);
    const wishlistProducts = useMemo(() => getWishlistProducts(wishlistIds, productsById), [productsById, wishlistIds]);
    const cartProductIds = useMemo(() => new Set(cartItems.map(item => item.productId)), [cartItems]);
    const relatedProducts = useMemo(() => {
        const wishlistItemConfigs = wishlistProducts.map(w => w.product);
        const categories = getCategoriesFromProducts(wishlistItemConfigs);
        const excludeIds = new Set(wishlistIds);
        return getRelatedProducts(excludeIds, categories, products);
    }, [wishlistProducts, wishlistIds, products]);
    const totalPrice = useMemo(() => wishlistProducts.reduce((sum, item) => {
        return sum + (getProductPriceUah(item.product, isWholesaleActive, pricingConfig) ?? 0);
    }, 0), [wishlistProducts, isWholesaleActive, pricingConfig]);

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
    }, [products]);

    useFooterBottomInset({enabled: wishlistProducts.length > 0});

    const handleAddToCart = (productId: string) => {
        const product = productsById.get(productId);
        addProductToCart(productId, 1, product ? getCartPriceSnapshot(product) : undefined);
    };

    const handleRemoveFromCart = (productId: string) => {
        removeProductFromCart(productId);
    };

    return (
        <main className={WISHLIST_CLASS_NAMES.page}>
            <div className={`sticky top-0 z-20 pt-3 ${PAGE_CONTENT_PX}`}>
                <PageHeader>
                    <div className="flex items-center gap-1 md:gap-3">
                        <Link href="/" className="inline-flex h-[28px] w-[28px] shrink-0 items-center justify-start rounded-full text-[var(--text-primary)] transition-opacity active:opacity-60" aria-label={siteContent.navigation.backAriaLabel}>
                            <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2L2 10l8 8"/></svg>
                        </Link>
                        <HeaderBrandLink />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <WishlistIcon size={20} filled />
                        <h1 className={WISHLIST_CLASS_NAMES.title}>{copy.title}</h1>
                    </div>
                </PageHeader>
            </div>

            <section className={WISHLIST_CLASS_NAMES.content}>
                {!wishlistIds.length ? (
                    <div className={WISHLIST_CLASS_NAMES.emptyState}>
                        {copy.empty}
                    </div>
                ) : (
                    <>
                        <div className={WISHLIST_CLASS_NAMES.list}>
                            {wishlistProducts.map(({product}) => (
                                <WishlistProductCard
                                    key={product.id}
                                    item={product}
                                    isInCart={cartProductIds.has(product.id)}
                                    isWholesaleActive={isWholesaleActive}
                                    wholesaleTooltipText={wholesaleTooltipText}
                                    onAddToCart={handleAddToCart}
                                    onRequestCartRemove={setConfirmCartRemoveId}
                                />
                            ))}
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
                <WishlistBottomCta
                    bottom={barBottom}
                    productCount={wishlistIds.length}
                    totalPrice={totalPrice}
                    buttonText={copy.goToCartButton}
                />
            )}

            {confirmCartRemoveId && (
                <ConfirmModal
                    isOpen={Boolean(confirmCartRemoveId)}
                    text={siteContent.cart.confirmRemove}
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
