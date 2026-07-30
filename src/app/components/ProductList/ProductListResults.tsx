"use client";

import {ItemComponent} from "@/app/ItemComponent/ItemComponent";
import type {ProductListResultsProps} from "@/types/productList";

const getCardCategory = (showCategoryOnCard: boolean, category: string) => {
    if (showCategoryOnCard) return category;

    return undefined;
};

const getRetailPriceUah = (usdToUahRate: number | null | undefined, priceUsd: number | undefined, retailMarkup: number) => {
    if (!usdToUahRate || !priceUsd) return null;

    return Number((priceUsd * (1 + retailMarkup / 100) * usdToUahRate).toFixed(2));
};

const getWholesalePriceUah = (usdToUahRate: number | null | undefined, priceUsd: number | undefined, wholesaleMarkup: number) => {
    if (!usdToUahRate || !priceUsd) return null;

    return Number((priceUsd * (1 + wholesaleMarkup / 100) * usdToUahRate).toFixed(2));
};

export const ProductListResults = ({
    categoryOptions,
    error,
    gridRef,
    gridClassName,
    hasMore,
    isLoading,
    items,
    loadMoreRef,
    messageClassName,
    onProductDeleted,
    showCategoryOnCard,
    showAdminActions,
    usdToUahRate,
    pricingConfig,
}: ProductListResultsProps) => {
    const effectiveRate = pricingConfig?.usdToUahRate ?? usdToUahRate;
    const retailMarkup = pricingConfig?.retailMarkup ?? 30;
    const wholesaleMarkup = pricingConfig?.wholesaleMarkup ?? 15;
    const wholesaleDescription = pricingConfig?.wholesaleDescription ?? "";

    if (error) {
        return <p className={messageClassName} role="alert">{error}</p>;
    }

    if (isLoading && !items.length) {
        return <p className={messageClassName} role="status">Завантаження товарів...</p>;
    }

    if (!items.length) {
        return <p className={messageClassName}>За цим пошуком товари не знайдено.</p>;
    }

    return (
        <div ref={gridRef} className={gridClassName}>
            {items.map(item => (
                <ItemComponent
                    key={item.id}
                    categoryOptions={categoryOptions}
                    image={item.imageUrl}
                    images={item.imageUrls}
                    item={item}
                    title={item.title}
                    description={item.description}
                    category={getCardCategory(showCategoryOnCard, item.category)}
                    onProductDeleted={onProductDeleted}
                    priceUsd={item.priceUsd}
                    priceUah={getRetailPriceUah(effectiveRate, item.priceUsd, retailMarkup)}
                    priceUahWholesale={getWholesalePriceUah(effectiveRate, item.priceUsd, wholesaleMarkup)}
                    pricingConfig={pricingConfig}
                    wholesaleDescription={wholesaleDescription}
                    showAdminActions={showAdminActions}
                />
            ))}
            {hasMore && <div ref={loadMoreRef} aria-hidden="true" />}
        </div>
    );
};
