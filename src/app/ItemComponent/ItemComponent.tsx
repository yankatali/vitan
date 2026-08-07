"use client";

import {useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import Image from "next/image";
import WishlistIcon from "@/app/components/icon/WishlistIcon";
import {CloseIcon} from "@/app/components/icon/CloseIcon";
import {ProductCardActions} from "@/app/components/ProductCardActions/ProductCardActions";
import {ImagePlaceholder} from "@/app/components/ImagePlaceholder/ImagePlaceholder";
import {PriceTooltip} from "@/app/components/PriceTooltip/PriceTooltip";
import {PRODUCT_CARD_CLASS_NAMES} from "@/constants/productCard";
import {PRODUCT_CARD_ACTION_LABELS} from "@/constants/productCardActions";
import {isProductInWishlist, toggleWishlistProduct, WISHLIST_STORAGE_KEY} from "@/lib/wishlistStorage";
import {SAVED_PRODUCTS_CHANGE_EVENT} from "@/lib/savedProductsEvents";
import {useLockScroll} from "@/hooks/useLockScroll";
import type {ItemComponentProps} from "@/types/item";

const usdFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const uahFormatter = new Intl.NumberFormat("uk-UA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const formatUah = (value: number) => `${uahFormatter.format(value)} ₴`;

interface ProductPriceBlockProps {
    priceUah?: number | null;
    priceUahWholesale?: number | null;
    priceUsd?: number;
    wholesaleActiveDescription?: string;
    wholesaleAsPrimary?: boolean;
    wholesaleDescription?: string;
}

const ProductPriceBlock = ({
    priceUah,
    priceUahWholesale,
    priceUsd,
    wholesaleActiveDescription,
    wholesaleAsPrimary = false,
    wholesaleDescription,
}: ProductPriceBlockProps) => {
    const shouldShowWholesaleAsPrimary = wholesaleAsPrimary && typeof priceUahWholesale === "number";
    const primaryPriceUah = shouldShowWholesaleAsPrimary ? priceUahWholesale : priceUah;
    const wholesaleTooltipText = shouldShowWholesaleAsPrimary
        ? wholesaleActiveDescription ?? wholesaleDescription
        : wholesaleDescription;

    if (typeof primaryPriceUah === "number") {
        return (
            <>
                {shouldShowWholesaleAsPrimary ? (
                    <div className="flex flex-wrap items-center gap-x-1 text-[#0ba862]">
                        <p className={`${PRODUCT_CARD_CLASS_NAMES.priceUsd} !text-[#0ba862]`}>
                            {formatUah(primaryPriceUah)}
                        </p>
                        <span className="flex items-center gap-1 whitespace-nowrap text-[12px] font-medium leading-4">
                            Опт
                            <PriceTooltip text={wholesaleTooltipText} />
                        </span>
                    </div>
                ) : (
                    <p className={PRODUCT_CARD_CLASS_NAMES.priceUsd}>
                        {formatUah(primaryPriceUah)}
                    </p>
                )}

                {shouldShowWholesaleAsPrimary && typeof priceUah === "number" && (
                    <p className="text-[12px] font-semibold leading-4 text-[var(--destructive)] line-through">
                        {formatUah(priceUah)}
                    </p>
                )}

                {!shouldShowWholesaleAsPrimary && typeof priceUahWholesale === "number" && (
                    <p className="flex flex-wrap items-center gap-x-1 text-[12px] font-medium leading-4 text-[#0ba862]">
                        <span className="whitespace-nowrap">{formatUah(priceUahWholesale)}</span>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                            Опт
                            <PriceTooltip text={wholesaleTooltipText} />
                        </span>
                    </p>
                )}
            </>
        );
    }

    if (typeof priceUsd === "number") {
        return (
            <p className={PRODUCT_CARD_CLASS_NAMES.priceUsd}>
                {usdFormatter.format(priceUsd)}
            </p>
        );
    }

    return null;
};

export const ItemComponent = ({
    category,
    categoryOptions = [],
    description,
    image,
    images,
    item,
    onProductDeleted,
    pricingConfig,
    purchasePriceUah,
    priceUah,
    priceUahWholesale,
    priceUsd,
    showAdminActions = false,
    showProductActions = true,
    title,
    wholesaleActiveDescription,
    wholesaleAsPrimary = false,
    wholesaleDescription,
}: ItemComponentProps) => {
    const imageScrollerRef = useRef<HTMLDivElement | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const productImages = images?.length ? images : image ? [image] : [];
    const handleProductChanged = onProductDeleted ?? (() => undefined);
    const productId = item?.id;

    useLockScroll(isDetailOpen);

    useEffect(() => {
        if (!productId) return;

        const sync = () => setIsFavorite(isProductInWishlist(productId));
        const handleStorage = (event: StorageEvent) => {
            if (event.key === WISHLIST_STORAGE_KEY) sync();
        };

        sync();
        window.addEventListener(SAVED_PRODUCTS_CHANGE_EVENT, sync);
        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener(SAVED_PRODUCTS_CHANGE_EVENT, sync);
            window.removeEventListener("storage", handleStorage);
        };
    }, [productId]);

    const handleFavoriteToggle = () => {
        if (!productId) return;
        setIsFavorite(toggleWishlistProduct(productId));
    };

    const handleImageScroll = () => {
        const node = imageScrollerRef.current;
        if (!node || node.clientWidth === 0) return;

        setActiveImageIndex(Math.round(node.scrollLeft / node.clientWidth));
    };

    const handleDotClick = (index: number) => {
        const node = imageScrollerRef.current;
        if (!node) return;

        node.scrollTo({
            left: node.clientWidth * index,
            behavior: "smooth",
        });
        setActiveImageIndex(index);
    };

    const priceBlock = (
        <ProductPriceBlock
            priceUah={priceUah}
            priceUahWholesale={priceUahWholesale}
            priceUsd={priceUsd}
            wholesaleActiveDescription={wholesaleActiveDescription}
            wholesaleAsPrimary={wholesaleAsPrimary}
            wholesaleDescription={wholesaleDescription}
        />
    );

    return (
        <article className={PRODUCT_CARD_CLASS_NAMES.article} onClick={() => setIsDetailOpen(true)} role="button" tabIndex={0}>
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
                                        alt={title}
                                        width={560}
                                        height={420}
                                        className={PRODUCT_CARD_CLASS_NAMES.image}
                                    />
                                </div>
                            ))}
                        </div>
                        {productImages.length > 1 && (
                            <div className={PRODUCT_CARD_CLASS_NAMES.imageDots} aria-label="Фото товару" onClick={(e) => e.stopPropagation()}>
                                {productImages.map((productImage, index) => (
                                    <button
                                        key={`dot-${productImage}-${index}`}
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
                {showProductActions && item && (
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleFavoriteToggle(); }}
                        className={isFavorite ? PRODUCT_CARD_CLASS_NAMES.favoriteOverlayActive : PRODUCT_CARD_CLASS_NAMES.favoriteOverlay}
                        aria-label={isFavorite ? PRODUCT_CARD_ACTION_LABELS.favoriteActive : PRODUCT_CARD_ACTION_LABELS.favorite}
                        aria-pressed={isFavorite}
                    >
                        <WishlistIcon size={18} filled={isFavorite} />
                    </button>
                )}
            </div>

            <div className={PRODUCT_CARD_CLASS_NAMES.content}>
                <div className={PRODUCT_CARD_CLASS_NAMES.contentInfo}>
                    <h3 className={PRODUCT_CARD_CLASS_NAMES.title} title={title}>
                        {title}
                    </h3>
                </div>
                <div className={PRODUCT_CARD_CLASS_NAMES.footer}>
                    <div className="flex items-end justify-between gap-2">
                        <div className="min-w-0">{priceBlock}</div>
                        {showProductActions && item && (
                            <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                                <ProductCardActions
                                    categoryOptions={categoryOptions}
                                    product={item}
                                    pricingConfig={pricingConfig}
                                    showAdminActions={false}
                                    onProductChanged={handleProductChanged}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isDetailOpen && typeof document !== "undefined" && createPortal(
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/28 px-2 backdrop-blur-md md:px-4"
                    onClick={(e) => { e.stopPropagation(); setIsDetailOpen(false); }}
                >
                    <div
                        className="vitan-sheet-panel relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-[var(--radius-2xl)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="absolute right-5 top-5 z-20 inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-black/25 shadow-[0_1px_3px_rgba(0,0,0,0.15)] backdrop-blur-md text-white/90 transition-transform duration-200 active:scale-[0.9]"
                            onClick={() => setIsDetailOpen(false)}
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
                                                <Image src={img} alt={`${title} ${i + 1}`} fill className="object-cover" />
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
                                    {showProductActions && item && (
                                        <button
                                            type="button"
                                            onClick={handleFavoriteToggle}
                                            className={`absolute bottom-2 right-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-black/25 shadow-[0_1px_3px_rgba(0,0,0,0.15)] backdrop-blur-md transition-transform duration-200 active:scale-[0.9] ${isFavorite ? "text-[var(--favorite)]" : "text-white/90"}`}
                                        >
                                            <WishlistIcon size={18} filled={isFavorite} />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="relative p-3 pb-0">
                                    <ImagePlaceholder
                                        className="flex aspect-[4/3] w-full items-center justify-center rounded-[var(--radius-lg)] bg-[rgba(255,255,255,0.15)] text-[var(--text-tertiary)]"
                                        iconSize={48}
                                    />
                                    {showProductActions && item && (
                                        <button
                                            type="button"
                                            onClick={handleFavoriteToggle}
                                            className={`absolute bottom-5 right-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-black/25 shadow-[0_1px_3px_rgba(0,0,0,0.15)] backdrop-blur-md transition-transform duration-200 active:scale-[0.9] ${isFavorite ? "text-[var(--favorite)]" : "text-white/90"}`}
                                        >
                                            <WishlistIcon size={18} filled={isFavorite} />
                                        </button>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-col gap-2 p-3">
                                <h3 className="text-[20px] font-semibold leading-[25px] tracking-[-0.4px] text-[var(--text-primary)]">
                                    {title}
                                </h3>

                                {category && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {category.split(",").map(cat => (
                                            <span key={cat.trim()} className={PRODUCT_CARD_CLASS_NAMES.category}>{cat.trim()}</span>
                                        ))}
                                    </div>
                                )}

                                {description && (
                                    <p className="text-[15px] leading-[22px] text-[var(--text-secondary)]">
                                        {description}
                                    </p>
                                )}

                                <div className="mt-px flex flex-col gap-2">
                                    <div className="flex items-end justify-between gap-2">
                                        <div className="min-w-0">{priceBlock}</div>
                                        {showProductActions && item && (
                                            <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                                                <ProductCardActions
                                                    categoryOptions={categoryOptions}
                                                    product={item}
                                                    pricingConfig={pricingConfig}
                                                    showAdminActions={false}
                                                    onProductChanged={handleProductChanged}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-between gap-2">
                                        <div className="min-w-0">
                                            {showAdminActions && (typeof purchasePriceUah === "number" || typeof priceUsd === "number") && (
                                                <div className="grid gap-0.5 text-[13px] font-medium text-[var(--text-secondary)]">
                                                    {typeof purchasePriceUah === "number" && (
                                                        <p>Закупка грн: {formatUah(purchasePriceUah)}</p>
                                                    )}
                                                    {typeof priceUsd === "number" && (
                                                        <p>Закупка USD: {usdFormatter.format(priceUsd)}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {showAdminActions && showProductActions && item && (
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <ProductCardActions
                                                    categoryOptions={categoryOptions}
                                                    product={item}
                                                    pricingConfig={pricingConfig}
                                                    showAdminActions
                                                    showCartButton={false}
                                                    onProductChanged={handleProductChanged}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </article>
    );
};
