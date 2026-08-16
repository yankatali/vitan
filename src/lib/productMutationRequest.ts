import {
    CREATE_PRODUCT_ALLOWED_IMAGE_TYPES,
    CREATE_PRODUCT_FIELD_NAMES,
    CREATE_PRODUCT_MAX_IMAGE_COUNT,
    CREATE_PRODUCT_MAX_IMAGE_SIZE,
    CREATE_PRODUCT_MAX_TOTAL_IMAGE_SIZE,
} from "@/constants/createProduct";
import {UPDATE_PRODUCT_KEPT_IMAGE_URLS_FIELD_NAME} from "@/constants/updateProduct";
import type {SiteContent} from "@/constants/siteContent";
import type {CreateProductInput} from "@/types/createProduct";
import type {UpdateProductInput} from "@/types/updateProduct";

const getStringFormValue = (formData: FormData, name: string) => {
    const value = formData.get(name);

    if (typeof value !== "string") return "";

    return value.trim();
};

const getCategories = (formData: FormData) => {
    return formData
        .getAll(CREATE_PRODUCT_FIELD_NAMES.categories)
        .filter(value => typeof value === "string")
        .map(category => category.trim())
        .filter(Boolean);
};

const getImages = (formData: FormData) => {
    return formData
        .getAll(CREATE_PRODUCT_FIELD_NAMES.image)
        .filter((value): value is File => value instanceof File && value.size > 0);
};

const getKeptImageUrls = (formData: FormData) => {
    return formData
        .getAll(UPDATE_PRODUCT_KEPT_IMAGE_URLS_FIELD_NAME)
        .filter((value): value is string => typeof value === "string")
        .map(value => value.trim())
        .filter(Boolean);
};

const getPrice = (value: string) => {
    const price = Number(value.replace(",", "."));

    if (!Number.isFinite(price) || price < 0 || !Number.isInteger(price)) return null;

    return price;
};

const getTotalImageSize = (images: File[]) => {
    return images.reduce((total, image) => total + image.size, 0);
};

const validateImages = (
    images: File[],
    copy: SiteContent["createProduct"]["errors"] | SiteContent["updateProduct"]["errors"],
) => {
    if (images.length > CREATE_PRODUCT_MAX_IMAGE_COUNT) {
        throw new Error(copy.oversizedImage);
    }

    if (images.some(image => !CREATE_PRODUCT_ALLOWED_IMAGE_TYPES.includes(image.type))) {
        throw new Error(copy.invalidImageType);
    }

    if (
        images.some(image => image.size > CREATE_PRODUCT_MAX_IMAGE_SIZE)
        || getTotalImageSize(images) > CREATE_PRODUCT_MAX_TOTAL_IMAGE_SIZE
    ) {
        throw new Error(copy.oversizedImage);
    }
};

export const getCreateProductInput = (
    formData: FormData,
    copy: SiteContent["createProduct"]["errors"],
): CreateProductInput => {
    const name = getStringFormValue(formData, CREATE_PRODUCT_FIELD_NAMES.name);
    const description = getStringFormValue(formData, CREATE_PRODUCT_FIELD_NAMES.description);
    const priceValue = getStringFormValue(formData, CREATE_PRODUCT_FIELD_NAMES.price);
    const price = getPrice(priceValue);
    const categories = getCategories(formData);
    const images = getImages(formData);

    if (!name) {
        throw new Error(copy.missingName);
    }

    if (price === null) {
        throw new Error(copy.invalidPrice);
    }

    validateImages(images, copy);

    return {
        name,
        description,
        price,
        categories,
        images,
    };
};

export const getUpdateProductInput = (
    formData: FormData,
    id: string,
    copy: SiteContent["updateProduct"]["errors"],
): UpdateProductInput => {
    const name = getStringFormValue(formData, CREATE_PRODUCT_FIELD_NAMES.name);
    const description = getStringFormValue(formData, CREATE_PRODUCT_FIELD_NAMES.description);
    const priceValue = getStringFormValue(formData, CREATE_PRODUCT_FIELD_NAMES.price);
    const price = getPrice(priceValue);
    const categories = getCategories(formData);
    const images = getImages(formData);

    if (!id) {
        throw new Error(copy.missingId);
    }

    if (!name) {
        throw new Error(copy.missingName);
    }

    if (price === null) {
        throw new Error(copy.invalidPrice);
    }

    validateImages(images, copy);

    return {
        id,
        name,
        description,
        price,
        categories,
        images,
        keptImageUrls: getKeptImageUrls(formData),
    };
};
