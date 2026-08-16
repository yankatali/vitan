import {createPortal} from "react-dom";
import {ExistingProductImageItem} from "@/app/components/ProductEditModal/ExistingProductImageItem";
import {CREATE_PRODUCT_FIELD_NAMES, CREATE_PRODUCT_MODAL_CLASS_NAMES} from "@/constants/createProduct";
import {getUpdateProductSubmitButtonLabel} from "@/lib/productEditModalHelpers";
import {CloseIcon} from "@/app/components/icon/CloseIcon";
import {LoadingSpinnerIcon} from "@/app/components/icon/LoadingSpinnerIcon";
import {PlusIcon} from "@/app/components/icon/PlusIcon";
import {CategoryMultiSelect} from "@/app/components/CategoryMultiSelect/CategoryMultiSelect";
import {ProductImagePreviews} from "@/app/components/ProductImagePreviews/ProductImagePreviews";
import {ProductImageUploadProgress} from "@/app/components/ProductImagePreviews/ProductImageUploadProgress";
import {ProductPricingPreview} from "@/app/components/ProductPricingPreview/ProductPricingPreview";
import {useUpdateProductForm} from "@/hooks/useUpdateProductForm";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {useLockScroll} from "@/hooks/useLockScroll";
import {formatPricePair} from "@/lib/productPricingPreviewHelpers";
import type {ProductEditModalProps} from "@/types/updateProduct";
import type {OriginalProductPriceFieldProps} from "@/types/props";


const OriginalProductPriceField = ({priceUah, pricingConfig}: OriginalProductPriceFieldProps) => {
    const value = typeof priceUah === "number" ? formatPricePair(priceUah, pricingConfig) : "";
    const copy = useSiteContent().productForm;

    return (
        <label className={CREATE_PRODUCT_MODAL_CLASS_NAMES.label}>
            {copy.fields.originalPurchasePrice}
            <input
                value={value}
                className={CREATE_PRODUCT_MODAL_CLASS_NAMES.input}
                readOnly
            />
        </label>
    );
};

export const ProductEditModal = ({categoryOptions, isOpen, onClose, onProductUpdated, pricingConfig, product}: ProductEditModalProps) => {
    const hasUsdToUahRate = Boolean(pricingConfig?.usdToUahRate);
    const siteContent = useSiteContent();
    const copy = siteContent.productForm;

    useLockScroll(isOpen);
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
                        <h2 id="edit-product-title" className={CREATE_PRODUCT_MODAL_CLASS_NAMES.title}>{copy.editTitle}</h2>
                    </div>
                    <button type="button" onClick={handleClose} className={CREATE_PRODUCT_MODAL_CLASS_NAMES.closeButton} aria-label={copy.closeAriaLabel}>
                        <CloseIcon />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={CREATE_PRODUCT_MODAL_CLASS_NAMES.form}>
                    <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.fields}>
                        <label className={CREATE_PRODUCT_MODAL_CLASS_NAMES.label}>
                            {copy.fields.name}
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
                        {copy.fields.purchasePriceUah}
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
                        {copy.fields.purchasePriceUsd}
                        <input
                            name={CREATE_PRODUCT_FIELD_NAMES.price}
                            value={values.price}
                            onChange={(event) => setFieldValue(CREATE_PRODUCT_FIELD_NAMES.price, event.target.value)}
                            className={CREATE_PRODUCT_MODAL_CLASS_NAMES.input}
                            type="number"
                            min="0"
                            step="0.01"
                            disabled={!hasUsdToUahRate}
                            placeholder={hasUsdToUahRate ? undefined : copy.unavailableUsdRatePlaceholder}
                        />
                    </label>

                    <ProductPricingPreview priceUah={values.priceUah} pricingConfig={pricingConfig} />

                    <CategoryMultiSelect
                        options={categoryOptions}
                        selectedCategories={values.categories}
                        onToggle={toggleCategory}
                    />

                    <label className={CREATE_PRODUCT_MODAL_CLASS_NAMES.label}>
                        {copy.fields.description}
                        <textarea
                            name={CREATE_PRODUCT_FIELD_NAMES.description}
                            value={values.description}
                            onChange={(event) => setFieldValue(CREATE_PRODUCT_FIELD_NAMES.description, event.target.value)}
                            className={CREATE_PRODUCT_MODAL_CLASS_NAMES.textarea}
                        />
                    </label>

                    <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.label}>
                        <span>{copy.fields.photo}</span>
                        <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.existingImages}>
                            <label className={CREATE_PRODUCT_MODAL_CLASS_NAMES.imageAddTile} aria-label={copy.addPhotoAriaLabel}>
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
                                <ExistingProductImageItem
                                    key={`${imageUrl}-${index}`}
                                    imageUrl={imageUrl}
                                    index={index}
                                    isSubmitting={isSubmitting}
                                    onRemove={removeExistingImage}
                                />
                            ))}
                            <ProductImagePreviews
                                images={values.image}
                                isDisabled={isSubmitting}
                                onRemove={removeSelectedImage}
                            />
                        </div>
                        <span className={CREATE_PRODUCT_MODAL_CLASS_NAMES.hint}>{copy.newImagesHint}</span>
                        {values.image.length > 0 && (
                            <span className={CREATE_PRODUCT_MODAL_CLASS_NAMES.selectedImages}>
                                {copy.selectedNewImagesPrefix} {values.image.length}
                            </span>
                        )}
                        {uploadProgress !== null && <ProductImageUploadProgress progress={uploadProgress} />}
                    </div>

                        {error && <p className={CREATE_PRODUCT_MODAL_CLASS_NAMES.error}>{error}</p>}
                    </div>

                    <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.actions}>
                        <button type="button" onClick={handleClose} className={CREATE_PRODUCT_MODAL_CLASS_NAMES.secondaryButton} disabled={isSubmitting}>
                            {copy.cancelButton}
                        </button>
                        <button type="submit" className={CREATE_PRODUCT_MODAL_CLASS_NAMES.primaryButton} disabled={isSubmitting}>
                            {isSubmitting && <LoadingSpinnerIcon />}
                            {getUpdateProductSubmitButtonLabel(isSubmitting, siteContent.updateProduct.buttons)}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body,
    );
};
