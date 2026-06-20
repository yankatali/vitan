"use client";

import {useState} from "react";
import {deleteProduct} from "@/app/components/ProductDeleteButton/deleteProductApi";
import type {UseDeleteProductParams} from "@/types/deleteProduct";

export const useDeleteProduct = ({onDeleted, productId}: UseDeleteProductParams) => {
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const handleDelete = async () => {
        setError(null);
        setIsDeleting(true);
        try {
            await deleteProduct(productId);
            onDeleted();
        } catch (error) {
            setError(error instanceof Error ? error.message : "Не вдалося видалити товар.");
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        error,
        isDeleting,
        handleDelete,
    };
};
