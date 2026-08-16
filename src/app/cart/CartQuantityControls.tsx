import {TrashIcon} from "@/app/components/icon/TrashIcon";
import {CART_CLASS_NAMES} from "@/constants/cart";
import type {CartQuantityControlsProps} from "@/types/props";


export const CartQuantityControls = ({
    product,
    quantity,
    copy,
    onQuantityChange,
    onRequestRemove,
}: CartQuantityControlsProps) => {
    return (
        <div className={CART_CLASS_NAMES.controls}>
            <div className={CART_CLASS_NAMES.quantityGroup}>
                <button
                    type="button"
                    onClick={() => onQuantityChange(product.id, quantity - 1)}
                    className={CART_CLASS_NAMES.quantityButton}
                    aria-label={`${copy.quantityDecreaseAria} ${product.title}`}
                >
                    −
                </button>
                <span className={CART_CLASS_NAMES.quantityValue}>{quantity}</span>
                <button
                    type="button"
                    onClick={() => onQuantityChange(product.id, quantity + 1)}
                    className={CART_CLASS_NAMES.quantityButton}
                    aria-label={`${copy.quantityIncreaseAria} ${product.title}`}
                >
                    +
                </button>
            </div>
            <button
                type="button"
                onClick={() => onRequestRemove(product.id)}
                className={CART_CLASS_NAMES.removeButton}
                aria-label={`${copy.removeAria} ${product.title}`}
            >
                <TrashIcon size={18} />
            </button>
        </div>
    );
};
