import {PRODUCT_CARD_CLASS_NAMES} from "@/constants/productCard";
import {PRODUCT_CARD_ACTION_CLASS_NAMES} from "@/constants/productCardActions";
import {RELATED_PRODUCTS_CLASS_NAMES} from "@/constants/relatedProducts";
import type {SiteContent} from "@/constants/siteContent";
import type {ItemConfig} from "@/types/item";

export interface RelatedProductPrices {
    retail: number | null;
    wholesale: number | null;
}

export type RelatedProductActionButtonVariant = "overlay" | "modal";
export type RelatedProductsScrollDirection = "left" | "right";

export const getRelatedProductPriceEntry = (product: ItemConfig): [string, RelatedProductPrices] => {
    return [product.id, {
        retail: product.priceUah ?? null,
        wholesale: product.priceUahWholesale ?? null,
    }];
};

export const getRelatedProductActionButtonClassName = (
    active: boolean,
    variant: RelatedProductActionButtonVariant,
) => {
    if (variant === "overlay") {
        return active ? PRODUCT_CARD_CLASS_NAMES.favoriteOverlayActive : PRODUCT_CARD_CLASS_NAMES.favoriteOverlay;
    }

    return active ? PRODUCT_CARD_ACTION_CLASS_NAMES.activeCartButton : PRODUCT_CARD_ACTION_CLASS_NAMES.cartButton;
};

export const getRelatedProductsScrollButtonClassName = (direction: RelatedProductsScrollDirection) => {
    const positionClassName = direction === "left"
        ? RELATED_PRODUCTS_CLASS_NAMES.scrollButtonLeft
        : RELATED_PRODUCTS_CLASS_NAMES.scrollButtonRight;

    return `${RELATED_PRODUCTS_CLASS_NAMES.scrollButton} ${positionClassName}`;
};

export const getRelatedProductsScrollButtonAriaLabel = (
    direction: RelatedProductsScrollDirection,
    copy: SiteContent["relatedProducts"],
) => {
    if (direction === "left") return copy.scrollLeftAriaLabel;

    return copy.scrollRightAriaLabel;
};
