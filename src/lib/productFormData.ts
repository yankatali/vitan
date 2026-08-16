import {CREATE_PRODUCT_FIELD_NAMES} from "@/constants/createProduct";

export const appendProductTextField = (formData: FormData, name: string, value: string) => {
    formData.append(name, value.trim());
};

export const appendProductCategoryFields = (formData: FormData, categories: string[]) => {
    for (const category of categories) {
        formData.append(CREATE_PRODUCT_FIELD_NAMES.categories, category);
    }
};

export const appendProductImageFields = (formData: FormData, images: File[]) => {
    for (const image of images) {
        formData.append(CREATE_PRODUCT_FIELD_NAMES.image, image);
    }
};
