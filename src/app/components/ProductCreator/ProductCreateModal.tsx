"use client";

import {createPortal} from "react-dom";
import {
    CREATE_PRODUCT_BUTTON_LABELS,
    CREATE_PRODUCT_FIELD_NAMES,
    CREATE_PRODUCT_MODAL_CLASS_NAMES,
} from "@/constants/createProduct";
import {CloseIcon} from "@/app/components/icon/CloseIcon";
import {PlusIcon} from "@/app/components/icon/PlusIcon";
import {CategoryMultiSelect} from "@/app/components/CategoryMultiSelect/CategoryMultiSelect";
import {ProductImagePreviews, ProductImageUploadProgress} from "@/app/components/ProductImagePreviews/ProductImagePreviews";
import {ProductPricingPreview} from "@/app/components/ProductPricingPreview/ProductPricingPreview";
import {useCreateProductForm} from "@/app/components/ProductCreator/useCreateProductForm";
import {useLockScroll} from "@/hooks/useLockScroll";
import type {ProductCreateModalProps} from "@/types/createProduct";

const getSubmitButtonLabel = (isSubmitting: boolean) => {
    if (isSubmitting) return CREATE_PRODUCT_BUTTON_LABELS.submitting;

    return CREATE_PRODUCT_BUTTON_LABELS.idle;
};

export const ProductCreateModal = ({categoryOptions, isOpen, onClose, onProductCreated, pricingConfig}: ProductCreateModalProps) => {
    useLockScroll(isOpen);
    const hasUsdToUahRate = Boolean(pricingConfig?.usdToUahRate);
    const {
        error,
        handleBackdropClose,
        handleClose,
        handleImageChange,
        handleSubmit,
        isSubmitting,
        removeSelectedImage,
        setFieldValue,
        toggleCategory,
        uploadProgress,
        values,
    } = useCreateProductForm(onProductCreated, onClose, pricingConfig);

    if (!isOpen || typeof document === "undefined") return null;

    return createPortal(
        <div
            className={CREATE_PRODUCT_MODAL_CLASS_NAMES.overlay}
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-product-title"
            onClick={(event) => {
                if (event.target === event.currentTarget) handleBackdropClose();
            }}
        >
            <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.panel}>
                <span className={CREATE_PRODUCT_MODAL_CLASS_NAMES.grabber} aria-hidden="true" />
                <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.header}>
                    <div>
                        <h2 id="create-product-title" className={CREATE_PRODUCT_MODAL_CLASS_NAMES.title}>Новий товар</h2>
                    </div>
                    <button type="button" onClick={handleClose} className={CREATE_PRODUCT_MODAL_CLASS_NAMES.closeButton} aria-label="Закрити">
                        <CloseIcon />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={CREATE_PRODUCT_MODAL_CLASS_NAMES.form}>
                    <label className={CREATE_PRODUCT_MODAL_CLASS_NAMES.label}>
                        Назва
                        <input
                            name={CREATE_PRODUCT_FIELD_NAMES.name}
                            value={values.name}
                            onChange={(event) => setFieldValue(CREATE_PRODUCT_FIELD_NAMES.name, event.target.value)}
                            className={CREATE_PRODUCT_MODAL_CLASS_NAMES.input}
                            required
                        />
                    </label>

                    <label className={CREATE_PRODUCT_MODAL_CLASS_NAMES.label}>
                        Закупочна ціна USD
                        <input
                            name={CREATE_PRODUCT_FIELD_NAMES.price}
                            value={values.price}
                            onChange={(event) => setFieldValue(CREATE_PRODUCT_FIELD_NAMES.price, event.target.value)}
                            className={CREATE_PRODUCT_MODAL_CLASS_NAMES.input}
                            type="number"
                            min="0"
                            step="0.01"
                            required
                        />
                    </label>

                    <label className={CREATE_PRODUCT_MODAL_CLASS_NAMES.label}>
                        Закупочна ціна UAH
                        <input
                            name={CREATE_PRODUCT_FIELD_NAMES.priceUah}
                            value={values.priceUah}
                            onChange={(event) => setFieldValue(CREATE_PRODUCT_FIELD_NAMES.priceUah, event.target.value)}
                            className={CREATE_PRODUCT_MODAL_CLASS_NAMES.input}
                            type="number"
                            min="0"
                            step="0.01"
                            disabled={!hasUsdToUahRate}
                            placeholder={hasUsdToUahRate ? undefined : "Немає курсу USD"}
                        />
                    </label>

                    <ProductPricingPreview priceUsd={values.price} pricingConfig={pricingConfig} />

                    <label className={CREATE_PRODUCT_MODAL_CLASS_NAMES.label}>
                        Опис
                        <textarea
                            name={CREATE_PRODUCT_FIELD_NAMES.description}
                            value={values.description}
                            onChange={(event) => setFieldValue(CREATE_PRODUCT_FIELD_NAMES.description, event.target.value)}
                            className={CREATE_PRODUCT_MODAL_CLASS_NAMES.textarea}
                        />
                    </label>

                    <CategoryMultiSelect
                        options={categoryOptions}
                        selectedCategories={values.categories}
                        onToggle={toggleCategory}
                    />

                    <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.label}>
                        <span>Фото</span>
                        <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.existingImages}>
                            <label className={CREATE_PRODUCT_MODAL_CLASS_NAMES.imageAddTile} aria-label="Додати фото">
                                <PlusIcon />
                                <input
                                    name={CREATE_PRODUCT_FIELD_NAMES.image}
                                    onChange={handleImageChange}
                                    className={CREATE_PRODUCT_MODAL_CLASS_NAMES.imageAddInput}
                                    type="file"
                                    multiple
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                />
                            </label>
                            <ProductImagePreviews
                                images={values.image}
                                isDisabled={isSubmitting}
                                onRemove={removeSelectedImage}
                            />
                        </div>
                        {values.image.length > 0 && (
                            <span className={CREATE_PRODUCT_MODAL_CLASS_NAMES.selectedImages}>
                                Вибрано фото: {values.image.length}
                            </span>
                        )}
                        {uploadProgress !== null && <ProductImageUploadProgress progress={uploadProgress} />}
                    </div>

                    {error && <p className={CREATE_PRODUCT_MODAL_CLASS_NAMES.error}>{error}</p>}

                    <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.actions}>
                        <button type="button" onClick={handleClose} className={CREATE_PRODUCT_MODAL_CLASS_NAMES.secondaryButton} disabled={isSubmitting}>
                            Скасувати
                        </button>
                        <button type="submit" className={CREATE_PRODUCT_MODAL_CLASS_NAMES.primaryButton} disabled={isSubmitting}>
                            {getSubmitButtonLabel(isSubmitting)}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body,
    );
};
