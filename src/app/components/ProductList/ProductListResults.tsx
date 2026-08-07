"use client";

import {ItemComponent} from "@/app/ItemComponent/ItemComponent";
import {useCartWholesaleStatus} from "@/hooks/useCartWholesaleStatus";
import {getMarkedUpUahPrice, getUsdPriceFromUah} from "@/lib/productPricing";
import {getWholesaleDescriptionText, getWholesaleTooltipText} from "@/lib/wholesalePricing";
import type {ProductListResultsProps} from "@/types/productList";

const getCardCategory = (showCategoryOnCard: boolean, category: string) => {
    if (showCategoryOnCard) return category;

    return undefined;
};

export const ProductListResults = ({
    categoryOptions,
    cartPricingProducts,
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
    const effectiveRate = showAdminActions ? pricingConfig?.usdToUahRate ?? usdToUahRate : null;
    const retailMarkup = showAdminActions ? pricingConfig?.retailMarkup ?? 30 : 0;
    const wholesaleMarkup = showAdminActions ? pricingConfig?.wholesaleMarkup ?? 15 : 0;
    const wholesaleDescription = showAdminActions ? getWholesaleDescriptionText(pricingConfig) : "";
    const {
        isWholesaleActive,
    } = useCartWholesaleStatus(cartPricingProducts, pricingConfig);
    const wholesaleActiveDescription = getWholesaleTooltipText(pricingConfig, wholesaleDescription);

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
                    purchasePriceUah={showAdminActions ? item.purchasePriceUah : undefined}
                    priceUsd={showAdminActions ? getUsdPriceFromUah(item.purchasePriceUah, effectiveRate) ?? item.priceUsd : undefined}
                    priceUah={item.priceUah ?? getMarkedUpUahPrice(item.purchasePriceUah, retailMarkup)}
                    priceUahWholesale={item.priceUahWholesale ?? getMarkedUpUahPrice(item.purchasePriceUah, wholesaleMarkup)}
                    pricingConfig={showAdminActions ? pricingConfig : null}
                    wholesaleDescription={showAdminActions ? wholesaleDescription : item.wholesaleDescription ?? ""}
                    wholesaleActiveDescription={wholesaleActiveDescription}
                    wholesaleAsPrimary={isWholesaleActive}
                    showAdminActions={showAdminActions}
                />
            ))}
            {hasMore && <div ref={loadMoreRef} aria-hidden="true" />}
        </div>
    );
};
