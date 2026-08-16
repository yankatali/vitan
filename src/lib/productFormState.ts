import {splitProductCategories} from "@/lib/productCategories";
import {getProductImageUrls} from "@/lib/productImages";
import {getUsdPriceInputFromUah} from "@/lib/priceInputSync";
import type {CreateProductFormValues} from "@/types/createProduct";
import type {UpdateProductFormValues, UseUpdateProductFormParams} from "@/types/updateProduct";

const getFileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

export const appendUniqueImages = (currentImages: File[], nextImages: File[]) => {
    const imageKeys = new Set(currentImages.map(getFileKey));
    const uniqueNextImages = nextImages.filter(image => !imageKeys.has(getFileKey(image)));

    return [...currentImages, ...uniqueNextImages];
};

export const hasCreateProductFormDraft = (values: CreateProductFormValues) => {
    return Boolean(
        values.name.trim()
        || values.description.trim()
        || values.price.trim()
        || values.priceUah.trim()
        || values.categories.length
        || values.image.length,
    );
};

export const areStringArraysEqual = (left: string[], right: string[]) => {
    if (left.length !== right.length) return false;

    return left.every((value, index) => value === right[index]);
};

export const hasUpdateProductFormDraft = (values: UpdateProductFormValues, initialValues: UpdateProductFormValues) => {
    return values.name !== initialValues.name
        || values.description !== initialValues.description
        || values.price !== initialValues.price
        || values.priceUah !== initialValues.priceUah
        || !areStringArraysEqual(values.categories, initialValues.categories)
        || !areStringArraysEqual(values.keptImageUrls, initialValues.keptImageUrls)
        || values.image.length > 0;
};

export const getInitialUpdateProductFormValues = (
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
        keptImageUrls: getProductImageUrls(imageUrl, imageUrls),
    };
};
