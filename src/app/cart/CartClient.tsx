"use client";

import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
import {CART_CLASS_NAMES, CART_STORAGE_KEY} from "@/constants/cart";
import {PAGE_CONTENT_PX} from "@/constants/pageLayout";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {
    addProductToCart,
    getCartItems,
    getCartPriceSnapshot,
    removeProductFromCart,
    setCartItems as saveCartItems,
    updateCartQuantity,
} from "@/lib/cartStorage";
import {SAVED_PRODUCTS_CHANGE_EVENT} from "@/lib/savedProductsEvents";
import type {CartStorageItem} from "@/types/cart";
import type {ItemConfig} from "@/types/item";
import {useBarBottom} from "@/hooks/useBarBottom";
import {useFooterBottomInset} from "@/hooks/useFooterBottomInset";
import {PageHeader} from "@/app/components/PageHeader/PageHeader";
import {HeaderBrandLink} from "@/app/components/HeaderBrandLink/HeaderBrandLink";
import {ConfirmModal} from "@/app/components/ConfirmModal/ConfirmModal";
import {RelatedProductsRow} from "@/app/components/RelatedProductsRow/RelatedProductsRow";
import {CartProductRow} from "@/app/cart/CartProductRow";
import {getCartProducts, getCleanCartItems, shouldSaveCleanCartItems} from "@/lib/cartProducts";
import {getCategoriesFromProducts, getRelatedProducts} from "@/lib/relatedProducts";
import CartIcon from "@/app/components/icon/CartIcon";
import {formatUah} from "@/lib/formatters";
import {getCartRetailTotal, getOptPrice, getProductPriceUah, getWholesaleTooltipText, isWholesaleEligible} from "@/lib/wholesalePricing";
import type {SiteContent} from "@/constants/siteContent";
import type {PricingConfig} from "@/types/pricingConfig";

interface CartClientProps {
    products: ItemConfig[];
    pricingConfig?: PricingConfig | null;
}

interface CartBottomCtaProps {
    bottom: number;
    totalQuantity: number;
    totalPrice: number;
    copy: SiteContent["cart"];
}

const CartBottomCta = ({bottom, totalQuantity, totalPrice, copy}: CartBottomCtaProps) => {
    return (
        <div className="vitan-bottom-cta-global fixed left-1/2 z-30 w-[min(calc(100vw-1.5rem),30rem)] -translate-x-1/2" style={{bottom: `${bottom}px`}}>
            <div className="flex items-stretch justify-between gap-2 overflow-hidden rounded-full border-[0.5px] border-white/55 bg-white/90 pl-[27px] pr-[6px] py-[6px] shadow-[0_1px_8px_rgba(0,0,0,0.08)]">
                <div className="flex flex-col justify-center">
                    <p className="text-[10px] text-[var(--text-secondary)]">{totalQuantity} {copy.totalSuffix}</p>
                    <p className="text-[14px] font-bold leading-5">{formatUah(totalPrice)}</p>
                </div>
                <Link
                    href="/checkout"
                    className="vitan-accent-button self-stretch shrink-0 flex items-center rounded-[var(--radius-lg)] px-4 text-[12px] font-semibold whitespace-nowrap"
                >
                    {copy.checkoutButton}
                </Link>
            </div>
        </div>
    );
};

export const CartClient = ({products, pricingConfig}: CartClientProps) => {
    const [cartItems, setCartItems] = useState<CartStorageItem[]>([]);
    const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

    const siteContent = useSiteContent();
    const copy = siteContent.cart;
    const optPrice = getOptPrice(pricingConfig);
    const wholesaleTooltipText = getWholesaleTooltipText(pricingConfig, "", siteContent.wholesale);
    const barBottom = useBarBottom();

    const productsById = useMemo(() => new Map(products.map(product => [product.id, product])), [products]);
    const cartProducts = useMemo(() => getCartProducts(cartItems, productsById), [cartItems, productsById]);
    const cartProductIds = useMemo(() => new Set(cartProducts.map(item => item.product.id)), [cartProducts]);
    const relatedProducts = useMemo(() => {
        const cartItemConfigs = cartProducts.map(cp => cp.product);
        const categories = getCategoriesFromProducts(cartItemConfigs);
        return getRelatedProducts(cartProductIds, categories, products);
    }, [cartProducts, cartProductIds, products]);
    const retailTotalPrice = useMemo(() => getCartRetailTotal(cartProducts, pricingConfig), [cartProducts, pricingConfig]);
    const isWholesaleActive = isWholesaleEligible(retailTotalPrice, pricingConfig);
    const remainingToWholesale = Math.max(0, optPrice - retailTotalPrice);
    const shouldShowWholesaleHint = cartProducts.length > 0 && !isWholesaleActive && remainingToWholesale > 0;
    const {totalPrice, totalQuantity} = useMemo(() => cartProducts.reduce((totals, item) => {
        totals.totalQuantity += item.quantity;
        totals.totalPrice += (getProductPriceUah(item.product, isWholesaleActive, pricingConfig) ?? 0) * item.quantity;
        return totals;
    }, {totalPrice: 0, totalQuantity: 0}), [cartProducts, isWholesaleActive, pricingConfig]);

    useEffect(() => {
        if (productsById.size > 0) {
            const raw = getCartItems();
            const clean = getCleanCartItems(raw, productsById);

            if (shouldSaveCleanCartItems(clean, raw)) {
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

    useFooterBottomInset({enabled: cartProducts.length > 0});

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

    const handleRelatedProductAction = (id: string) => {
        const product = productsById.get(id);
        addProductToCart(id, 1, product ? getCartPriceSnapshot(product) : undefined);
    };

    return (
        <main className={CART_CLASS_NAMES.page}>
            <div className={`sticky top-0 z-20 pt-3 ${PAGE_CONTENT_PX}`}>
                <PageHeader>
                    <div className="flex items-center gap-1 md:gap-3">
                        <Link href="/" className="inline-flex h-[28px] w-[28px] shrink-0 items-center justify-start rounded-full text-[var(--text-primary)] transition-opacity active:opacity-60" aria-label={siteContent.navigation.backAriaLabel}>
                            <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2L2 10l8 8"/></svg>
                        </Link>
                        <HeaderBrandLink />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <CartIcon size={20} strokeWidth="2.2" className="!mb-[2px]" />
                        <h1 className={CART_CLASS_NAMES.title}>{copy.title}</h1>
                    </div>
                </PageHeader>
            </div>

            <section className={CART_CLASS_NAMES.content}>
                {!cartProducts.length ? (
                    <div className={CART_CLASS_NAMES.emptyState}>
                        {copy.empty}
                    </div>
                ) : (
                    <>
                        <div className={CART_CLASS_NAMES.list}>
                            {cartProducts.map(({product, quantity}) => (
                                <CartProductRow
                                    key={product.id}
                                    product={product}
                                    quantity={quantity}
                                    pricingConfig={pricingConfig}
                                    isWholesaleActive={isWholesaleActive}
                                    wholesaleTooltipText={wholesaleTooltipText}
                                    onQuantityChange={handleQuantityChange}
                                    onRequestRemove={setConfirmRemoveId}
                                />
                            ))}
                        </div>

                        {shouldShowWholesaleHint && (
                            <div className="liquid-surface rounded-2xl px-4 py-3 text-[13px] font-semibold leading-5 text-[var(--text-primary)]">
                                {copy.wholesaleHint.addMorePrefix} {formatUah(remainingToWholesale)}, {copy.wholesaleHint.minimumPrefix} {formatUah(optPrice)} {copy.wholesaleHint.suffix}
                            </div>
                        )}

                        <RelatedProductsRow
                            products={relatedProducts}
                            onAction={handleRelatedProductAction}
                            isActive={(id) => cartProductIds.has(id)}
                            actionIcon={<CartIcon size={16} />}
                            activeActionIcon={<CartIcon size={16} checked />}
                        />
                    </>
                )}
            </section>

            {cartProducts.length > 0 && (
                <CartBottomCta
                    bottom={barBottom}
                    totalQuantity={totalQuantity}
                    totalPrice={totalPrice}
                    copy={copy}
                />
            )}

            {confirmRemoveId && (
                <ConfirmModal
                    isOpen={Boolean(confirmRemoveId)}
                    text={copy.confirmRemove}
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
