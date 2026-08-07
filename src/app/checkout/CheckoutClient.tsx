"use client";

import Image from "next/image";
import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
import {useBarBottom} from "@/hooks/useBarBottom";
import {PageHeader} from "@/app/components/PageHeader/PageHeader";
import {PAGE_CONTENT_PX} from "@/constants/pageLayout";
import {CART_STORAGE_KEY, getCartItems, clearCart, updateCartQuantity, removeProductFromCart} from "@/lib/cartStorage";
import {SAVED_PRODUCTS_CHANGE_EVENT} from "@/lib/savedProductsEvents";
import {getCartRetailTotal, getProductPriceUah, isWholesaleEligible} from "@/lib/wholesalePricing";
import type {CartProductItem, CartStorageItem} from "@/types/cart";
import type {ItemConfig} from "@/types/item";
import type {PricingConfig} from "@/types/pricingConfig";

interface CheckoutClientProps {
    products: ItemConfig[];
    pricingConfig?: PricingConfig | null;
}

const formatUah = (value: number) =>
    `${new Intl.NumberFormat("uk-UA", {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(value)} ₴`;

const getCartProducts = (cartItems: CartStorageItem[], products: ItemConfig[]): CartProductItem[] =>
    cartItems
        .map(cartItem => {
            const product = products.find(p => p.id === cartItem.productId);
            if (!product) return null;
            return {product, quantity: cartItem.quantity};
        })
        .filter((item): item is CartProductItem => Boolean(item));

export const CheckoutClient = ({products, pricingConfig}: CheckoutClientProps) => {
    const [cartItems, setCartItems] = useState<CartStorageItem[]>([]);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const barBottom = useBarBottom();

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

    const cartProducts = useMemo(() => getCartProducts(cartItems, products), [cartItems, products]);
    const retailTotalPrice = useMemo(() => getCartRetailTotal(cartProducts, pricingConfig), [cartProducts, pricingConfig]);
    const isWholesaleActive = isWholesaleEligible(retailTotalPrice, pricingConfig);
    const totalQuantity = cartProducts.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartProducts.reduce((sum, item) => {
        const price = getProductPriceUah(item.product, isWholesaleActive, pricingConfig);
        return sum + (price ?? 0) * item.quantity;
    }, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const items = cartProducts.map(({product, quantity}) => {
            const price = getProductPriceUah(product, isWholesaleActive, pricingConfig);
            return {
                id: product.id,
                title: product.title,
                quantity,
                price: price ? formatUah(price * quantity) : "—",
                imageUrl: product.imageUrls?.[0] ?? product.imageUrl ?? undefined,
            };
        });

        await fetch("/api/telegram", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name, phone, comment, items, total: formatUah(totalPrice)}),
        }).catch(() => {});

        clearCart();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <main className="flex min-h-screen flex-col text-[var(--text-primary)]">
                <div className="sticky top-0 z-20 px-3 pt-3">
                    <PageHeader>
                        <Link href="/" className="inline-flex h-9 items-center gap-1.5 text-[var(--text-primary)] transition-opacity active:opacity-60">
                            <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2L2 10l8 8"/></svg>
                            <span className="text-[22px] font-bold leading-7 tracking-[-0.4px]">Vitan</span>
                        </Link>
                    </PageHeader>
                </div>
                <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent)]/15">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5"/>
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-[24px] font-bold leading-[30px] tracking-[-0.4px]">Замовлення прийнято!</h1>
                        <p className="mt-2 text-[15px] leading-[22px] text-[var(--text-secondary)]">Ми зв'яжемося з вами найближчим часом</p>
                    </div>
                    <Link href="/" className="vitan-accent-button rounded-[20px] px-6 py-3 text-[15px] font-semibold">
                        На головну
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col text-[var(--text-primary)]">
            <div className="sticky top-0 z-20 px-3 pt-3">
                <PageHeader>
                    <div className="flex items-center gap-3">
                        <Link href="/cart" className="inline-flex h-[28px] w-full items-center justify-start rounded-full text-[var(--text-primary)] transition-opacity active:opacity-60" aria-label="Назад">
                            <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2L2 10l8 8"/></svg>
                        </Link>
                        <Link href="/" className="whitespace-nowrap text-[22px] font-bold leading-7 tracking-[-0.4px] text-[var(--text-primary)]">Вітан</Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                            <rect x="9" y="3" width="6" height="4" rx="2"/>
                            <line x1="9" y1="12" x2="15" y2="12"/>
                            <line x1="9" y1="16" x2="12" y2="16"/>
                        </svg>
                        <h1 className="whitespace-nowrap text-[17px] font-semibold leading-[22px]">Оформлення</h1>
                    </div>
                </PageHeader>
            </div>

            <div className={`grid gap-4 pt-3 ${PAGE_CONTENT_PX}`} style={{paddingBottom: '160px'}}>

                {/* Order summary */}
                {cartProducts.length > 0 && (
                    <div className="vitan-glass-block rounded-3xl p-4">
                        <p className="text-[13px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]" style={{marginBottom: '8px'}}>Ваше замовлення</p>
                        <div className="flex flex-col gap-2">
                            {cartProducts.map(({product, quantity}) => {
                                const price = getProductPriceUah(product, isWholesaleActive, pricingConfig);
                                const imageUrl = product.imageUrls?.[0] ?? product.imageUrl;
                                return (
                                    <div key={product.id} className="flex items-center gap-3 rounded-[20px] bg-black/5 p-2 pr-3">
                                        {/* Thumbnail */}
                                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[14px] bg-black/5">
                                            {imageUrl ? (
                                                <Image src={imageUrl} alt={product.imageAlt ?? product.title} fill className="object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-tertiary)]">
                                                        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="m3 9 4-4 4 4 4-4 4 4"/>
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Name + info */}
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-[13px] font-semibold leading-5">{product.title}</p>
                                            {typeof price === "number" && (
                                                <p className="text-[11px] text-[var(--text-secondary)]">
                                                    {quantity} шт. на суму <span className="font-semibold text-[var(--text-primary)]">{formatUah(price * quantity)}</span>
                                                </p>
                                            )}
                                        </div>

                                        {/* Controls */}
                                        <div className="flex shrink-0 items-center gap-1">
                                            <div className="liquid-control flex items-center overflow-hidden rounded-[8px]" style={{width: 'fit-content'}}>
                                                <button
                                                    type="button"
                                                    onClick={() => updateCartQuantity(product.id, quantity - 1)}
                                                    className="flex items-center justify-center text-[var(--text-primary)] transition-opacity active:opacity-50"
                                                    style={{width: '20px', height: '24px'}}
                                                    aria-label="Зменшити"
                                                >
                                                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14"/></svg>
                                                </button>
                                                <span className="text-center text-[11px] font-semibold" style={{width: '16px'}}>{quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateCartQuantity(product.id, quantity + 1)}
                                                    className="flex items-center justify-center text-[var(--text-primary)] transition-opacity active:opacity-50"
                                                    style={{width: '20px', height: '24px'}}
                                                    aria-label="Збільшити"
                                                >
                                                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeProductFromCart(product.id)}
                                                className="flex items-center justify-center rounded-[8px] text-[var(--destructive)] transition-all active:opacity-50"
                                                style={{width: '20px', height: '24px'}}
                                                aria-label="Видалити"
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Total */}
                            <div className="flex justify-end">
                                <div className="rounded-[20px] bg-black/5 px-4 py-3" style={{width: 'fit-content', minWidth: '35%'}}>
                                    <p className="text-[12px] text-[var(--text-secondary)]">{totalQuantity} товарів на суму</p>
                                    <p className="text-[14px] font-bold leading-5">{formatUah(totalPrice)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contact form */}
                <form id="checkout-form" onSubmit={handleSubmit} className="flex flex-col" style={{gap: '15px'}}>
                    <div className="vitan-glass-block rounded-3xl p-4">
                        <p className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Ваші дані</p>
                        <div className="flex flex-col gap-3">
                            <div>
                                <label className="mb-1 block text-[13px] font-medium text-[var(--text-secondary)]">Ім'я та прізвище</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Іван Іваненко"
                                    className="w-full rounded-[20px] bg-black/5 px-4 py-3 text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-2 focus:ring-[var(--accent)]/40 transition-shadow"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-[13px] font-medium text-[var(--text-secondary)]">Номер телефону</label>
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="+38 (0XX) XXX-XX-XX"
                                    className="w-full rounded-[20px] bg-black/5 px-4 py-3 text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-2 focus:ring-[var(--accent)]/40 transition-shadow"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-[13px] font-medium text-[var(--text-secondary)]">Коментар до замовлення</label>
                                <textarea
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    placeholder="Адреса доставки, побажання..."
                                    rows={3}
                                    className="w-full resize-none rounded-[20px] bg-black/5 px-4 py-3 text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-2 focus:ring-[var(--accent)]/40 transition-shadow"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Desktop button — inside form flow */}
                    <button
                        type="submit"
                        disabled={cartProducts.length === 0}
                        className="vitan-accent-button hidden w-full rounded-[20px] py-4 text-[16px] font-semibold disabled:opacity-40 lg:block"
                    >
                        Оформити замовлення
                    </button>
                </form>
            </div>

            {/* Mobile/tablet — fixed above nav + footer */}
            <div className="fixed left-1/2 z-30 w-[min(calc(100vw-1.5rem),30rem)] -translate-x-1/2 lg:hidden transition-[bottom] duration-200 ease-out" style={{bottom: `${barBottom}px`}}>
                <button
                    type="submit"
                    form="checkout-form"
                    disabled={cartProducts.length === 0}
                    className="vitan-accent-button w-full rounded-[20px] py-4 text-[16px] font-semibold disabled:opacity-40"
                >
                    Оформити замовлення
                </button>
            </div>
        </main>
    );
};
