import {useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {CloseIcon} from "@/app/components/icon/CloseIcon";
import {ProductCardActions} from "@/app/components/ProductCardActions/ProductCardActions";
import {ImagePlaceholder} from "@/app/components/ImagePlaceholder/ImagePlaceholder";
import {ProductPriceBlock} from "@/app/components/ProductPriceBlock/ProductPriceBlock";
import {FavoriteButton, ItemCategoryPills, ItemDetailImages, ItemImageCarousel} from "@/app/ItemComponent/ItemComponentParts";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {PRODUCT_CARD_CLASS_NAMES} from "@/constants/productCard";
import {WISHLIST_STORAGE_KEY} from "@/constants/wishlist";
import {isProductInWishlist, toggleWishlistProduct} from "@/lib/wishlistStorage";
import {SAVED_PRODUCTS_CHANGE_EVENT} from "@/lib/savedProductsEvents";
import {getProductImageUrls} from "@/lib/productImages";
import {formatUah, formatUsd} from "@/lib/formatters";
import {useLockScroll} from "@/hooks/useLockScroll";
import type {ItemComponentProps} from "@/types/item";

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
    const productImages = getProductImageUrls(image, images);
    const handleProductChanged = onProductDeleted ?? (() => undefined);
    const productId = item?.id;
    const siteContent = useSiteContent();
    const commonCopy = siteContent.common;
    const productFormCopy = siteContent.productForm;

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
                    <ItemImageCarousel
                        productImages={productImages}
                        alt={title}
                        activeImageIndex={activeImageIndex}
                        imageScrollerRef={imageScrollerRef}
                        onImageScroll={handleImageScroll}
                        onDotClick={handleDotClick}
                        commonCopy={commonCopy}
                    />
                ) : (
                    <ImagePlaceholder className={PRODUCT_CARD_CLASS_NAMES.imagePlaceholder} iconSize={48} />
                )}
                {showProductActions && item && (
                    <FavoriteButton
                        isFavorite={isFavorite}
                        onToggle={handleFavoriteToggle}
                        variant="overlay"
                    />
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
                            <ItemDetailImages
                                productImages={productImages}
                                title={title}
                                showFavorite={showProductActions && Boolean(item)}
                                isFavorite={isFavorite}
                                onFavoriteToggle={handleFavoriteToggle}
                            />

                            <div className="flex flex-col gap-2 p-3">
                                <h3 className="text-[20px] font-semibold leading-[25px] tracking-[-0.4px] text-[var(--text-primary)]">
                                    {title}
                                </h3>

                                <ItemCategoryPills category={category} />

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
                                                        <p>{productFormCopy.fields.adminPurchasePriceUah}: {formatUah(purchasePriceUah)}</p>
                                                    )}
                                                    {typeof priceUsd === "number" && (
                                                        <p>{productFormCopy.fields.adminPurchasePriceUsd}: {formatUsd(priceUsd)}</p>
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
