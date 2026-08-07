"use client";

import Image from "next/image";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {useMemo} from "react";
import type {ItemConfig} from "@/types/item";

interface OrderClientProps {
    products: ItemConfig[];
}

const formatUah = (value: number) =>
    `${new Intl.NumberFormat("uk-UA", {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(value)} ₴`;

export const OrderClient = ({products}: OrderClientProps) => {
    const searchParams = useSearchParams();

    const name = searchParams.get("name") ?? "";
    const phone = searchParams.get("phone") ?? "";
    const comment = searchParams.get("comment") ?? "";
    const itemsParam = searchParams.get("items") ?? "";

    const orderItems = useMemo(() => {
        if (!itemsParam) return [];
        return itemsParam.split(",").flatMap(pair => {
            const [id, qty] = pair.split(":");
            const product = products.find(p => p.id === id);
            if (!product) return [];
            return [{product, quantity: parseInt(qty, 10) || 1}];
        });
    }, [itemsParam, products]);

    const totalPrice = orderItems.reduce((sum, {product, quantity}) => {
        const price = product.priceUah;
        return sum + (price ?? 0) * quantity;
    }, 0);

    const totalQuantity = orderItems.reduce((sum, {quantity}) => sum + quantity, 0);

    if (orderItems.length === 0) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-[17px] font-semibold text-[var(--text-primary)]">Замовлення не знайдено</p>
                <Link href="/" className="vitan-accent-button rounded-[20px] px-6 py-3 text-[15px] font-semibold">
                    На головну
                </Link>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col pb-10 text-[var(--text-primary)]">
            {/* Header */}
            <div className="sticky top-0 z-20 px-3 pt-3">
                <div className="flex items-center gap-2 rounded-[var(--radius-xl)] bg-white/30 pl-6 pr-3 pb-3 pt-3 lg:pr-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),inset_0_-1px_1px_rgba(0,0,0,0.05),0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-2xl backdrop-saturate-[180%]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                        <rect x="9" y="3" width="6" height="4" rx="2"/>
                        <line x1="9" y1="12" x2="15" y2="12"/>
                        <line x1="9" y1="16" x2="12" y2="16"/>
                    </svg>
                    <h1 className="text-[17px] font-semibold leading-[22px]">Замовлення</h1>
                </div>
            </div>

            <div className="grid gap-3 px-4 pt-3 md:px-6">

                {/* Customer info */}
                <div className="vitan-glass-block rounded-3xl p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]" style={{marginBottom: '10px'}}>Замовник</p>
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[var(--text-secondary)]">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                            </svg>
                            <p className="text-[14px] font-semibold">{name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[var(--text-secondary)]">
                                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.89 10.8a19.79 19.79 0 01-3.07-8.63A2 2 0 012.81 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.29 6.29l1.28-1.28a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                            </svg>
                            <p className="text-[14px]">{phone}</p>
                        </div>
                        {comment && (
                            <div className="flex items-start gap-2">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-[var(--text-secondary)]">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                </svg>
                                <p className="text-[13px] text-[var(--text-secondary)]">{comment}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Products */}
                <div className="vitan-glass-block rounded-3xl p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]" style={{marginBottom: '10px'}}>
                        Товари · {totalQuantity} шт.
                    </p>
                    <div className="flex flex-col gap-2">
                        {orderItems.map(({product, quantity}) => {
                            const price = product.priceUah;
                            const imageUrl = product.imageUrls?.[0] ?? product.imageUrl;
                            return (
                                <div key={product.id} className="flex items-center gap-3 rounded-[16px] bg-black/5 p-2 pr-3">
                                    {/* Photo */}
                                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[12px] bg-black/5">
                                        {imageUrl ? (
                                            <Image src={imageUrl} alt={product.imageAlt ?? product.title} fill className="object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-[var(--text-tertiary)]">
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m3 9 4-4 4 4 4-4 4 4"/></svg>
                                            </div>
                                        )}
                                    </div>
                                    {/* Info */}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-[14px] font-semibold leading-5">{product.title}</p>
                                        <p className="text-[12px] text-[var(--text-secondary)]">{quantity} шт.</p>
                                    </div>
                                    {/* Price */}
                                    {typeof price === "number" && (
                                        <p className="shrink-0 text-[14px] font-bold">{formatUah(price * quantity)}</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Total */}
                <div className="flex justify-end">
                    <div className="vitan-glass-block rounded-[20px] px-5 py-3" style={{minWidth: '40%'}}>
                        <p className="text-[11px] text-[var(--text-secondary)]">{totalQuantity} товарів на суму</p>
                        <p className="text-[16px] font-bold leading-6">{formatUah(totalPrice)}</p>
                    </div>
                </div>
            </div>
        </main>
    );
};
