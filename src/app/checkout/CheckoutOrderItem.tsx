"use client";

import Image from "next/image";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import type {SiteContent} from "@/constants/siteContent";
import {formatUah} from "@/lib/formatters";
import {removeProductFromCart, updateCartQuantity} from "@/lib/cartStorage";
import type {ItemConfig} from "@/types/item";
import type {CheckoutItemThumbnailProps, CheckoutOrderItemProps, CheckoutQuantityControlsProps} from "@/types/props";


export const CheckoutOrderItem = ({product, quantity, price, copy}: CheckoutOrderItemProps) => {
    const commonCopy = useSiteContent().common;

    return (
        <div className="flex items-center gap-3 rounded-[20px] bg-black/5 p-2 pr-3">
            <CheckoutItemThumbnail product={product} />
            <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold leading-5">{product.title}</p>
                {typeof price === "number" && (
                    <p className="text-[11px] text-[var(--text-secondary)]">
                        {quantity} {commonCopy.piecesShort} {copy.itemTotalJoin} <span className="font-semibold text-[var(--text-primary)]">{formatUah(price * quantity)}</span>
                    </p>
                )}
            </div>
            <CheckoutQuantityControls productId={product.id} quantity={quantity} copy={copy} />
        </div>
    );
};

const CheckoutItemThumbnail = ({product}: CheckoutItemThumbnailProps) => {
    const imageUrl = product.imageUrls?.[0] ?? product.imageUrl;

    return (
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
    );
};

const CheckoutQuantityControls = ({productId, quantity, copy}: CheckoutQuantityControlsProps) => (
    <div className="flex shrink-0 items-center gap-1">
        <div className="liquid-control flex items-center overflow-hidden rounded-[8px]" style={{width: 'fit-content'}}>
            <button
                type="button"
                onClick={() => updateCartQuantity(productId, quantity - 1)}
                className="flex items-center justify-center text-[var(--text-primary)] transition-opacity active:opacity-50"
                style={{width: '20px', height: '24px'}}
                aria-label={copy.controls.decrease}
            >
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14"/></svg>
            </button>
            <span className="text-center text-[11px] font-semibold" style={{width: '16px'}}>{quantity}</span>
            <button
                type="button"
                onClick={() => updateCartQuantity(productId, quantity + 1)}
                className="flex items-center justify-center text-[var(--text-primary)] transition-opacity active:opacity-50"
                style={{width: '20px', height: '24px'}}
                aria-label={copy.controls.increase}
            >
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            </button>
        </div>
        <button
            type="button"
            onClick={() => removeProductFromCart(productId)}
            className="flex items-center justify-center rounded-[8px] text-[var(--destructive)] transition-all active:opacity-50"
            style={{width: '20px', height: '24px'}}
            aria-label={copy.controls.remove}
        >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
        </button>
    </div>
);
