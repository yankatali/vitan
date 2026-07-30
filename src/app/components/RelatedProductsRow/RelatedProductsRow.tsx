"use client";

import {type ReactNode, useMemo, useRef, useState, useCallback} from "react";
import {ProductCardSimple} from "@/app/components/ProductCardSimple/ProductCardSimple";
import {PRODUCT_CARD_CLASS_NAMES} from "@/constants/productCard";
import {PRODUCT_CARD_ACTION_CLASS_NAMES} from "@/constants/productCardActions";
import type {ItemConfig} from "@/types/item";
import type {PricingConfig} from "@/types/pricingConfig";

export const getCategoriesFromProducts = (products: ItemConfig[]): Set<string> => {
    const cats = new Set<string>();
    products.forEach(p => {
        if (p.category) {
            p.category.split(",").map(c => c.trim()).filter(Boolean).forEach(c => cats.add(c));
        }
    });
    return cats;
};

export const getRelatedProducts = (
    excludeIds: Set<string>,
    targetCategories: Set<string>,
    allProducts: ItemConfig[],
    max = 20
): ItemConfig[] => {
    const candidates = allProducts.filter(p => !excludeIds.has(p.id));
    if (!targetCategories.size) return candidates.slice(0, max);

    const matching: ItemConfig[] = [];
    const others: ItemConfig[] = [];
    for (const p of candidates) {
        const cats = p.category ? p.category.split(",").map(c => c.trim()) : [];
        if (cats.some(c => targetCategories.has(c))) {
            matching.push(p);
        } else {
            others.push(p);
        }
    }
    return [...matching, ...others].slice(0, max);
};

interface RelatedProductsRowProps {
    title?: string;
    products: ItemConfig[];
    pricingConfig?: PricingConfig | null;
    onAction: (productId: string) => void;
    isActive: (productId: string) => boolean;
    actionIcon: ReactNode;
    activeActionIcon: ReactNode;
}

export const RelatedProductsRow = ({
    title = "Схожі товари",
    products,
    pricingConfig,
    onAction,
    isActive,
    actionIcon,
    activeActionIcon,
}: RelatedProductsRowProps) => {
    const usdToUahRate = pricingConfig?.usdToUahRate ?? null;
    const retailMarkup = pricingConfig?.retailMarkup ?? 30;
    const wholesaleMarkup = pricingConfig?.wholesaleMarkup ?? 15;
    const wholesaleDescription = pricingConfig?.wholesaleDescription ?? "";

    const priceMap = useMemo(() => {
        const entries: [string, {retail: number | null; wholesale: number | null}][] = products.map(p => {
            if (!usdToUahRate || typeof p.priceUsd !== "number") {
                return [p.id, {retail: null, wholesale: null}];
            }
            return [p.id, {
                retail: Number((p.priceUsd * (1 + retailMarkup / 100) * usdToUahRate).toFixed(2)),
                wholesale: Number((p.priceUsd * (1 + wholesaleMarkup / 100) * usdToUahRate).toFixed(2)),
            }];
        });
        return new Map(entries);
    }, [products, usdToUahRate, retailMarkup, wholesaleMarkup]);

    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [canScrollLeft, setCanScrollLeft] = useState(false);

    const updateArrows = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }, []);

    const scroll = (dir: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({left: dir === "right" ? 300 : -300, behavior: "smooth"});
    };

    if (!products.length) return null;

    return (
        <section className="min-w-0">
            <p className="mb-2 px-0.5 text-[13px] font-semibold text-[var(--text-primary)]">{title}</p>
            <div className="relative min-w-0">
                <div
                    ref={scrollRef}
                    onScroll={updateArrows}
                    className="flex gap-2 pb-1 [-ms-overflow-style:none] [overscroll-behavior-x:contain] [overflow-x:auto] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {products.map(product => {
                        const prices = priceMap.get(product.id);
                        const active = isActive(product.id);

                        return (
                            <div key={product.id} className="shrink-0" style={{width: "140px"}}>
                                <ProductCardSimple
                                    item={product}
                                    priceUah={prices?.retail ?? null}
                                    priceUahWholesale={prices?.wholesale ?? null}
                                    wholesaleDescription={wholesaleDescription}
                                    overlayButton={
                                        <button
                                            type="button"
                                            onClick={e => {
                                                e.stopPropagation();
                                                onAction(product.id);
                                            }}
                                            className={active
                                                ? PRODUCT_CARD_CLASS_NAMES.favoriteOverlayActive
                                                : PRODUCT_CARD_CLASS_NAMES.favoriteOverlay}
                                            aria-pressed={active}
                                            aria-label={active ? "Вже додано" : "Додати"}
                                        >
                                            {active ? activeActionIcon : actionIcon}
                                        </button>
                                    }
                                    modalAction={
                                        <button
                                            type="button"
                                            onClick={e => {
                                                e.stopPropagation();
                                                onAction(product.id);
                                            }}
                                            className={active
                                                ? PRODUCT_CARD_ACTION_CLASS_NAMES.activeCartButton
                                                : PRODUCT_CARD_ACTION_CLASS_NAMES.cartButton}
                                            aria-pressed={active}
                                            aria-label={active ? "Вже додано" : "Додати"}
                                        >
                                            {active ? activeActionIcon : actionIcon}
                                        </button>
                                    }
                                />
                            </div>
                        );
                    })}
                </div>

                {canScrollLeft && (
                    <button
                        type="button"
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 shadow-[0_2px_8px_rgba(0,0,0,0.14)] backdrop-blur-md transition-opacity active:opacity-70"
                        aria-label="Прокрутити вліво"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                )}
                {canScrollRight && (
                    <button
                        type="button"
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 shadow-[0_2px_8px_rgba(0,0,0,0.14)] backdrop-blur-md transition-opacity active:opacity-70"
                        aria-label="Прокрутити вправо"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                )}
            </div>
        </section>
    );
};
