"use client";

import {useState} from "react";
import {deleteProduct} from "@/lib/deleteProductApi";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import type {UseDeleteProductParams} from "@/types/deleteProduct";

export const useDeleteProduct = ({onDeleted, productId}: UseDeleteProductParams) => {
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const copy = useSiteContent().deleteProduct.errors;
    const handleDelete = async () => {
        setError(null);
        setIsDeleting(true);
        try {
            await deleteProduct(productId, copy);
            onDeleted();
        } catch (error) {
            setError(error instanceof Error ? error.message : copy.unableToDelete);
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
