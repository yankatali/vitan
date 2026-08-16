import {PRODUCT_CARD_ACTION_CLASS_NAMES} from "@/constants/productCardActions";
import type {SiteContent} from "@/constants/siteContent";

export const getCartButtonClassName = (isInCart: boolean) => {
    if (isInCart) return PRODUCT_CARD_ACTION_CLASS_NAMES.activeCartButton;

    return PRODUCT_CARD_ACTION_CLASS_NAMES.cartButton;
};

export const getDeleteButtonLabel = (isDeleting: boolean, copy: SiteContent["productActions"]) => {
    if (isDeleting) return copy.deleting;

    return copy.delete;
};
