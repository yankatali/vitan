import Image from "next/image";
import {type MouseEvent, type RefObject} from "react";
import WishlistIcon from "@/app/components/icon/WishlistIcon";
import {ImagePlaceholder} from "@/app/components/ImagePlaceholder/ImagePlaceholder";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {PRODUCT_CARD_CLASS_NAMES} from "@/constants/productCard";
import {splitProductCategories} from "@/lib/productCategories";
import type {SiteContent} from "@/constants/siteContent";
import type {FavoriteButtonProps, ItemCategoryPillsProps, ItemDetailImageDotProps, ItemDetailImageSlideProps, ItemDetailImagesProps, ItemImageCarouselProps, ItemImageDotsProps, ItemImageSlideProps} from "@/types/props";


export const FavoriteButton = ({isFavorite, onToggle, variant, className}: FavoriteButtonProps) => {
    const copy = useSiteContent().productActions;
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onToggle();
    };
    const overlayClassName = isFavorite ? PRODUCT_CARD_CLASS_NAMES.favoriteOverlayActive : PRODUCT_CARD_CLASS_NAMES.favoriteOverlay;
    const detailClassName = `absolute z-10 inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-black/25 shadow-[0_1px_3px_rgba(0,0,0,0.15)] backdrop-blur-md transition-transform duration-200 active:scale-[0.9] ${isFavorite ? "text-[var(--favorite)]" : "text-white/90"} ${className ?? ""}`;

    return (
        <button
            type="button"
            onClick={handleClick}
            className={variant === "overlay" ? overlayClassName : detailClassName}
            aria-label={isFavorite ? copy.favoriteActive : copy.favorite}
            aria-pressed={isFavorite}
        >
            <WishlistIcon size={18} filled={isFavorite} />
        </button>
    );
};

export const ItemImageCarousel = ({
    productImages,
    alt,
    activeImageIndex,
    imageScrollerRef,
    onImageScroll,
    onDotClick,
    commonCopy,
}: ItemImageCarouselProps) => (
    <>
        <div
            ref={imageScrollerRef}
            className={PRODUCT_CARD_CLASS_NAMES.imageScroller}
            onScroll={onImageScroll}
        >
            {productImages.map((productImage, index) => (
                <ItemImageSlide
                    key={`${productImage}-${index}`}
                    imageUrl={productImage}
                    alt={alt}
                />
            ))}
        </div>
        {productImages.length > 1 && (
            <ItemImageDots
                productImages={productImages}
                activeImageIndex={activeImageIndex}
                onDotClick={onDotClick}
                commonCopy={commonCopy}
            />
        )}
    </>
);

const ItemImageSlide = ({imageUrl, alt}: ItemImageSlideProps) => (
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

const ItemImageDots = ({productImages, activeImageIndex, onDotClick, commonCopy}: ItemImageDotsProps) => (
    <div className={PRODUCT_CARD_CLASS_NAMES.imageDots} aria-label={commonCopy.photoGalleryAriaLabel} onClick={(event) => event.stopPropagation()}>
        {productImages.map((productImage, index) => (
            <button
                key={`dot-${productImage}-${index}`}
                type="button"
                className={activeImageIndex === index ? PRODUCT_CARD_CLASS_NAMES.activeImageDot : PRODUCT_CARD_CLASS_NAMES.imageDot}
                onClick={() => onDotClick(index)}
                aria-label={`${commonCopy.showPhotoAriaPrefix} ${index + 1}`}
                aria-current={activeImageIndex === index}
            />
        ))}
    </div>
);

export const ItemDetailImages = ({
    productImages,
    title,
    showFavorite,
    isFavorite,
    onFavoriteToggle,
}: ItemDetailImagesProps) => {
    if (!productImages.length) {
        return (
            <div className="relative p-3 pb-0">
                <ImagePlaceholder
                    className="flex aspect-[4/3] w-full items-center justify-center rounded-[var(--radius-lg)] bg-[rgba(255,255,255,0.15)] text-[var(--text-tertiary)]"
                    iconSize={48}
                />
                {showFavorite && (
                    <FavoriteButton
                        isFavorite={isFavorite}
                        onToggle={onFavoriteToggle}
                        variant="detail"
                        className="bottom-5 right-5"
                    />
                )}
            </div>
        );
    }

    return (
        <div className="relative p-3 pb-0">
            <div className="flex w-full snap-x snap-mandatory overflow-x-auto rounded-[var(--radius-lg)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {productImages.map((imageUrl, index) => (
                    <ItemDetailImageSlide
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
                        <ItemDetailImageDot key={index} active={index === 0} />
                    ))}
                </div>
            )}
            {showFavorite && (
                <FavoriteButton
                    isFavorite={isFavorite}
                    onToggle={onFavoriteToggle}
                    variant="detail"
                    className="bottom-2 right-5"
                />
            )}
        </div>
    );
};

const ItemDetailImageSlide = ({imageUrl, index, title}: ItemDetailImageSlideProps) => (
    <div className="relative aspect-[4/3] w-full shrink-0 snap-center">
        <Image src={imageUrl} alt={`${title} ${index + 1}`} fill className="object-cover" />
    </div>
);

const ItemDetailImageDot = ({active}: ItemDetailImageDotProps) => (
    <span className={active ? PRODUCT_CARD_CLASS_NAMES.activeImageDot : PRODUCT_CARD_CLASS_NAMES.imageDot} />
);

export const ItemCategoryPills = ({category}: ItemCategoryPillsProps) => {
    if (!category) return null;

    return (
        <div className="flex flex-wrap gap-1.5">
            {splitProductCategories(category).map(categoryName => (
                <span key={categoryName} className={PRODUCT_CARD_CLASS_NAMES.category}>{categoryName}</span>
            ))}
        </div>
    );
};
