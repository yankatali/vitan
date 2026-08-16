import {PriceTooltip} from "@/app/components/PriceTooltip/PriceTooltip";
import {CART_CLASS_NAMES} from "@/constants/cart";
import type {SiteContent} from "@/constants/siteContent";
import {formatUah} from "@/lib/formatters";
import {getProductPriceUah, getRetailPriceUah} from "@/lib/wholesalePricing";
import type {ItemConfig} from "@/types/item";
import type {PricingConfig} from "@/types/pricingConfig";
import type {CartProductPriceProps} from "@/types/props";


export const CartProductPrice = ({
    product,
    pricingConfig,
    isWholesaleActive,
    wholesaleTooltipText,
    copy,
}: CartProductPriceProps) => {
    const retailPriceUah = getRetailPriceUah(product, pricingConfig);
    const priceUah = getProductPriceUah(product, isWholesaleActive, pricingConfig);
    const usesWholesalePrice = isWholesaleActive
        && typeof priceUah === "number"
        && typeof retailPriceUah === "number"
        && priceUah !== retailPriceUah;

    if (typeof priceUah !== "number") return null;

    return (
        <div className="grid gap-0.5">
            <p className={usesWholesalePrice ? "text-[15px] font-bold leading-5 text-[#0ba862]" : CART_CLASS_NAMES.price}>
                {formatUah(priceUah)}
            </p>
            {usesWholesalePrice && typeof retailPriceUah === "number" && (
                <p className="text-[12px] font-semibold leading-4 text-[var(--destructive)] line-through">
                    {formatUah(retailPriceUah)}
                </p>
            )}
            {usesWholesalePrice && (
                <p className="flex items-center gap-1 text-[12px] font-medium leading-4 text-[#0ba862]">
                    {copy.wholesaleBadge}
                    <PriceTooltip text={wholesaleTooltipText} />
                </p>
            )}
        </div>
    );
};
