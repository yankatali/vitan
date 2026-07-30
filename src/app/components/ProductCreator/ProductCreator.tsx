"use client";

import {CREATE_PRODUCT_MODAL_CLASS_NAMES} from "@/constants/createProduct";
import {PlusIcon} from "@/app/components/icon/PlusIcon";
import {ProductCreateModal} from "@/app/components/ProductCreator/ProductCreateModal";
import {useProductCreatorDisclosure} from "@/app/components/ProductCreator/useProductCreatorDisclosure";
import type {ProductCreatorProps} from "@/types/createProduct";

export const ProductCreator = ({categoryOptions, onProductCreated, pricingConfig}: ProductCreatorProps) => {
    const {close, isOpen, open} = useProductCreatorDisclosure();

    return (
        <>
            <button type="button" onClick={open} className={CREATE_PRODUCT_MODAL_CLASS_NAMES.trigger} aria-label="Додати товар">
                <PlusIcon />
            </button>
            <ProductCreateModal
                categoryOptions={categoryOptions}
                isOpen={isOpen}
                onClose={close}
                onProductCreated={onProductCreated}
                pricingConfig={pricingConfig}
            />
        </>
    );
};
