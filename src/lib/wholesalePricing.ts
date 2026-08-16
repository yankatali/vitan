import type {CartProductItem} from "@/types/cart";
import type {ItemConfig} from "@/types/item";
import type {PricingConfig} from "@/types/pricingConfig";
import {getMarkedUpUahPrice} from "@/lib/productPricing";
import type {SiteContent} from "@/constants/siteContent";
import {
    DEFAULT_OLD_UNIT_TOKEN_PATTERN,
    DEFAULT_OLD_UNIT_TOKEN_REGEX,
    DEFAULT_OPT_PRICE,
} from "@/constants/wholesalePricing";

export const getOptPrice = (pricingConfig?: PricingConfig | null) => {
    return pricingConfig?.optPrice ?? DEFAULT_OPT_PRICE;
};

export const getPricingDescriptionText = (text: string | null | undefined, pricingConfig?: PricingConfig | null) => {
    return (text ?? "").replace(/\{opt_price\}/g, String(getOptPrice(pricingConfig)));
};

const normalizeWholesaleDescription = (text: string, copy?: SiteContent["wholesale"]) => {
    const oldUnitTokenRegex = copy?.oldUnitTokenRegex ?? DEFAULT_OLD_UNIT_TOKEN_REGEX;
    const oldUnitTokenPattern = copy?.oldUnitTokenPattern ?? DEFAULT_OLD_UNIT_TOKEN_PATTERN;

    return text.replace(new RegExp(oldUnitTokenRegex, "gi"), oldUnitTokenPattern);
};

export const isWholesaleEligible = (totalRetailPrice: number, pricingConfig?: PricingConfig | null) => {
    return totalRetailPrice >= getOptPrice(pricingConfig);
};

export const getRetailPriceUah = (product: ItemConfig, pricingConfig?: PricingConfig | null) => {
    if (typeof product.priceUah === "number") return product.priceUah;

    return getMarkedUpUahPrice(product.purchasePriceUah, pricingConfig?.retailMarkup ?? 30);
};

export const getWholesalePriceUah = (product: ItemConfig, pricingConfig?: PricingConfig | null) => {
    if (typeof product.priceUahWholesale === "number") return product.priceUahWholesale;

    return getMarkedUpUahPrice(product.purchasePriceUah, pricingConfig?.wholesaleMarkup ?? 15);
};

export const getProductPriceUah = (product: ItemConfig, useWholesalePrice: boolean, pricingConfig?: PricingConfig | null) => {
    if (useWholesalePrice) {
        const wholesalePrice = getWholesalePriceUah(product, pricingConfig);
        if (typeof wholesalePrice === "number") return wholesalePrice;
    }

    return getRetailPriceUah(product, pricingConfig);
};

export const getCartRetailTotal = (items: CartProductItem[], pricingConfig?: PricingConfig | null) => {
    return items.reduce((sum, item) => sum + (getRetailPriceUah(item.product, pricingConfig) ?? 0) * item.quantity, 0);
};

export const getWishlistRetailTotal = (items: Array<{product: ItemConfig}>, pricingConfig?: PricingConfig | null) => {
    return items.reduce((sum, item) => sum + (getRetailPriceUah(item.product, pricingConfig) ?? 0), 0);
};

export const getWholesaleDescriptionText = (
    pricingConfig?: PricingConfig | null,
    fallback = "",
    copy?: SiteContent["wholesale"],
) => {
    const description = pricingConfig?.wholesaleDescription?.trim() || fallback.trim() || copy?.defaultDescription.trim() || "";

    return getPricingDescriptionText(normalizeWholesaleDescription(description, copy), pricingConfig);
};

export const getWholesaleTooltipText = (
    pricingConfig?: PricingConfig | null,
    fallback = "",
    copy?: SiteContent["wholesale"],
) => {
    const activeDescription = pricingConfig?.descriptionAfterOptValid?.trim();
    if (activeDescription) return getPricingDescriptionText(activeDescription, pricingConfig);

    return getWholesaleDescriptionText(pricingConfig, fallback, copy);
};
