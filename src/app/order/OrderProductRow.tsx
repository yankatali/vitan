"use client";

import Image from "next/image";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {formatUah} from "@/lib/formatters";
import type {ItemConfig} from "@/types/item";

interface OrderProductRowProps {
    product: ItemConfig;
    quantity: number;
}

interface OrderProductThumbnailProps {
    product: ItemConfig;
}

const OrderProductThumbnail = ({product}: OrderProductThumbnailProps) => {
    const imageUrl = product.imageUrls?.[0] ?? product.imageUrl;

    return (
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[12px] bg-black/5">
            {imageUrl ? (
                <Image src={imageUrl} alt={product.imageAlt ?? product.title} fill className="object-cover" />
            ) : (
                <div className="flex h-full w-full items-center justify-center text-[var(--text-tertiary)]">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m3 9 4-4 4 4 4-4 4 4"/></svg>
                </div>
            )}
        </div>
    );
};

export const OrderProductRow = ({product, quantity}: OrderProductRowProps) => {
    const price = product.priceUah;
    const copy = useSiteContent().common;

    return (
        <div className="flex items-center gap-3 rounded-[16px] bg-black/5 p-2 pr-3">
            <OrderProductThumbnail product={product} />
            <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold leading-5">{product.title}</p>
                <p className="text-[12px] text-[var(--text-secondary)]">{quantity} {copy.piecesShort}</p>
            </div>
            {typeof price === "number" && (
                <p className="shrink-0 text-[14px] font-bold">{formatUah(price * quantity)}</p>
            )}
        </div>
    );
};
