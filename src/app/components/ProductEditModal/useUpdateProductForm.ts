"use client";

import {ChangeEvent, FormEvent, useEffect, useMemo, useState} from "react";
import {splitProductCategories} from "@/lib/productCategories";
import {getUahPriceInputFromUsd, getUsdPriceInputFromUah} from "@/lib/priceInputSync";
import {updateProduct} from "@/app/components/ProductEditModal/updateProductApi";
import type {UpdateProductFormValues, UpdateProductTextField, UseUpdateProductFormParams} from "@/types/updateProduct";

const getFileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

const appendUniqueImages = (currentImages: File[], nextImages: File[]) => {
    const imageKeys = new Set(currentImages.map(getFileKey));
    const uniqueNextImages = nextImages.filter(image => !imageKeys.has(getFileKey(image)));

    return [...currentImages, ...uniqueNextImages];
};

const areStringArraysEqual = (left: string[], right: string[]) => {
    if (left.length !== right.length) return false;

    return left.every((value, index) => value === right[index]);
};

const hasFormDraft = (values: UpdateProductFormValues, initialValues: UpdateProductFormValues) => {
    return values.name !== initialValues.name
        || values.description !== initialValues.description
        || values.price !== initialValues.price
        || values.priceUah !== initialValues.priceUah
        || !areStringArraysEqual(values.categories, initialValues.categories)
        || !areStringArraysEqual(values.keptImageUrls, initialValues.keptImageUrls)
        || values.image.length > 0;
};

const getInitialValues = (
    {category, description, imageUrl, imageUrls, purchasePriceUah, title}: UseUpdateProductFormParams["product"],
    usdToUahRate: number | null,
): UpdateProductFormValues => {
    const priceUah = typeof purchasePriceUah === "number" ? String(purchasePriceUah) : "";

    return {
        name: title,
        description,
        price: getUsdPriceInputFromUah(priceUah, usdToUahRate),
        priceUah,
        categories: splitProductCategories(category),
        image: [],
        keptImageUrls: imageUrls?.length ? imageUrls : imageUrl ? [imageUrl] : [],
    };
};

export const useUpdateProductForm = ({onClose, onProductUpdated, pricingConfig, product}: UseUpdateProductFormParams) => {
    const usdToUahRate = pricingConfig?.usdToUahRate ?? null;
    const initialValues = useMemo(() => getInitialValues(product, usdToUahRate), [product, usdToUahRate]);
    const [values, setValues] = useState<UpdateProductFormValues>(initialValues);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);

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

        if (hasFormDraft(values, initialValues)) {
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
            await updateProduct(product.id, values, values.image.length > 0 ? setUploadProgress : undefined);
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
                setError("Не вдалося оновити товар.");
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
