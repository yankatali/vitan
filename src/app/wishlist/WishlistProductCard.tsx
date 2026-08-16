import {ProductCardSimple} from "@/app/components/ProductCardSimple/ProductCardSimple";
import CartIcon from "@/app/components/icon/CartIcon";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {PRODUCT_CARD_ACTION_CLASS_NAMES} from "@/constants/productCardActions";
import type {ItemConfig} from "@/types/item";

interface WishlistProductCardProps {
    item: ItemConfig;
    isInCart: boolean;
    isWholesaleActive: boolean;
    wholesaleTooltipText: string;
    onAddToCart: (productId: string) => void;
    onRequestCartRemove: (productId: string) => void;
}

interface WishlistCartActionButtonProps {
    productId: string;
    isInCart: boolean;
    onAddToCart: (productId: string) => void;
    onRequestCartRemove: (productId: string) => void;
}

const WishlistCartActionButton = ({
    productId,
    isInCart,
    onAddToCart,
    onRequestCartRemove,
}: WishlistCartActionButtonProps) => {
    const copy = useSiteContent().productActions;
    const handleClick = () => {
        if (isInCart) {
            onRequestCartRemove(productId);
            return;
        }

        onAddToCart(productId);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={isInCart ? PRODUCT_CARD_ACTION_CLASS_NAMES.activeCartButton : PRODUCT_CARD_ACTION_CLASS_NAMES.cartButton}
            aria-pressed={isInCart}
            aria-label={isInCart ? copy.inCart : copy.addToCart}
        >
            <CartIcon size={24} checked={isInCart} />
        </button>
    );
};

export const WishlistProductCard = ({
    item,
    isInCart,
    isWholesaleActive,
    wholesaleTooltipText,
    onAddToCart,
    onRequestCartRemove,
}: WishlistProductCardProps) => {
    return (
        <ProductCardSimple
            className="vitan-product-card--wishlist"
            item={item}
            priceUah={item.priceUah ?? null}
            priceUahWholesale={item.priceUahWholesale ?? null}
            wholesaleDescription={item.wholesaleDescription ?? ""}
            wholesaleActiveDescription={wholesaleTooltipText}
            wholesaleAsPrimary={isWholesaleActive}
            cartAction={
                <WishlistCartActionButton
                    productId={item.id}
                    isInCart={isInCart}
                    onAddToCart={onAddToCart}
                    onRequestCartRemove={onRequestCartRemove}
                />
            }
        />
    );
};
