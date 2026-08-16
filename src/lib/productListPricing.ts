import {getMarkedUpUahPrice} from "@/lib/productPricing";
import type {PricingConfig} from "@/types/pricingConfig";
import type {ProductListPriceItem} from "@/types/productListPricing";


export const getProductListUahPrice = (
    item: ProductListPriceItem,
    config: PricingConfig | null | undefined,
): number | null => {
    if (typeof item.priceUah === "number") return Math.round(item.priceUah);

    const markup = config?.retailMarkup ?? 30;
    const price = getMarkedUpUahPrice(item.purchasePriceUah, markup);

    return price === null ? null : Math.round(price);
};
