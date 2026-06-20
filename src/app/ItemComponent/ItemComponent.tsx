"use client";

import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import WishlistIcon from "@/app/components/icon/WishlistIcon";
import {ImagePreviewModal} from "@/app/components/ImagePreviewModal/ImagePreviewModal";
import {ProductCardActions} from "@/app/components/ProductCardActions/ProductCardActions";
import {PRODUCT_CARD_CLASS_NAMES} from "@/constants/productCard";
import {PRODUCT_CARD_ACTION_LABELS} from "@/constants/productCardActions";
import {isProductInWishlist, toggleWishlistProduct, WISHLIST_STORAGE_KEY} from "@/lib/wishlistStorage";
import {SAVED_PRODUCTS_CHANGE_EVENT} from "@/lib/savedProductsEvents";
import type {ItemComponentProps} from "@/types/item";

const usdFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const uahFormatter = new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 2,
});

export const ItemComponent = ({
    category,
    categoryOptions = [],
    description,
    image,
    images,
    item,
    onProductDeleted,
    priceUah,
    priceUsd,
    showAdminActions = false,
    showProductActions = true,
    title,
}: ItemComponentProps) => {
    const imageScrollerRef = useRef<HTMLDivElement | null>(null);
    const descriptionRef = useRef<HTMLParagraphElement | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(image);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [isDescriptionClamped, setIsDescriptionClamped] = useState(false);
    const productImages = images?.length ? images : image ? [image] : [];
    const handleProductChanged = onProductDeleted ?? (() => undefined);
    const productId = item?.id;

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

    useEffect(() => {
        const node = descriptionRef.current;
        if (!node) return;

        setIsDescriptionClamped(node.scrollHeight > node.clientHeight);
    }, [description]);

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

    return (
        <article className={PRODUCT_CARD_CLASS_NAMES.article}>
            <div className={PRODUCT_CARD_CLASS_NAMES.imageWrapper}>
                {productImages.length > 0 ? (
                    <>
                        <div
                            ref={imageScrollerRef}
                            className={PRODUCT_CARD_CLASS_NAMES.imageScroller}
                            onScroll={handleImageScroll}
                        >
                            {productImages.map((productImage, index) => (
                                <button
                                    key={`${productImage}-${index}`}
                                    type="button"
                                    className={PRODUCT_CARD_CLASS_NAMES.imageButton}
                                    onClick={() => {
                                        setPreviewImage(productImage);
                                        setIsImagePreviewOpen(true);
                                    }}
                                    aria-label={`Відкрити збільшене зображення: ${title}`}
                                >
                                    <Image
                                        src={productImage}
                                        alt={title}
                                        width={560}
                                        height={420}
                                        className={PRODUCT_CARD_CLASS_NAMES.image}
                                    />
                                </button>
                            ))}
                        </div>
                        {productImages.length > 1 && (
                            <div className={PRODUCT_CARD_CLASS_NAMES.imageDots} aria-label="Фото товару">
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
                        {showProductActions && item && (
                            <button
                                type="button"
                                onClick={handleFavoriteToggle}
                                className={isFavorite ? PRODUCT_CARD_CLASS_NAMES.favoriteOverlayActive : PRODUCT_CARD_CLASS_NAMES.favoriteOverlay}
                                aria-label={isFavorite ? PRODUCT_CARD_ACTION_LABELS.favoriteActive : PRODUCT_CARD_ACTION_LABELS.favorite}
                                aria-pressed={isFavorite}
                            >
                                <WishlistIcon size={18} filled={isFavorite} />
                            </button>
                        )}
                        <ImagePreviewModal
                            alt={title}
                            imageUrl={previewImage}
                            isOpen={isImagePreviewOpen}
                            onClose={() => setIsImagePreviewOpen(false)}
                        />
                    </>
                ) : (
                    <div className={PRODUCT_CARD_CLASS_NAMES.imagePlaceholder}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="m21 15-5-5L5 21" />
                        </svg>
                    </div>
                )}
            </div>

            <div className={PRODUCT_CARD_CLASS_NAMES.content}>
                <div className={PRODUCT_CARD_CLASS_NAMES.contentInfo}>
                    <h3 className={PRODUCT_CARD_CLASS_NAMES.title}>
                        {title}
                    </h3>

                    <div className={PRODUCT_CARD_CLASS_NAMES.categoryRow}>
                        {category
                            ? category.split(",").map(cat => (
                                <span key={cat.trim()} className={PRODUCT_CARD_CLASS_NAMES.category}>{cat.trim()}</span>
                            ))
                            : <span className={PRODUCT_CARD_CLASS_NAMES.category}>{" "}</span>
                        }
                    </div>

                    <div className={PRODUCT_CARD_CLASS_NAMES.descriptionWrapper}>
                        <p
                            ref={descriptionRef}
                            className={isDescriptionExpanded ? PRODUCT_CARD_CLASS_NAMES.descriptionExpanded : PRODUCT_CARD_CLASS_NAMES.description}
                        >
                            {description ?? " "}
                        </p>
                        {description && (isDescriptionClamped || isDescriptionExpanded) && (
                            <button
                                type="button"
                                className={PRODUCT_CARD_CLASS_NAMES.descriptionToggle}
                                onClick={() => setIsDescriptionExpanded(current => !current)}
                            >
                                {isDescriptionExpanded ? "менше" : "більше"}
                            </button>
                        )}
                    </div>
                </div>
                <div className={PRODUCT_CARD_CLASS_NAMES.footer}>
                    {typeof priceUsd === "number" && (
                        <p className={PRODUCT_CARD_CLASS_NAMES.priceUsd}>
                            {usdFormatter.format(priceUsd)}
                        </p>
                    )}

                    {typeof priceUah === "number" && (
                        <p className={PRODUCT_CARD_CLASS_NAMES.priceUah}>
                            {uahFormatter.format(priceUah)}
                        </p>
                    )}

                    {showProductActions && item && (
                        <ProductCardActions
                            categoryOptions={categoryOptions}
                            product={item}
                            showAdminActions={showAdminActions}
                            onProductChanged={handleProductChanged}
                        />
                    )}
                </div>
            </div>
        </article>
    );
};
