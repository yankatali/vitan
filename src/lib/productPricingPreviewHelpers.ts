import {formatUahShort, formatUsd} from "@/lib/formatters";
import type {PricingConfig} from "@/types/pricingConfig";

export const parsePrice = (value: string) => {
    if (!value.trim()) return null;

    const parsedValue = Number(value.replace(",", "."));
    if (!Number.isFinite(parsedValue)) return null;

    return parsedValue;
};

const getUsdValue = (priceUah: number, pricingConfig?: PricingConfig | null) => {
    if (!pricingConfig?.usdToUahRate) return null;

    return priceUah / pricingConfig.usdToUahRate;
};

export const formatPricePair = (priceUah: number, pricingConfig?: PricingConfig | null) => {
    const priceUsd = getUsdValue(priceUah, pricingConfig);

    if (priceUsd === null) return formatUahShort(priceUah);

    return `${formatUahShort(priceUah)} / ${formatUsd(priceUsd)}`;
};
