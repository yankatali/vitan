import Image from "next/image";
import {type RefObject} from "react";
import {ImagePlaceholder} from "@/app/components/ImagePlaceholder/ImagePlaceholder";
import {PRODUCT_CARD_CLASS_NAMES} from "@/constants/productCard";
import type {SiteContent} from "@/constants/siteContent";

interface ProductCategoryPillsProps {
    categories: string[];
}

interface ProductImageCarouselProps {
    productImages: string[];
    alt: string;
    activeImageIndex: number;
    imageScrollerRef: RefObject<HTMLDivElement | null>;
    onImageScroll: () => void;
    onDotClick: (index: number) => void;
    commonCopy: SiteContent["common"];
}

interface ProductImageSlideProps {
    imageUrl: string;
    alt: string;
}

interface ProductImageDotsProps {
    count: number;
    activeImageIndex: number;
    onDotClick: (index: number) => void;
    commonCopy: SiteContent["common"];
}

interface ProductDetailImagesProps {
    productImages: string[];
    title: string;
}

interface ProductDetailImageSlideProps {
    imageUrl: string;
    index: number;
    title: string;
}

interface ProductDetailImageDotProps {
    active: boolean;
}

export const ProductImageCarousel = ({
    productImages,
    alt,
    activeImageIndex,
    imageScrollerRef,
    onImageScroll,
    onDotClick,
    commonCopy,
}: ProductImageCarouselProps) => (
    <>
        <div
            ref={imageScrollerRef}
            className={PRODUCT_CARD_CLASS_NAMES.imageScroller}
            onScroll={onImageScroll}
        >
            {productImages.map((productImage, index) => (
                <ProductImageSlide
                    key={`${productImage}-${index}`}
                    imageUrl={productImage}
                    alt={alt}
                />
            ))}
        </div>
        {productImages.length > 1 && (
            <ProductImageDots
                count={productImages.length}
                activeImageIndex={activeImageIndex}
                onDotClick={onDotClick}
                commonCopy={commonCopy}
            />
        )}
    </>
);

const ProductImageSlide = ({imageUrl, alt}: ProductImageSlideProps) => (
    <div className={PRODUCT_CARD_CLASS_NAMES.imageButton}>
        <Image
            src={imageUrl}
            alt={alt}
            width={560}
            height={420}
            className={PRODUCT_CARD_CLASS_NAMES.image}
        />
    </div>
);

const ProductImageDots = ({count, activeImageIndex, onDotClick, commonCopy}: ProductImageDotsProps) => (
    <div
        className={PRODUCT_CARD_CLASS_NAMES.imageDots}
        aria-label={commonCopy.photoGalleryAriaLabel}
        onClick={(event) => event.stopPropagation()}
    >
        {Array.from({length: count}, (_, index) => (
            <button
                key={index}
                type="button"
                className={activeImageIndex === index ? PRODUCT_CARD_CLASS_NAMES.activeImageDot : PRODUCT_CARD_CLASS_NAMES.imageDot}
                onClick={() => onDotClick(index)}
                aria-label={`${commonCopy.showPhotoAriaPrefix} ${index + 1}`}
                aria-current={activeImageIndex === index}
            />
        ))}
    </div>
);

export const ProductDetailImages = ({productImages, title}: ProductDetailImagesProps) => {
    if (!productImages.length) {
        return (
            <div className="relative p-3 pb-0">
                <ImagePlaceholder
                    className="flex aspect-[4/3] w-full items-center justify-center rounded-[var(--radius-lg)] bg-[rgba(255,255,255,0.15)] text-[var(--text-tertiary)]"
                    iconSize={48}
                />
            </div>
        );
    }

    return (
        <div className="relative p-3 pb-0">
            <div className="flex w-full snap-x snap-mandatory overflow-x-auto rounded-[var(--radius-lg)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {productImages.map((imageUrl, index) => (
                    <ProductDetailImageSlide
                        key={`detail-${imageUrl}-${index}`}
                        imageUrl={imageUrl}
                        index={index}
                        title={title}
                    />
                ))}
            </div>
            {productImages.length > 1 && (
                <div className={PRODUCT_CARD_CLASS_NAMES.imageDots}>
                    {productImages.map((_, index) => (
                        <ProductDetailImageDot key={index} active={index === 0} />
                    ))}
                </div>
            )}
        </div>
    );
};

const ProductDetailImageSlide = ({imageUrl, index, title}: ProductDetailImageSlideProps) => (
    <div className="relative aspect-[4/3] w-full shrink-0 snap-center">
        <Image src={imageUrl} alt={`${title} ${index + 1}`} fill className="object-cover" />
    </div>
);

const ProductDetailImageDot = ({active}: ProductDetailImageDotProps) => (
    <span className={active ? PRODUCT_CARD_CLASS_NAMES.activeImageDot : PRODUCT_CARD_CLASS_NAMES.imageDot} />
);

export const ProductCategoryPills = ({categories}: ProductCategoryPillsProps) => {
    if (!categories.length) return null;

    return (
        <div className="flex flex-wrap gap-1.5">
            {categories.map(category => (
                <span key={category} className={PRODUCT_CARD_CLASS_NAMES.category}>{category}</span>
            ))}
        </div>
    );
};
