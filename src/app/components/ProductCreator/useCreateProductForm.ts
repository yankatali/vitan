"use client";

import {ChangeEvent, FormEvent, useState} from "react";
import {EMPTY_CREATE_PRODUCT_FORM} from "@/constants/createProduct";
import {createProduct} from "@/app/components/ProductCreator/createProductApi";
import {getUahPriceInputFromUsd, getUsdPriceInputFromUah} from "@/lib/priceInputSync";
import type {CreateProductFormValues, CreateProductTextField} from "@/types/createProduct";
import type {PricingConfig} from "@/types/pricingConfig";

const getFileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

const appendUniqueImages = (currentImages: File[], nextImages: File[]) => {
    const imageKeys = new Set(currentImages.map(getFileKey));
    const uniqueNextImages = nextImages.filter(image => !imageKeys.has(getFileKey(image)));

    return [...currentImages, ...uniqueNextImages];
};

const hasFormDraft = (values: CreateProductFormValues) => {
    return Boolean(
        values.name.trim()
        || values.description.trim()
        || values.price.trim()
        || values.priceUah.trim()
        || values.categories.length
        || values.image.length,
    );
};

export const useCreateProductForm = (onProductCreated: () => void, onClose: () => void, pricingConfig?: PricingConfig | null) => {
    const [values, setValues] = useState<CreateProductFormValues>(EMPTY_CREATE_PRODUCT_FORM);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const usdToUahRate = pricingConfig?.usdToUahRate ?? null;

    const setFieldValue = (field: CreateProductTextField, value: string) => {
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

    const resetForm = () => {
        setValues(EMPTY_CREATE_PRODUCT_FORM);
        setError(null);
        setUploadProgress(null);
    };

    const handleClose = () => {
        if (isSubmitting) return;

        resetForm();
        onClose();
    };

    const handleBackdropClose = () => {
        if (isSubmitting) return;

        if (hasFormDraft(values)) {
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
            await createProduct(values, values.image.length > 0 ? setUploadProgress : undefined);
            resetForm();
            onProductCreated();
            onClose();
        } catch (submitError) {
            if (submitError instanceof Error) {
                setError(submitError.message);
            } else {
                setError("Не вдалося створити товар.");
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
        removeSelectedImage,
        setFieldValue,
        toggleCategory,
        uploadProgress,
        values,
    };
};
