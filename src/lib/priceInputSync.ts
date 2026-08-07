const parsePriceInput = (value: string): number | null => {
    if (!value.trim()) return null;

    const parsedValue = Number(value.replace(",", "."));
    if (!Number.isFinite(parsedValue)) return null;

    return parsedValue;
};

const formatUahPriceInput = (value: number) => String(Math.round(value));
const formatUsdPriceInput = (value: number) => value.toFixed(2);

export const getUahPriceInputFromUsd = (priceUsd: string, usdToUahRate: number | null | undefined) => {
    if (!usdToUahRate) return "";

    const parsedPriceUsd = parsePriceInput(priceUsd);
    if (parsedPriceUsd === null) return "";

    return formatUahPriceInput(parsedPriceUsd * usdToUahRate);
};

export const getUsdPriceInputFromUah = (priceUah: string, usdToUahRate: number | null | undefined) => {
    if (!usdToUahRate) return "";

    const parsedPriceUah = parsePriceInput(priceUah);
    if (parsedPriceUah === null) return "";

    return formatUsdPriceInput(parsedPriceUah / usdToUahRate);
};
