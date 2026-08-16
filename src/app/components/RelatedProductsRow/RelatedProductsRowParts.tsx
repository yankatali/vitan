import {type MouseEvent, type ReactNode} from "react";
import {ProductCardSimple} from "@/app/components/ProductCardSimple/ProductCardSimple";
import {RELATED_PRODUCTS_CLASS_NAMES} from "@/constants/relatedProducts";
import {
    getRelatedProductActionButtonClassName,
    getRelatedProductsScrollButtonAriaLabel,
    getRelatedProductsScrollButtonClassName,
    type RelatedProductActionButtonVariant,
    type RelatedProductPrices,
    type RelatedProductsScrollDirection,
} from "@/lib/relatedProductsRow";
import type {SiteContent} from "@/constants/siteContent";
import type {ItemConfig} from "@/types/item";
import type {RelatedProductActionButtonProps, RelatedProductCardProps, RelatedProductsScrollButtonProps} from "@/types/props";


export const RelatedProductCard = ({
    product,
    prices,
    active,
    actionIcon,
    activeActionIcon,
    onAction,
    copy,
}: RelatedProductCardProps) => {
    const handleAction = () => onAction(product.id);

    return (
        <div className={RELATED_PRODUCTS_CLASS_NAMES.item}>
            <ProductCardSimple
                className="vitan-product-card--related"
                item={product}
                priceUah={prices?.retail ?? null}
                priceUahWholesale={prices?.wholesale ?? null}
                wholesaleDescription={product.wholesaleDescription ?? ""}
                overlayButton={
                    <RelatedProductActionButton
                        active={active}
                        activeIcon={activeActionIcon}
                        icon={actionIcon}
                        onAction={handleAction}
                        variant="overlay"
                        copy={copy}
                    />
                }
                modalAction={
                    <RelatedProductActionButton
                        active={active}
                        activeIcon={activeActionIcon}
                        icon={actionIcon}
                        onAction={handleAction}
                        variant="modal"
                        copy={copy}
                    />
                }
            />
        </div>
    );
};

const RelatedProductActionButton = ({
    active,
    activeIcon,
    icon,
    onAction,
    variant,
    copy,
}: RelatedProductActionButtonProps) => {
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onAction();
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={getRelatedProductActionButtonClassName(active, variant)}
            aria-pressed={active}
            aria-label={active ? copy.activeActionAriaLabel : copy.actionAriaLabel}
        >
            {active ? activeIcon : icon}
        </button>
    );
};

export const RelatedProductsScrollButton = ({direction, onClick, copy}: RelatedProductsScrollButtonProps) => (
    <button
        type="button"
        onClick={onClick}
        className={getRelatedProductsScrollButtonClassName(direction)}
        aria-label={getRelatedProductsScrollButtonAriaLabel(direction, copy)}
    >
        {direction === "left" ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )}
    </button>
);
