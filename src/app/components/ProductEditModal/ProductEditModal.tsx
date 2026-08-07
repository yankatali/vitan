"use client";

import Image from "next/image";
import {createPortal} from "react-dom";
import {CREATE_PRODUCT_FIELD_NAMES, CREATE_PRODUCT_MODAL_CLASS_NAMES} from "@/constants/createProduct";
import {UPDATE_PRODUCT_BUTTON_LABELS} from "@/constants/updateProduct";
import {CloseIcon} from "@/app/components/icon/CloseIcon";
import {LoadingSpinnerIcon} from "@/app/components/icon/LoadingSpinnerIcon";
import {PlusIcon} from "@/app/components/icon/PlusIcon";
import {CategoryMultiSelect} from "@/app/components/CategoryMultiSelect/CategoryMultiSelect";
import {ProductImagePreviews, ProductImageUploadProgress} from "@/app/components/ProductImagePreviews/ProductImagePreviews";
import {OriginalProductPriceField, ProductPricingPreview} from "@/app/components/ProductPricingPreview/ProductPricingPreview";
import {useUpdateProductForm} from "@/app/components/ProductEditModal/useUpdateProductForm";
import {useLockScroll} from "@/hooks/useLockScroll";
import type {ProductEditModalProps} from "@/types/updateProduct";

const getSubmitButtonLabel = (isSubmitting: boolean) => {
    if (isSubmitting) return UPDATE_PRODUCT_BUTTON_LABELS.submitting;

    return UPDATE_PRODUCT_BUTTON_LABELS.idle;
};

export const ProductEditModal = ({categoryOptions, isOpen, onClose, onProductUpdated, pricingConfig, product}: ProductEditModalProps) => {
    useLockScroll(isOpen);
    const hasUsdToUahRate = Boolean(pricingConfig?.usdToUahRate);
    const {
        error,
        handleBackdropClose,
        handleClose,
        handleImageChange,
        handleSubmit,
        isSubmitting,
        removeExistingImage,
        removeSelectedImage,
        setFieldValue,
        toggleCategory,
        uploadProgress,
        values,
    } = useUpdateProductForm({onClose, onProductUpdated, pricingConfig, product});

    if (!isOpen || typeof document === "undefined") return null;

    return createPortal(
        <div
            className={CREATE_PRODUCT_MODAL_CLASS_NAMES.overlay}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-product-title"
            onClick={(event) => {
                if (event.target === event.currentTarget) handleBackdropClose();
            }}
        >
            <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.panel}>
                <span className={CREATE_PRODUCT_MODAL_CLASS_NAMES.grabber} aria-hidden="true" />
                <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.header}>
                    <div>
                        <h2 id="edit-product-title" className={CREATE_PRODUCT_MODAL_CLASS_NAMES.title}>Змінити товар</h2>
                    </div>
                    <button type="button" onClick={handleClose} className={CREATE_PRODUCT_MODAL_CLASS_NAMES.closeButton} aria-label="Закрити">
                        <CloseIcon />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={CREATE_PRODUCT_MODAL_CLASS_NAMES.form}>
                    <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.fields}>
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

                    <OriginalProductPriceField priceUah={product.purchasePriceUah} pricingConfig={pricingConfig} />

                    <label className={CREATE_PRODUCT_MODAL_CLASS_NAMES.label}>
                        Закупочна ціна грн
                        <input
                            name={CREATE_PRODUCT_FIELD_NAMES.priceUah}
                            value={values.priceUah}
                            onChange={(event) => setFieldValue(CREATE_PRODUCT_FIELD_NAMES.priceUah, event.target.value)}
                            className={CREATE_PRODUCT_MODAL_CLASS_NAMES.input}
                            type="number"
                            min="0"
                            step="1"
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
                            disabled={!hasUsdToUahRate}
                            placeholder={hasUsdToUahRate ? undefined : "Немає курсу USD"}
                        />
                    </label>

                    <ProductPricingPreview priceUah={values.priceUah} pricingConfig={pricingConfig} />

                    <CategoryMultiSelect
                        options={categoryOptions}
                        selectedCategories={values.categories}
                        onToggle={toggleCategory}
                    />

                    <label className={CREATE_PRODUCT_MODAL_CLASS_NAMES.label}>
                        Опис
                        <textarea
                            name={CREATE_PRODUCT_FIELD_NAMES.description}
                            value={values.description}
                            onChange={(event) => setFieldValue(CREATE_PRODUCT_FIELD_NAMES.description, event.target.value)}
                            className={CREATE_PRODUCT_MODAL_CLASS_NAMES.textarea}
                        />
                    </label>

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
                            {values.keptImageUrls.map((imageUrl, index) => (
                                <div key={`${imageUrl}-${index}`} className={CREATE_PRODUCT_MODAL_CLASS_NAMES.existingImageItem}>
                                    <Image
                                        src={imageUrl}
                                        alt={`Фото товару ${index + 1}`}
                                        width={120}
                                        height={96}
                                        className={CREATE_PRODUCT_MODAL_CLASS_NAMES.existingImage}
                                    />
                                    <button
                                        type="button"
                                        className={CREATE_PRODUCT_MODAL_CLASS_NAMES.existingImageRemoveButton}
                                        onClick={() => removeExistingImage(imageUrl)}
                                        aria-label={`Видалити фото ${index + 1}`}
                                        disabled={isSubmitting}
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>
                            ))}
                            <ProductImagePreviews
                                images={values.image}
                                isDisabled={isSubmitting}
                                onRemove={removeSelectedImage}
                            />
                        </div>
                        <span className={CREATE_PRODUCT_MODAL_CLASS_NAMES.hint}>Нові фото додадуться до поточних.</span>
                        {values.image.length > 0 && (
                            <span className={CREATE_PRODUCT_MODAL_CLASS_NAMES.selectedImages}>
                                Вибрано нових фото: {values.image.length}
                            </span>
                        )}
                        {uploadProgress !== null && <ProductImageUploadProgress progress={uploadProgress} />}
                    </div>

                        {error && <p className={CREATE_PRODUCT_MODAL_CLASS_NAMES.error}>{error}</p>}
                    </div>

                    <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.actions}>
                        <button type="button" onClick={handleClose} className={CREATE_PRODUCT_MODAL_CLASS_NAMES.secondaryButton} disabled={isSubmitting}>
                            Скасувати
                        </button>
                        <button type="submit" className={CREATE_PRODUCT_MODAL_CLASS_NAMES.primaryButton} disabled={isSubmitting}>
                            {isSubmitting && <LoadingSpinnerIcon />}
                            {getSubmitButtonLabel(isSubmitting)}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body,
    );
};
