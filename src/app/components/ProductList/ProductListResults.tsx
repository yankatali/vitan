"use client";

import {ItemComponent} from "@/app/ItemComponent/ItemComponent";
import type {ProductListResultsProps} from "@/types/productList";

const getCardCategory = (showCategoryOnCard: boolean, category: string) => {
    if (showCategoryOnCard) return category;

    return undefined;
};

const getPriceUah = (usdToUahRate: number | null, priceUsd: number) => {
    if (!usdToUahRate) return null;

    return Number((priceUsd * usdToUahRate).toFixed(2));
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
}: ProductListResultsProps) => {
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
                    priceUah={getPriceUah(usdToUahRate, item.priceUsd)}
                    showAdminActions={showAdminActions}
                />
            ))}
            {hasMore && <div ref={loadMoreRef} aria-hidden="true" />}
        </div>
    );
};
