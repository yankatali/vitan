import Image from "next/image";
import {CloseIcon} from "@/app/components/icon/CloseIcon";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {CREATE_PRODUCT_MODAL_CLASS_NAMES} from "@/constants/createProduct";
import type {ExistingProductImageItemProps} from "@/types/props";


export const ExistingProductImageItem = ({
    imageUrl,
    index,
    isSubmitting,
    onRemove,
}: ExistingProductImageItemProps) => {
    const copy = useSiteContent().productForm;

    return (
        <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.existingImageItem}>
            <Image
                src={imageUrl}
                alt={`${copy.existingProductImageAlt} ${index + 1}`}
                width={120}
                height={96}
                className={CREATE_PRODUCT_MODAL_CLASS_NAMES.existingImage}
            />
            <button
                type="button"
                className={CREATE_PRODUCT_MODAL_CLASS_NAMES.existingImageRemoveButton}
                onClick={() => onRemove(imageUrl)}
                aria-label={`${copy.removeExistingImageAriaLabel} ${index + 1}`}
                disabled={isSubmitting}
            >
                <CloseIcon />
            </button>
        </div>
    );
};
