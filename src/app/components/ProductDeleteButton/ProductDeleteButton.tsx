"use client";

import {DELETE_PRODUCT_BUTTON_LABELS, DELETE_PRODUCT_CLASS_NAMES} from "@/constants/deleteProduct";
import {useDeleteProduct} from "@/app/components/ProductDeleteButton/useDeleteProduct";
import type {DeleteProductButtonProps} from "@/types/deleteProduct";

const getDeleteButtonLabel = (isDeleting: boolean) => {
    if (isDeleting) return DELETE_PRODUCT_BUTTON_LABELS.deleting;

    return DELETE_PRODUCT_BUTTON_LABELS.idle;
};

export const ProductDeleteButton = ({onDeleted, productId}: DeleteProductButtonProps) => {
    const {error, handleDelete, isDeleting} = useDeleteProduct({onDeleted, productId});

    return (
        <div className={DELETE_PRODUCT_CLASS_NAMES.wrapper}>
            <button
                type="button"
                onClick={handleDelete}
                className={DELETE_PRODUCT_CLASS_NAMES.button}
                disabled={isDeleting}
            >
                {getDeleteButtonLabel(isDeleting)}
            </button>
            {error && <p className={DELETE_PRODUCT_CLASS_NAMES.error}>{error}</p>}
        </div>
    );
};
