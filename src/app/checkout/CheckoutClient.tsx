"use client";

import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
import {useBarBottom} from "@/hooks/useBarBottom";
import {useFooterBottomInset} from "@/hooks/useFooterBottomInset";
import {PageHeader} from "@/app/components/PageHeader/PageHeader";
import {HeaderBrandLink} from "@/app/components/HeaderBrandLink/HeaderBrandLink";
import {CHECKOUT_FORM_FIELDS} from "@/constants/checkout";
import {CART_STORAGE_KEY} from "@/constants/cart";
import {PAGE_CONTENT_PX} from "@/constants/pageLayout";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {getCartItems, clearCart} from "@/lib/cartStorage";
import {SAVED_PRODUCTS_CHANGE_EVENT} from "@/lib/savedProductsEvents";
import {formatUah} from "@/lib/formatters";
import {getCartRetailTotal, isWholesaleEligible} from "@/lib/wholesalePricing";
import type {CartStorageItem} from "@/types/cart";
import type {ItemConfig} from "@/types/item";
import type {PricingConfig} from "@/types/pricingConfig";
import {CheckoutOrderSummary} from "@/app/checkout/CheckoutOrderSummary";
import {CheckoutSuccessView} from "@/app/checkout/CheckoutSuccessView";
import {submitTelegramOrder} from "@/lib/checkoutApi";
import {getCheckoutCartProducts, getCheckoutPayloadItems, getCheckoutTotals} from "@/lib/checkoutProducts";

interface CheckoutClientProps {
    products: ItemConfig[];
    pricingConfig?: PricingConfig | null;
}

export const CheckoutClient = ({products, pricingConfig}: CheckoutClientProps) => {
    const [cartItems, setCartItems] = useState<CartStorageItem[]>([]);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const fieldValues = {name, phone, comment};
    const fieldSetters = {name: setName, phone: setPhone, comment: setComment};

    const siteContent = useSiteContent();
    const copy = siteContent.checkout;
    const barBottom = useBarBottom();

    const productsById = useMemo(() => new Map(products.map(product => [product.id, product])), [products]);
    const cartProducts = useMemo(() => getCheckoutCartProducts(cartItems, productsById), [cartItems, productsById]);
    const retailTotalPrice = useMemo(() => getCartRetailTotal(cartProducts, pricingConfig), [cartProducts, pricingConfig]);
    const isWholesaleActive = isWholesaleEligible(retailTotalPrice, pricingConfig);
    const {totalPrice, totalQuantity} = useMemo(
        () => getCheckoutTotals(cartProducts, isWholesaleActive, pricingConfig),
        [cartProducts, isWholesaleActive, pricingConfig],
    );

    useEffect(() => {
        const sync = () => setCartItems(getCartItems());
        const handleStorage = (e: StorageEvent) => {
            if (e.key === CART_STORAGE_KEY) sync();
        };
        sync();
        window.addEventListener(SAVED_PRODUCTS_CHANGE_EVENT, sync);
        window.addEventListener("storage", handleStorage);
        return () => {
            window.removeEventListener(SAVED_PRODUCTS_CHANGE_EVENT, sync);
            window.removeEventListener("storage", handleStorage);
        };
    }, []);

    useFooterBottomInset({
        enabled: !submitted,
        mediaQuery: "(max-width: 1023px)",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const items = getCheckoutPayloadItems(cartProducts, isWholesaleActive, pricingConfig);

        await submitTelegramOrder({name, phone, comment, items, total: formatUah(totalPrice)}, copy.submitError).catch(() => {});

        clearCart();
        setSubmitted(true);
    };

    if (submitted) {
        return <CheckoutSuccessView copy={copy} />;
    }

    return (
        <main className="flex min-h-screen flex-col text-[var(--text-primary)]">
            <div className={`sticky top-0 z-20 pt-3 ${PAGE_CONTENT_PX}`}>
                <PageHeader>
                    <div className="flex items-center gap-1 md:gap-3">
                        <Link href="/cart" className="inline-flex h-[28px] w-[28px] shrink-0 items-center justify-start rounded-full text-[var(--text-primary)] transition-opacity active:opacity-60" aria-label={siteContent.navigation.backAriaLabel}>
                            <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2L2 10l8 8"/></svg>
                        </Link>
                        <HeaderBrandLink />
                    </div>
                    <div className="flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                            <rect x="9" y="3" width="6" height="4" rx="2"/>
                            <line x1="9" y1="12" x2="15" y2="12"/>
                            <line x1="9" y1="16" x2="12" y2="16"/>
                        </svg>
                        <h1 className="whitespace-nowrap text-[17px] font-semibold leading-[22px]">{copy.title}</h1>
                    </div>
                </PageHeader>
            </div>

            <div className={`grid gap-4 pb-4 pt-3 ${PAGE_CONTENT_PX}`}>

                {cartProducts.length > 0 && (
                    <CheckoutOrderSummary
                        cartProducts={cartProducts}
                        isWholesaleActive={isWholesaleActive}
                        pricingConfig={pricingConfig}
                        totalQuantity={totalQuantity}
                        totalPrice={totalPrice}
                        copy={copy}
                    />
                )}

                <form id="checkout-form" onSubmit={handleSubmit} className="flex flex-col" style={{gap: '15px'}}>
                    <div className="vitan-glass-block rounded-3xl p-4">
                        <p className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">{copy.customerDetailsTitle}</p>
                        <div className="flex flex-col gap-3">
                            {CHECKOUT_FORM_FIELDS.map(({id, type, required, rows}) => {
                                const label = id === "name" ? copy.fields.fullName : copy.fields[id];
                                const placeholder = id === "name" ? copy.placeholders.fullName : copy.placeholders[id];

                                return (
                                    <div key={id}>
                                        <label className="mb-1 block text-[13px] font-medium text-[var(--text-secondary)]">{label}</label>
                                        {type === "textarea" ? (
                                            <textarea
                                                value={fieldValues[id]}
                                                onChange={e => fieldSetters[id](e.target.value)}
                                                placeholder={placeholder}
                                                rows={rows ?? undefined}
                                                className="w-full resize-none rounded-[20px] bg-black/5 px-4 py-3 text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-2 focus:ring-[var(--accent)]/40 transition-shadow"
                                            />
                                        ) : (
                                            <input
                                                type={type}
                                                required={required}
                                                value={fieldValues[id]}
                                                onChange={e => fieldSetters[id](e.target.value)}
                                                placeholder={placeholder}
                                                className="w-full rounded-[20px] bg-black/5 px-4 py-3 text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-2 focus:ring-[var(--accent)]/40 transition-shadow"
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={cartProducts.length === 0}
                        className="vitan-accent-button hidden w-full rounded-[20px] py-4 text-[16px] font-semibold disabled:opacity-40 lg:block"
                    >
                        {copy.submitButton}
                    </button>
                </form>
            </div>


            <div
                className="vitan-bottom-cta-mobile fixed left-1/2 z-30 w-[min(calc(100vw-1.5rem),30rem)] -translate-x-1/2 lg:hidden"
                style={{bottom: `${barBottom}px`}}
            >
                <button
                    type="submit"
                    form="checkout-form"
                    disabled={cartProducts.length === 0}
                    className="vitan-accent-button w-full rounded-[20px] py-4 text-[16px] font-semibold disabled:opacity-40"
                >
                    {copy.submitButton}
                </button>
            </div>
        </main>
    );
};
