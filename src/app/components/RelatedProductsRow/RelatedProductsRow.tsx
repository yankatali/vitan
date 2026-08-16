import {type ReactNode, useMemo, useRef, useState, useCallback} from "react";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {RELATED_PRODUCTS_CLASS_NAMES, RELATED_PRODUCTS_SCROLL_STEP} from "@/constants/relatedProducts";
import {RelatedProductCard, RelatedProductsScrollButton} from "@/app/components/RelatedProductsRow/RelatedProductsRowParts";
import {getRelatedProductPriceEntry} from "@/lib/relatedProductsRow";
import type {ItemConfig} from "@/types/item";
import type {RelatedProductsRowProps} from "@/types/props";


export const RelatedProductsRow = ({
    title,
    products,
    onAction,
    isActive,
    actionIcon,
    activeActionIcon,
}: RelatedProductsRowProps) => {
    const copy = useSiteContent().relatedProducts;
    const sectionTitle = title ?? copy.title;
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const priceMap = useMemo(() => {
        const entries = products.map(getRelatedProductPriceEntry);
        return new Map(entries);
    }, [products]);

    const updateArrows = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }, []);

    const scroll = (dir: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({
            left: dir === "right" ? RELATED_PRODUCTS_SCROLL_STEP : -RELATED_PRODUCTS_SCROLL_STEP,
            behavior: "smooth",
        });
    };

    const scrollLeft = () => scroll("left");
    const scrollRight = () => scroll("right");

    if (!products.length) return null;

    return (
        <section className={RELATED_PRODUCTS_CLASS_NAMES.section}>
            <p className={RELATED_PRODUCTS_CLASS_NAMES.title}>{sectionTitle}</p>
            <div className={RELATED_PRODUCTS_CLASS_NAMES.viewportWrapper}>
                <div
                    ref={scrollRef}
                    onScroll={updateArrows}
                    className={RELATED_PRODUCTS_CLASS_NAMES.scroller}
                >
                    {products.map(product => (
                        <RelatedProductCard
                            key={product.id}
                            product={product}
                            prices={priceMap.get(product.id)}
                            active={isActive(product.id)}
                            actionIcon={actionIcon}
                            activeActionIcon={activeActionIcon}
                            onAction={onAction}
                            copy={copy}
                        />
                    ))}
                </div>

                {canScrollLeft && (
                    <RelatedProductsScrollButton direction="left" onClick={scrollLeft} copy={copy} />
                )}
                {canScrollRight && (
                    <RelatedProductsScrollButton direction="right" onClick={scrollRight} copy={copy} />
                )}
            </div>
        </section>
    );
};
