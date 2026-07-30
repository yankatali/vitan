"use client";

import {useEffect, useMemo} from "react";
import {CloseIcon} from "@/app/components/icon/CloseIcon";
import {CREATE_PRODUCT_MODAL_CLASS_NAMES} from "@/constants/createProduct";

interface ProductImagePreviewsProps {
    images: File[];
    isDisabled?: boolean;
    onRemove: (image: File) => void;
}

interface ProductImageUploadProgressProps {
    progress: number;
}

const getImageKey = (image: File) => `${image.name}-${image.size}-${image.lastModified}`;

const getUploadProgressLabel = (progress: number) => {
    if (progress >= 100) return "Фото завантажено, зберігаю товар...";

    return `Завантаження фото: ${progress}%`;
};

export const ProductImagePreviews = ({images, isDisabled = false, onRemove}: ProductImagePreviewsProps) => {
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
            {previews.map(({image, key, url}) => (
                <div key={key} className={CREATE_PRODUCT_MODAL_CLASS_NAMES.existingImageItem}>
                    <span
                        className={CREATE_PRODUCT_MODAL_CLASS_NAMES.selectedImagePreview}
                        style={{backgroundImage: `url("${url}")`}}
                        role="img"
                        aria-label={image.name}
                    />
                    <span className={CREATE_PRODUCT_MODAL_CLASS_NAMES.newImageBadge}>Нове</span>
                    <button
                        type="button"
                        className={CREATE_PRODUCT_MODAL_CLASS_NAMES.existingImageRemoveButton}
                        onClick={() => onRemove(image)}
                        aria-label={`Прибрати фото ${image.name}`}
                        disabled={isDisabled}
                    >
                        <CloseIcon />
                    </button>
                </div>
            ))}
        </>
    );
};

export const ProductImageUploadProgress = ({progress}: ProductImageUploadProgressProps) => (
    <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.uploadProgress} role="status" aria-live="polite">
        <span>{getUploadProgressLabel(progress)}</span>
        <span className={CREATE_PRODUCT_MODAL_CLASS_NAMES.uploadProgressTrack} aria-hidden="true">
            <span
                className={CREATE_PRODUCT_MODAL_CLASS_NAMES.uploadProgressFill}
                style={{width: `${progress}%`}}
            />
        </span>
    </div>
);
