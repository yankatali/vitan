const roundUahPriceByKopiyky = (value: number) => {
    const whole = Math.floor(value);
    const kopiyky = value - whole;

    if (kopiyky === 0) return value;
    if (kopiyky <= 0.49) return whole + 0.5;

    return whole + 1;
};

export const getMarkedUpUahPrice = (purchasePriceUah: number | null | undefined, markup: number) => {
    if (typeof purchasePriceUah !== "number") return null;

    return Number(roundUahPriceByKopiyky(purchasePriceUah * (1 + markup / 100)).toFixed(2));
};

export const getUsdPriceFromUah = (priceUah: number | null | undefined, usdToUahRate: number | null | undefined) => {
    if (typeof priceUah !== "number" || !usdToUahRate) return null;

    return Number((priceUah / usdToUahRate).toFixed(2));
};
