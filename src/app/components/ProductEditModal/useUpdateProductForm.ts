"use client";

import {ChangeEvent, FormEvent, useEffect, useMemo, useState} from "react";
import {splitProductCategories} from "@/lib/productCategories";
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
        || !areStringArraysEqual(values.categories, initialValues.categories)
        || !areStringArraysEqual(values.keptImageUrls, initialValues.keptImageUrls)
        || values.image.length > 0;
};

const getInitialValues = ({category, description, imageUrl, imageUrls, priceUsd, title}: UseUpdateProductFormParams["product"]): UpdateProductFormValues => {
    return {
        name: title,
        description,
        price: String(priceUsd),
        categories: splitProductCategories(category),
        image: [],
        keptImageUrls: imageUrls?.length ? imageUrls : imageUrl ? [imageUrl] : [],
    };
};

export const useUpdateProductForm = ({onClose, onProductUpdated, product}: UseUpdateProductFormParams) => {
    const initialValues = useMemo(() => getInitialValues(product), [product]);
    const [values, setValues] = useState<UpdateProductFormValues>(initialValues);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setValues(initialValues);
        setError(null);
    }, [initialValues]);

    const setFieldValue = (field: UpdateProductTextField, value: string) => {
        setValues(currentValues => ({
            ...currentValues,
            [field]: value,
        }));
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const images = Array.from(event.target.files ?? []);

        setValues(currentValues => ({
            ...currentValues,
            image: appendUniqueImages(currentValues.image, images),
        }));
        event.target.value = "";
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
        setIsSubmitting(true);

        try {
            await updateProduct(product.id, values);
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
        values,
    };
};
