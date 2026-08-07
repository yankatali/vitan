"use client";

import dynamic from "next/dynamic";
import CartIcon from "@/app/components/icon/CartIcon";
import {PencilIcon} from "@/app/components/icon/PencilIcon";
import {TrashIcon} from "@/app/components/icon/TrashIcon";
import {PRODUCT_CARD_ACTION_CLASS_NAMES, PRODUCT_CARD_ACTION_LABELS} from "@/constants/productCardActions";
import {useProductCardActions} from "@/app/components/ProductCardActions/useProductCardActions";
import type {ProductCardActionsProps} from "@/types/productCardActions";
import {useState} from "react";
import {ConfirmModal} from "@/app/components/ConfirmModal/ConfirmModal";

const ProductEditModal = dynamic(
    () => import("@/app/components/ProductEditModal/ProductEditModal").then(module => module.ProductEditModal),
    {ssr: false},
);

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
    pricingConfig,
    product,
    showAdminActions = false,
    showCartButton = true,
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
        <div className={showAdminActions ? PRODUCT_CARD_ACTION_CLASS_NAMES.wrapper : "grid gap-2"}>
            {showCartButton && (
                <button
                    type="button"
                    onClick={handleCartButtonClick}
                    className={getCartButtonClassName(isInCart)}
                    aria-pressed={isInCart}
                >
                    <CartIcon size={24} checked={isInCart} />
                </button>
            )}

            {showAdminActions && (
                <div className={PRODUCT_CARD_ACTION_CLASS_NAMES.adminRow}>
                    <button
                        type="button"
                        onClick={openEdit}
                        className={PRODUCT_CARD_ACTION_CLASS_NAMES.iconButton}
                        aria-label={PRODUCT_CARD_ACTION_LABELS.edit}
                    >
                        <PencilIcon size={20} />
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsConfirmOpen(true)}
                        className={PRODUCT_CARD_ACTION_CLASS_NAMES.dangerButton}
                        aria-label={getDeleteButtonLabel(isDeleting)}
                        disabled={isDeleting}
                    >
                        <TrashIcon size={20} />
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
                    pricingConfig={pricingConfig}
                    product={product}
                />
            )}
            {isConfirmOpen && (
                <ConfirmModal
                    isOpen={isConfirmOpen}
                    text="Ви точно хочете видалити цей товар?"
                    isLoading={isDeleting}
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
