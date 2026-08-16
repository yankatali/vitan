import {getUploadProgressLabel} from "@/lib/productImageUploadProgressHelpers";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {CREATE_PRODUCT_MODAL_CLASS_NAMES} from "@/constants/createProduct";
import type {ProductImageUploadProgressProps} from "@/types/props";


export const ProductImageUploadProgress = ({progress}: ProductImageUploadProgressProps) => {
    const copy = useSiteContent().productForm;

    return (
        <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.uploadProgress} role="status" aria-live="polite">
            <span>{getUploadProgressLabel(progress, copy)}</span>
            <span className={CREATE_PRODUCT_MODAL_CLASS_NAMES.uploadProgressTrack} aria-hidden="true">
                <span
                    className={CREATE_PRODUCT_MODAL_CLASS_NAMES.uploadProgressFill}
                    style={{width: `${progress}%`}}
                />
            </span>
        </div>
    );
};
