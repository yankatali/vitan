"use client";

import {CREATE_PRODUCT_MODAL_CLASS_NAMES} from "@/constants/createProduct";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {getMarkedUpUahPrice} from "@/lib/productPricing";
import {formatPricePair, parsePrice} from "@/lib/productPricingPreviewHelpers";
import type {PricingConfig} from "@/types/pricingConfig";

interface ProductPricingPreviewProps {
    priceUah: string;
    pricingConfig?: PricingConfig | null;
}

export const ProductPricingPreview = ({priceUah, pricingConfig}: ProductPricingPreviewProps) => {
    const parsedPriceUah = parsePrice(priceUah);
    const retailMarkup = pricingConfig?.retailMarkup ?? 0;
    const wholesaleMarkup = pricingConfig?.wholesaleMarkup ?? 0;
    const copy = useSiteContent().productForm.pricingPreview;

    return (
        <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.priceInfo}>
            <p className={CREATE_PRODUCT_MODAL_CLASS_NAMES.priceInfoTitle}>{copy.title}</p>
            <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.priceInfoRows}>
                <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.priceInfoRow}>
                    <span>{copy.retail} +{retailMarkup}%</span>
                    <strong>{parsedPriceUah === null ? "-" : formatPricePair(getMarkedUpUahPrice(parsedPriceUah, retailMarkup) ?? 0, pricingConfig)}</strong>
                </div>
                <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.priceInfoRow}>
                    <span>{copy.wholesale} +{wholesaleMarkup}%</span>
                    <strong>{parsedPriceUah === null ? "-" : formatPricePair(getMarkedUpUahPrice(parsedPriceUah, wholesaleMarkup) ?? 0, pricingConfig)}</strong>
                </div>
            </div>
        </div>
    );
};
