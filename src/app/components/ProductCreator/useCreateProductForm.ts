"use client";

import {ChangeEvent, FormEvent, useState} from "react";
import {EMPTY_CREATE_PRODUCT_FORM} from "@/constants/createProduct";
import {createProduct} from "@/app/components/ProductCreator/createProductApi";
import type {CreateProductFormValues, CreateProductTextField} from "@/types/createProduct";

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
        || values.categories.length
        || values.image.length,
    );
};

export const useCreateProductForm = (onProductCreated: () => void, onClose: () => void) => {
    const [values, setValues] = useState<CreateProductFormValues>(EMPTY_CREATE_PRODUCT_FORM);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const setFieldValue = (field: CreateProductTextField, value: string) => {
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

    const resetForm = () => {
        setValues(EMPTY_CREATE_PRODUCT_FORM);
        setError(null);
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
        setIsSubmitting(true);

        try {
            await createProduct(values);
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
        values,
    };
};
