"use client";

import {CREATE_PRODUCT_MODAL_CLASS_NAMES} from "@/constants/createProduct";
import {getMarkedUpUahPrice} from "@/lib/productPricing";
import type {PricingConfig} from "@/types/pricingConfig";

interface ProductPricingPreviewProps {
    priceUah: string;
    pricingConfig?: PricingConfig | null;
}

interface OriginalProductPriceFieldProps {
    priceUah?: number;
    pricingConfig?: PricingConfig | null;
}

const parsePrice = (value: string) => {
    if (!value.trim()) return null;

    const parsedValue = Number(value.replace(",", "."));
    if (!Number.isFinite(parsedValue)) return null;

    return parsedValue;
};

const usdFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const formatUah = (value: number) => {
    const formatted = new Intl.NumberFormat("uk-UA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);

    return `${formatted} грн`;
};

const getUsdValue = (priceUah: number, pricingConfig?: PricingConfig | null) => {
    if (!pricingConfig?.usdToUahRate) return null;

    return priceUah / pricingConfig.usdToUahRate;
};

const formatPricePair = (priceUah: number, pricingConfig?: PricingConfig | null) => {
    const priceUsd = getUsdValue(priceUah, pricingConfig);

    if (priceUsd === null) return formatUah(priceUah);

    return `${formatUah(priceUah)} / ${usdFormatter.format(priceUsd)}`;
};

export const ProductPricingPreview = ({priceUah, pricingConfig}: ProductPricingPreviewProps) => {
    const parsedPriceUah = parsePrice(priceUah);
    const retailMarkup = pricingConfig?.retailMarkup ?? 0;
    const wholesaleMarkup = pricingConfig?.wholesaleMarkup ?? 0;

    return (
        <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.priceInfo}>
            <p className={CREATE_PRODUCT_MODAL_CLASS_NAMES.priceInfoTitle}>Націнка від закупочної ціни</p>
            <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.priceInfoRows}>
                <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.priceInfoRow}>
                    <span>Роздріб +{retailMarkup}%</span>
                    <strong>{parsedPriceUah === null ? "-" : formatPricePair(getMarkedUpUahPrice(parsedPriceUah, retailMarkup) ?? 0, pricingConfig)}</strong>
                </div>
                <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.priceInfoRow}>
                    <span>Опт +{wholesaleMarkup}%</span>
                    <strong>{parsedPriceUah === null ? "-" : formatPricePair(getMarkedUpUahPrice(parsedPriceUah, wholesaleMarkup) ?? 0, pricingConfig)}</strong>
                </div>
            </div>
        </div>
    );
};

export const OriginalProductPriceField = ({priceUah, pricingConfig}: OriginalProductPriceFieldProps) => {
    const value = typeof priceUah === "number" ? formatPricePair(priceUah, pricingConfig) : "";

    return (
        <label className={CREATE_PRODUCT_MODAL_CLASS_NAMES.label}>
            Оригінальна закупочна ціна
            <input
                value={value}
                className={CREATE_PRODUCT_MODAL_CLASS_NAMES.input}
                readOnly
            />
        </label>
    );
};
