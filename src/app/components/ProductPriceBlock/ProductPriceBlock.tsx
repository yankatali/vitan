"use client";

import {PriceTooltip} from "@/app/components/PriceTooltip/PriceTooltip";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {PRODUCT_CARD_CLASS_NAMES} from "@/constants/productCard";
import {formatUah, formatUsd} from "@/lib/formatters";
import type {ProductPriceBlockProps} from "@/types/props";


export const ProductPriceBlock = ({
    priceUah,
    priceUahWholesale,
    priceUsd,
    wholesaleActiveDescription,
    wholesaleAsPrimary = false,
    wholesaleDescription,
}: ProductPriceBlockProps) => {
    const copy = useSiteContent().cart;
    const shouldShowWholesaleAsPrimary = wholesaleAsPrimary && typeof priceUahWholesale === "number";
    const primaryPriceUah = shouldShowWholesaleAsPrimary ? priceUahWholesale : priceUah;
    const wholesaleTooltipText = shouldShowWholesaleAsPrimary
        ? wholesaleActiveDescription ?? wholesaleDescription
        : wholesaleDescription;

    if (typeof primaryPriceUah === "number") {
        return (
            <>
                {shouldShowWholesaleAsPrimary ? (
                    <div className="flex flex-wrap items-center gap-x-1 text-[#0ba862]">
                        <p className={`${PRODUCT_CARD_CLASS_NAMES.priceUsd} !text-[#0ba862]`}>
                            {formatUah(primaryPriceUah)}
                        </p>
                        <span className="flex items-center gap-1 whitespace-nowrap text-[12px] font-medium leading-4">
                            {copy.wholesaleBadge}
                            <PriceTooltip text={wholesaleTooltipText} />
                        </span>
                    </div>
                ) : (
                    <p className={PRODUCT_CARD_CLASS_NAMES.priceUsd}>
                        {formatUah(primaryPriceUah)}
                    </p>
                )}

                {shouldShowWholesaleAsPrimary && typeof priceUah === "number" && (
                    <p className="text-[12px] font-semibold leading-4 text-[var(--destructive)] line-through">
                        {formatUah(priceUah)}
                    </p>
                )}

                {!shouldShowWholesaleAsPrimary && typeof priceUahWholesale === "number" && (
                    <p className="flex flex-wrap items-center gap-x-1 text-[12px] font-medium leading-4 text-[#0ba862]">
                        <span className="whitespace-nowrap">{formatUah(priceUahWholesale)}</span>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                            {copy.wholesaleBadge}
                            <PriceTooltip text={wholesaleTooltipText} />
                        </span>
                    </p>
                )}
            </>
        );
    }

    if (typeof priceUsd === "number") {
        return (
            <p className={PRODUCT_CARD_CLASS_NAMES.priceUsd}>
                {formatUsd(priceUsd)}
            </p>
        );
    }

    return null;
};
