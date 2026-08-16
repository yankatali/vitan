const usdFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const uahFormatter = new Intl.NumberFormat("uk-UA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export const formatUsd = (value: number) => usdFormatter.format(value);

export const formatUah = (value: number, currencySymbol = "грн") => {
    return `${uahFormatter.format(value)} ${currencySymbol}`;
};

export const formatUahShort = (value: number, currencyShort = "грн") => {
    return `${uahFormatter.format(value)} ${currencyShort}`;
};
