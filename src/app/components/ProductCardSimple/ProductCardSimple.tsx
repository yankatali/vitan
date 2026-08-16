import {createPortal} from "react-dom";
import {useRef, useState, useEffect, type ReactNode} from "react";
import {useRouter, usePathname, useSearchParams} from "next/navigation";
import {ImagePlaceholder} from "@/app/components/ImagePlaceholder/ImagePlaceholder";
import {CloseIcon} from "@/app/components/icon/CloseIcon";
import {ProductPriceBlock} from "@/app/components/ProductPriceBlock/ProductPriceBlock";
import {ProductCategoryPills, ProductDetailImages, ProductImageCarousel} from "@/app/components/ProductCardSimple/ProductCardSimpleParts";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {PRODUCT_CARD_CLASS_NAMES} from "@/constants/productCard";
import {useLockScroll} from "@/hooks/useLockScroll";
import {getProductImageUrls} from "@/lib/productImages";
import {splitProductCategories} from "@/lib/productCategories";
import type {ItemConfig} from "@/types/item";

interface ProductCardSimpleProps {
    item: ItemConfig;
    priceUah: number | null;
    priceUahWholesale: number | null;
    wholesaleDescription?: string;
    wholesaleActiveDescription?: string;
    wholesaleAsPrimary?: boolean;
    overlayButton?: ReactNode;
    cartAction?: ReactNode;
    bottomActions?: ReactNode;
    modalAction?: ReactNode;
    className?: string;
}

export const ProductCardSimple = ({
    item,
    priceUah,
    priceUahWholesale,
    wholesaleDescription,
    wholesaleActiveDescription,
    wholesaleAsPrimary = false,
    overlayButton,
    cartAction,
    bottomActions,
    modalAction,
    className,
}: ProductCardSimpleProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const imageScrollerRef = useRef<HTMLDivElement | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const commonCopy = useSiteContent().common;

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

    const productImages = getProductImageUrls(item.imageUrl, item.imageUrls);
    const shouldShowWholesaleAsPrimary = wholesaleAsPrimary && typeof priceUahWholesale === "number";
    const primaryPriceUah = shouldShowWholesaleAsPrimary ? priceUahWholesale : priceUah;
    const showCartActionInDetailPrice = Boolean(cartAction && !modalAction && typeof primaryPriceUah === "number");
    const priceBlock = (
        <ProductPriceBlock
            priceUah={priceUah}
            priceUahWholesale={priceUahWholesale}
            wholesaleActiveDescription={wholesaleActiveDescription}
            wholesaleAsPrimary={wholesaleAsPrimary}
            wholesaleDescription={wholesaleDescription}
        />
    );

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

    const categories = splitProductCategories(item.category);

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
                        <ProductImageCarousel
                            productImages={productImages}
                            alt={item.imageAlt ?? item.title}
                            activeImageIndex={activeImageIndex}
                            imageScrollerRef={imageScrollerRef}
                            onImageScroll={handleImageScroll}
                            onDotClick={handleDotClick}
                            commonCopy={commonCopy}
                        />
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
                                {priceBlock}
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
                            <ProductDetailImages productImages={productImages} title={item.title} />

                            <div className="flex flex-col gap-3 p-5">
                                <h3 className="text-[20px] font-semibold leading-[25px] tracking-[-0.4px] text-[var(--text-primary)]">
                                    {item.title}
                                </h3>

                                <ProductCategoryPills categories={categories} />

                                {item.description && (
                                    <p className="text-[15px] leading-[22px] text-[var(--text-secondary)]">
                                        {item.description}
                                    </p>
                                )}

                                {typeof primaryPriceUah === "number" && (
                                    <div className="mt-px flex items-end justify-between gap-3">
                                        <div className="min-w-0">
                                            {priceBlock}
                                        </div>
                                        {showCartActionInDetailPrice && (
                                            <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                                                {cartAction}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {(modalAction || bottomActions || (cartAction && !showCartActionInDetailPrice)) && (
                                    <div className="mt-2 flex flex-col gap-2">
                                        {modalAction ?? (!showCartActionInDetailPrice ? cartAction : null)}
                                        {bottomActions}
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
