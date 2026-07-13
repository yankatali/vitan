"use client";

import Image from "next/image";
import {createPortal} from "react-dom";
import {useRef, useState, useEffect, type ReactNode} from "react";
import {useRouter, usePathname, useSearchParams} from "next/navigation";
import {ImagePlaceholder} from "@/app/components/ImagePlaceholder/ImagePlaceholder";
import {CloseIcon} from "@/app/components/icon/CloseIcon";
import {PRODUCT_CARD_CLASS_NAMES} from "@/constants/productCard";
import {useLockScroll} from "@/hooks/useLockScroll";
import type {ItemConfig} from "@/types/item";

const formatUah = (value: number) => {
    const formatted = new Intl.NumberFormat("uk-UA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
    return `${formatted} ₴`;
};

interface ProductCardSimpleProps {
    item: ItemConfig;
    priceUah: number | null;
    priceUahWholesale: number | null;
    wholesaleDescription?: string;
    overlayButton?: ReactNode;
    cartAction?: ReactNode;
    bottomActions?: ReactNode;
    className?: string;
}

export const ProductCardSimple = ({
    item,
    priceUah,
    priceUahWholesale,
    wholesaleDescription,
    overlayButton,
    cartAction,
    bottomActions,
    className,
}: ProductCardSimpleProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const imageScrollerRef = useRef<HTMLDivElement | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useLockScroll(isDetailOpen);

    useEffect(() => {
        if (searchParams.get("product") === item.id) {
            setIsDetailOpen(true);
        }
    }, [searchParams, item.id]);

    const handleOpen = () => {
        setIsDetailOpen(true);
        router.push(`${pathname}?product=${item.id}`, {scroll: false});
    };

    const handleClose = () => {
        setIsDetailOpen(false);
        router.push(pathname, {scroll: false});
    };

    const productImages = item.imageUrls?.length ? item.imageUrls : item.imageUrl ? [item.imageUrl] : [];

    const handleImageScroll = () => {
        const node = imageScrollerRef.current;
        if (!node || node.clientWidth === 0) return;
        setActiveImageIndex(Math.round(node.scrollLeft / node.clientWidth));
    };

    const handleDotClick = (index: number) => {
        const node = imageScrollerRef.current;
        if (!node) return;
        node.scrollTo({left: node.clientWidth * index, behavior: "smooth"});
        setActiveImageIndex(index);
    };

    const categories = item.category ? item.category.split(",").map(c => c.trim()).filter(Boolean) : [];

    return (
        <>
            <article
                className={`${PRODUCT_CARD_CLASS_NAMES.article}${className ? ` ${className}` : ""}`}
                onClick={handleOpen}
                role="button"
                tabIndex={0}
            >
                <div className={PRODUCT_CARD_CLASS_NAMES.imageWrapper}>
                    {productImages.length > 0 ? (
                        <>
                            <div
                                ref={imageScrollerRef}
                                className={PRODUCT_CARD_CLASS_NAMES.imageScroller}
                                onScroll={handleImageScroll}
                            >
                                {productImages.map((productImage, index) => (
                                    <div
                                        key={`${productImage}-${index}`}
                                        className={PRODUCT_CARD_CLASS_NAMES.imageButton}
                                    >
                                        <Image
                                            src={productImage}
                                            alt={item.imageAlt ?? item.title}
                                            width={560}
                                            height={420}
                                            className={PRODUCT_CARD_CLASS_NAMES.image}
                                        />
                                    </div>
                                ))}
                            </div>
                            {productImages.length > 1 && (
                                <div
                                    className={PRODUCT_CARD_CLASS_NAMES.imageDots}
                                    aria-label="Фото товару"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {productImages.map((_, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            className={activeImageIndex === index ? PRODUCT_CARD_CLASS_NAMES.activeImageDot : PRODUCT_CARD_CLASS_NAMES.imageDot}
                                            onClick={() => handleDotClick(index)}
                                            aria-label={`Показати фото ${index + 1}`}
                                            aria-current={activeImageIndex === index}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <ImagePlaceholder className={PRODUCT_CARD_CLASS_NAMES.imagePlaceholder} iconSize={48} />
                    )}
                    {overlayButton}
                </div>

                <div className={PRODUCT_CARD_CLASS_NAMES.content}>
                    <div className={PRODUCT_CARD_CLASS_NAMES.contentInfo}>
                        <h3 className={PRODUCT_CARD_CLASS_NAMES.title} title={item.title}>
                            {item.title}
                        </h3>
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                        <div className="flex items-end justify-between gap-2">
                            <div className="min-w-0">
                                {typeof priceUah === "number" && (
                                    <>
                                        <p className={PRODUCT_CARD_CLASS_NAMES.priceUsd}>
                                            {formatUah(priceUah)}
                                        </p>
                                        {typeof priceUahWholesale === "number" && (
                                            <p className="flex flex-wrap items-center gap-x-1 text-[12px] font-medium leading-4 text-[#0ba862]">
                                                <span className="whitespace-nowrap">{formatUah(priceUahWholesale)}</span>
                                                <span className="flex items-center gap-1 whitespace-nowrap">Опт{wholesaleDescription && (
                                                    <span className="inline-flex h-3.5 w-3.5 cursor-help items-center justify-center rounded-full bg-[#0ba862]/15 text-[9px] font-bold text-[#0ba862]" title={wholesaleDescription}>?</span>
                                                )}</span>
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                            {cartAction && <div className="shrink-0" onClick={(e) => e.stopPropagation()}>{cartAction}</div>}
                        </div>
                        {bottomActions && (
                            <div onClick={(e) => e.stopPropagation()}>
                                {bottomActions}
                            </div>
                        )}
                    </div>
                </div>
            </article>

            {isDetailOpen && typeof document !== "undefined" && createPortal(
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/28 px-2 backdrop-blur-md md:px-4"
                    onClick={() => handleClose()}
                >
                    <div
                        className="vitan-sheet-panel relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-[var(--radius-2xl)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="absolute right-5 top-5 z-20 inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-black/25 shadow-[0_1px_3px_rgba(0,0,0,0.15)] backdrop-blur-md text-white/90 transition-transform duration-200 active:scale-[0.9]"
                            onClick={() => handleClose()}
                        >
                            <CloseIcon />
                        </button>
                        <div className="flex-1 overflow-y-auto">
                            {productImages.length > 0 ? (
                                <div className="relative p-3 pb-0">
                                    <div className="flex w-full snap-x snap-mandatory overflow-x-auto rounded-[var(--radius-lg)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                        {productImages.map((img, i) => (
                                            <div
                                                key={`detail-${img}-${i}`}
                                                className="relative aspect-[4/3] w-full shrink-0 snap-center"
                                            >
                                                <Image src={img} alt={`${item.title} ${i + 1}`} fill className="object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                    {productImages.length > 1 && (
                                        <div className={PRODUCT_CARD_CLASS_NAMES.imageDots}>
                                            {productImages.map((_, i) => (
                                                <span key={i} className={i === 0 ? PRODUCT_CARD_CLASS_NAMES.activeImageDot : PRODUCT_CARD_CLASS_NAMES.imageDot} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="relative p-3 pb-0">
                                    <ImagePlaceholder
                                        className="flex aspect-[4/3] w-full items-center justify-center rounded-[var(--radius-lg)] bg-[rgba(255,255,255,0.15)] text-[var(--text-tertiary)]"
                                        iconSize={48}
                                    />
                                </div>
                            )}

                            <div className="flex flex-col gap-3 p-5">
                                <h3 className="text-[20px] font-semibold leading-[25px] tracking-[-0.4px] text-[var(--text-primary)]">
                                    {item.title}
                                </h3>

                                {categories.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {categories.map(cat => (
                                            <span key={cat} className={PRODUCT_CARD_CLASS_NAMES.category}>{cat}</span>
                                        ))}
                                    </div>
                                )}

                                {item.description && (
                                    <p className="text-[15px] leading-[22px] text-[var(--text-secondary)]">
                                        {item.description}
                                    </p>
                                )}

                                {typeof priceUah === "number" && (
                                    <div className="mt-px">
                                        <p className={PRODUCT_CARD_CLASS_NAMES.priceUsd}>
                                            {formatUah(priceUah)}
                                        </p>
                                        {typeof priceUahWholesale === "number" && (
                                            <p className="flex flex-wrap items-center gap-x-1 text-[13px] font-medium text-[#0ba862]">
                                                <span className="whitespace-nowrap">{formatUah(priceUahWholesale)}</span>
                                                <span className="flex items-center gap-1 whitespace-nowrap">Опт{wholesaleDescription && (
                                                    <span className="inline-flex h-3.5 w-3.5 cursor-help items-center justify-center rounded-full bg-[#0ba862]/15 text-[9px] font-bold text-[#0ba862]" title={wholesaleDescription}>?</span>
                                                )}</span>
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};
