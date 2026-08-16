import dynamic from "next/dynamic";
import {useState} from "react";
import CartIcon from "@/app/components/icon/CartIcon";
import {PencilIcon} from "@/app/components/icon/PencilIcon";
import {TrashIcon} from "@/app/components/icon/TrashIcon";
import {PRODUCT_CARD_ACTION_CLASS_NAMES} from "@/constants/productCardActions";
import {getCartButtonClassName, getDeleteButtonLabel} from "@/lib/productCardActionHelpers";
import {useProductCardActions} from "@/hooks/useProductCardActions";
import type {ProductCardActionsProps} from "@/types/productCardActions";
import {ConfirmModal} from "@/app/components/ConfirmModal/ConfirmModal";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";

const DynamicProductEditModal = dynamic(
    () => import("@/app/components/ProductEditModal/ProductEditModal").then(module => module.ProductEditModal),
    {ssr: false},
);

export const ProductCardActions = ({
    categoryOptions,
    onProductChanged,
    pricingConfig,
    product,
    showAdminActions = false,
    showCartButton = true,
}: ProductCardActionsProps) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isCartRemoveConfirmOpen, setIsCartRemoveConfirmOpen] = useState(false);
    const copy = useSiteContent().productActions;

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
                        aria-label={copy.edit}
                    >
                        <PencilIcon size={20} />
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsConfirmOpen(true)}
                        className={PRODUCT_CARD_ACTION_CLASS_NAMES.dangerButton}
                        aria-label={getDeleteButtonLabel(isDeleting, copy)}
                        disabled={isDeleting}
                    >
                        <TrashIcon size={20} />
                    </button>
                </div>
            )}

            {error && <p className={PRODUCT_CARD_ACTION_CLASS_NAMES.error}>{error}</p>}

            {showAdminActions && (
                <DynamicProductEditModal
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
                    text={copy.confirmDelete}
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
                    text={copy.confirmDeleteFromCart}
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
