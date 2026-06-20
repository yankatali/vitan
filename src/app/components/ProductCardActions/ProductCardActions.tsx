"use client";

import CartIcon from "@/app/components/icon/CartIcon";
import {PencilIcon} from "@/app/components/icon/PencilIcon";
import {TrashIcon} from "@/app/components/icon/TrashIcon";
import {ProductEditModal} from "@/app/components/ProductEditModal/ProductEditModal";
import {PRODUCT_CARD_ACTION_CLASS_NAMES, PRODUCT_CARD_ACTION_LABELS} from "@/constants/productCardActions";
import {useProductCardActions} from "@/app/components/ProductCardActions/useProductCardActions";
import type {ProductCardActionsProps} from "@/types/productCardActions";
import {useState} from "react";
import {ConfirmModal} from "@/app/components/ConfirmModal/ConfirmModal";

const getCartButtonLabel = (isInCart: boolean) => {
    if (isInCart) return PRODUCT_CARD_ACTION_LABELS.inCart;

    return PRODUCT_CARD_ACTION_LABELS.addToCart;
};

const getCartButtonClassName = (isInCart: boolean) => {
    if (isInCart) return PRODUCT_CARD_ACTION_CLASS_NAMES.activeCartButton;

    return PRODUCT_CARD_ACTION_CLASS_NAMES.cartButton;
};

const getDeleteButtonLabel = (isDeleting: boolean) => {
    if (isDeleting) return PRODUCT_CARD_ACTION_LABELS.deleting;

    return PRODUCT_CARD_ACTION_LABELS.delete;
};

export const ProductCardActions = ({
    categoryOptions,
    onProductChanged,
    product,
    showAdminActions = false,
}: ProductCardActionsProps) => {
    const {
        closeEdit,
        error,
        handleCartAdd,
        handleCartRemove,
        handleDelete,
        isDeleting,
        isEditOpen,
        isInCart,
        openEdit,
    } = useProductCardActions({onProductChanged, product});
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isCartRemoveConfirmOpen, setIsCartRemoveConfirmOpen] = useState(false);
    const handleCartButtonClick = () => {
        if (isInCart) {
            setIsCartRemoveConfirmOpen(true);
            return;
        }

        handleCartAdd();
    };

    return (
        <div className={PRODUCT_CARD_ACTION_CLASS_NAMES.wrapper}>
            <button
                type="button"
                onClick={handleCartButtonClick}
                className={getCartButtonClassName(isInCart)}
                aria-pressed={isInCart}
            >
                <CartIcon size={18} />
                {getCartButtonLabel(isInCart)}
            </button>

            {showAdminActions && (
                <div className={PRODUCT_CARD_ACTION_CLASS_NAMES.adminRow}>
                    <button
                        type="button"
                        onClick={openEdit}
                        className={PRODUCT_CARD_ACTION_CLASS_NAMES.iconButton}
                        aria-label={PRODUCT_CARD_ACTION_LABELS.edit}
                    >
                        <PencilIcon />
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsConfirmOpen(true)}
                        className={PRODUCT_CARD_ACTION_CLASS_NAMES.dangerButton}
                        aria-label={getDeleteButtonLabel(isDeleting)}
                        disabled={isDeleting}
                    >
                        <TrashIcon />
                    </button>
                </div>
            )}

            {error && <p className={PRODUCT_CARD_ACTION_CLASS_NAMES.error}>{error}</p>}

            {showAdminActions && (
                <ProductEditModal
                    categoryOptions={categoryOptions}
                    isOpen={isEditOpen}
                    onClose={closeEdit}
                    onProductUpdated={onProductChanged}
                    product={product}
                />
            )}
            {isConfirmOpen && (
                <ConfirmModal
                    isOpen={isConfirmOpen}
                    text="Ви точно хочете видалити цей товар?"
                    onCancel={() => setIsConfirmOpen(false)}
                    onConfirm={async () => {
                        if (isDeleting) return;
                        await handleDelete();
                        setIsConfirmOpen(false);
                    }}

                />
            )}
            {isCartRemoveConfirmOpen && (
                <ConfirmModal
                    isOpen={isCartRemoveConfirmOpen}
                    text="Ви точно хочете видалити цей товар з кошика?"
                    onCancel={() => setIsCartRemoveConfirmOpen(false)}
                    onConfirm={() => {
                        handleCartRemove();
                        setIsCartRemoveConfirmOpen(false);
                    }}
                />
            )}
        </div>
    );
};
