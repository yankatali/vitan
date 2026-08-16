import {useEffect, useMemo} from "react";
import {CloseIcon} from "@/app/components/icon/CloseIcon";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {getImageKey} from "@/lib/productImagePreviewsHelpers";
import {CREATE_PRODUCT_MODAL_CLASS_NAMES} from "@/constants/createProduct";
import type {SiteContent} from "@/constants/siteContent";

interface ProductImagePreviewsProps {
    images: File[];
    isDisabled?: boolean;
    onRemove: (image: File) => void;
}

interface ProductImagePreview {
    image: File;
    key: string;
    url: string;
}

interface ProductImagePreviewItemProps {
    preview: ProductImagePreview;
    isDisabled: boolean;
    onRemove: (image: File) => void;
    copy: SiteContent["productForm"];
}

export const ProductImagePreviews = ({images, isDisabled = false, onRemove}: ProductImagePreviewsProps) => {
    const copy = useSiteContent().productForm;
    const previews = useMemo(() => {
        return images.map(image => ({
            image,
            key: getImageKey(image),
            url: URL.createObjectURL(image),
        }));
    }, [images]);

    useEffect(() => {
        return () => {
            previews.forEach(({url}) => URL.revokeObjectURL(url));
        };
    }, [previews]);

    return (
        <>
            {previews.map(preview => (
                <ProductImagePreviewItem
                    key={preview.key}
                    preview={preview}
                    isDisabled={isDisabled}
                    onRemove={onRemove}
                    copy={copy}
                />
            ))}
        </>
    );
};

const ProductImagePreviewItem = ({preview, isDisabled, onRemove, copy}: ProductImagePreviewItemProps) => {
    const {image, key, url} = preview;

    return (
        <div key={key} className={CREATE_PRODUCT_MODAL_CLASS_NAMES.existingImageItem}>
            <span
                className={CREATE_PRODUCT_MODAL_CLASS_NAMES.selectedImagePreview}
                style={{backgroundImage: `url("${url}")`}}
                role="img"
                aria-label={image.name}
            />
            <span className={CREATE_PRODUCT_MODAL_CLASS_NAMES.newImageBadge}>{copy.newImageBadge}</span>
            <button
                type="button"
                className={CREATE_PRODUCT_MODAL_CLASS_NAMES.existingImageRemoveButton}
                onClick={() => onRemove(image)}
                aria-label={`${copy.removeImageAriaLabel} ${image.name}`}
                disabled={isDisabled}
            >
                <CloseIcon />
            </button>
        </div>
    );
};
