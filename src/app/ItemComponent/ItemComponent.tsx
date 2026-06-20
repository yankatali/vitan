"use client";

import {useRef, useState} from "react";
import Image from "next/image";
import {ImagePreviewModal} from "@/app/components/ImagePreviewModal/ImagePreviewModal";
import {ProductCardActions} from "@/app/components/ProductCardActions/ProductCardActions";
import {PRODUCT_CARD_CLASS_NAMES} from "@/constants/productCard";
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
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(image);
    const productImages = images?.length ? images : image ? [image] : [];
    const handleProductChanged = onProductDeleted ?? (() => undefined);
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
            {productImages.length > 0 && (
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
                    <ImagePreviewModal
                        alt={title}
                        imageUrl={previewImage}
                        isOpen={isImagePreviewOpen}
                        onClose={() => setIsImagePreviewOpen(false)}
                    />
                </>
            )}

            <div className={PRODUCT_CARD_CLASS_NAMES.content}>
                <h3 className={PRODUCT_CARD_CLASS_NAMES.title}>
                    {title}
                </h3>

                {category && (
                    <p className={PRODUCT_CARD_CLASS_NAMES.category}>
                        {category}
                    </p>
                )}

                {description && (
                    <p className={PRODUCT_CARD_CLASS_NAMES.description}>
                        {description}
                    </p>
                )}
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
