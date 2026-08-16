import Image from "next/image";
import {CartProductPrice} from "@/app/cart/CartProductPrice";
import {CartQuantityControls} from "@/app/cart/CartQuantityControls";
import {ImagePlaceholder} from "@/app/components/ImagePlaceholder/ImagePlaceholder";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {CART_CLASS_NAMES} from "@/constants/cart";
import type {CartProductImageProps, CartProductRowProps} from "@/types/props";


const CartProductImage = ({product}: CartProductImageProps) => {
    if (!product.imageUrl) {
        return (
            <div className={CART_CLASS_NAMES.imagePlaceholder}>
                <ImagePlaceholder iconSize={24} />
            </div>
        );
    }

    return (
        <Image
            src={product.imageUrl}
            alt={product.imageAlt ?? product.title}
            width={120}
            height={120}
            className={CART_CLASS_NAMES.image}
        />
    );
};

export const CartProductRow = ({
    product,
    quantity,
    pricingConfig,
    isWholesaleActive,
    wholesaleTooltipText,
    onQuantityChange,
    onRequestRemove,
}: CartProductRowProps) => {
    const copy = useSiteContent().cart;

    return (
        <article className={CART_CLASS_NAMES.item}>
            <CartProductImage product={product} />
            <div className={CART_CLASS_NAMES.itemInfo}>
                <h2 className={CART_CLASS_NAMES.name}>{product.title}</h2>
                <CartProductPrice
                    product={product}
                    pricingConfig={pricingConfig}
                    isWholesaleActive={isWholesaleActive}
                    wholesaleTooltipText={wholesaleTooltipText}
                    copy={copy}
                />
            </div>
            <CartQuantityControls
                product={product}
                quantity={quantity}
                copy={copy}
                onQuantityChange={onQuantityChange}
                onRequestRemove={onRequestRemove}
            />
        </article>
    );
};
