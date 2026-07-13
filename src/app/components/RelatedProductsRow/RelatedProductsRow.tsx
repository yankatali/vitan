"use client";

import {type ReactNode, useMemo} from "react";
import {ProductCardSimple} from "@/app/components/ProductCardSimple/ProductCardSimple";
import {PRODUCT_CARD_CLASS_NAMES} from "@/constants/productCard";
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

    if (!products.length) return null;

    return (
        <section>
            <p className="mb-2 px-0.5 text-[13px] font-semibold text-[var(--text-primary)]">{title}</p>
            <div
                className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                style={{marginLeft: "-16px", marginRight: "-16px", paddingLeft: "16px", paddingRight: "16px"}}
            >
                {products.map(product => {
                    const prices = priceMap.get(product.id);
                    const active = isActive(product.id);

                    return (
                        <div key={product.id} style={{width: "140px", flexShrink: 0}}>
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
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
