"use client";

import {CREATE_PRODUCT_MODAL_CLASS_NAMES} from "@/constants/createProduct";
import type {PricingConfig} from "@/types/pricingConfig";

interface ProductPricingPreviewProps {
    priceUsd: string;
    pricingConfig?: PricingConfig | null;
}

interface OriginalProductPriceFieldProps {
    priceUsd?: number;
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

const getUahValue = (priceUsd: number, pricingConfig?: PricingConfig | null) => {
    if (!pricingConfig?.usdToUahRate) return null;

    return priceUsd * pricingConfig.usdToUahRate;
};

const getMarkedUpPrice = (priceUsd: number, markup: number) => priceUsd * (1 + markup / 100);

const formatPricePair = (priceUsd: number, pricingConfig?: PricingConfig | null) => {
    const priceUah = getUahValue(priceUsd, pricingConfig);

    if (priceUah === null) return usdFormatter.format(priceUsd);

    return `${usdFormatter.format(priceUsd)} / ${formatUah(priceUah)}`;
};

export const ProductPricingPreview = ({priceUsd, pricingConfig}: ProductPricingPreviewProps) => {
    const parsedPriceUsd = parsePrice(priceUsd);
    const retailMarkup = pricingConfig?.retailMarkup ?? 0;
    const wholesaleMarkup = pricingConfig?.wholesaleMarkup ?? 0;

    return (
        <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.priceInfo}>
            <p className={CREATE_PRODUCT_MODAL_CLASS_NAMES.priceInfoTitle}>Націнка від закупочної ціни</p>
            <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.priceInfoRows}>
                <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.priceInfoRow}>
                    <span>Роздріб +{retailMarkup}%</span>
                    <strong>{parsedPriceUsd === null ? "-" : formatPricePair(getMarkedUpPrice(parsedPriceUsd, retailMarkup), pricingConfig)}</strong>
                </div>
                <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.priceInfoRow}>
                    <span>Опт +{wholesaleMarkup}%</span>
                    <strong>{parsedPriceUsd === null ? "-" : formatPricePair(getMarkedUpPrice(parsedPriceUsd, wholesaleMarkup), pricingConfig)}</strong>
                </div>
            </div>
        </div>
    );
};

export const OriginalProductPriceField = ({priceUsd, pricingConfig}: OriginalProductPriceFieldProps) => {
    const value = typeof priceUsd === "number" ? formatPricePair(priceUsd, pricingConfig) : "";

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
