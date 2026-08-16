"use client";

import {ChangeEvent, FormEvent, useEffect, useMemo, useState} from "react";
import {getUahPriceInputFromUsd, getUsdPriceInputFromUah} from "@/lib/priceInputSync";
import {appendUniqueImages, getInitialUpdateProductFormValues, hasUpdateProductFormDraft} from "@/lib/productFormState";
import {updateProduct} from "@/lib/updateProductApi";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import type {UpdateProductFormValues, UpdateProductTextField, UseUpdateProductFormParams} from "@/types/updateProduct";

export const useUpdateProductForm = ({onClose, onProductUpdated, pricingConfig, product}: UseUpdateProductFormParams) => {
    const usdToUahRate = pricingConfig?.usdToUahRate ?? null;
    const initialValues = useMemo(() => getInitialUpdateProductFormValues(product, usdToUahRate), [product, usdToUahRate]);
    const [values, setValues] = useState<UpdateProductFormValues>(initialValues);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const copy = useSiteContent().updateProduct;

    useEffect(() => {
        setValues(initialValues);
        setError(null);
        setUploadProgress(null);
    }, [initialValues]);

    const setFieldValue = (field: UpdateProductTextField, value: string) => {
        setValues(currentValues => {
            if (field === "price") {
                return {
                    ...currentValues,
                    price: value,
                    priceUah: getUahPriceInputFromUsd(value, usdToUahRate),
                };
            }

            if (field === "priceUah") {
                return {
                    ...currentValues,
                    price: getUsdPriceInputFromUah(value, usdToUahRate),
                    priceUah: value,
                };
            }

            return {
                ...currentValues,
                [field]: value,
            };
        });
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const images = Array.from(event.target.files ?? []);

        setValues(currentValues => ({
            ...currentValues,
            image: appendUniqueImages(currentValues.image, images),
        }));
        event.target.value = "";
    };

    const removeSelectedImage = (imageToRemove: File) => {
        setValues(currentValues => ({
            ...currentValues,
            image: currentValues.image.filter(image => image !== imageToRemove),
        }));
    };

    const toggleCategory = (category: string) => {
        setValues(currentValues => {
            const isSelected = currentValues.categories.includes(category);
            if (isSelected) {
                return {
                    ...currentValues,
                    categories: currentValues.categories.filter(currentCategory => currentCategory !== category),
                };
            }

            return {
                ...currentValues,
                categories: [...currentValues.categories, category],
            };
        });
    };

    const removeExistingImage = (imageUrl: string) => {
        setValues(currentValues => ({
            ...currentValues,
            keptImageUrls: currentValues.keptImageUrls.filter(currentImageUrl => currentImageUrl !== imageUrl),
        }));
    };

    const handleClose = () => {
        if (isSubmitting) return;

        setValues(initialValues);
        setError(null);
        setUploadProgress(null);
        onClose();
    };

    const handleBackdropClose = () => {
        if (isSubmitting) return;

        if (hasUpdateProductFormDraft(values, initialValues)) {
            setError(null);
            onClose();
            return;
        }

        handleClose();
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        setUploadProgress(values.image.length > 0 ? 0 : null);
        setIsSubmitting(true);

        try {
            await updateProduct(product.id, values, copy.errors, values.image.length > 0 ? setUploadProgress : undefined);
            setValues(currentValues => ({
                ...currentValues,
                image: [],
            }));
            onProductUpdated();
            onClose();
        } catch (submitError) {
            if (submitError instanceof Error) {
                setError(submitError.message);
            } else {
                setError(copy.errors.unableToUpdate);
            }
        } finally {
            setIsSubmitting(false);
            setUploadProgress(null);
        }
    };

    return {
        error,
        handleBackdropClose,
        handleClose,
        handleImageChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        toggleCategory,
        removeExistingImage,
        removeSelectedImage,
        uploadProgress,
        values,
    };
};
