import {CREATE_PRODUCT_FIELD_NAMES} from "@/constants/createProduct";
import {DELETE_PRODUCT_API_PATH} from "@/constants/deleteProduct";
import {UPDATE_PRODUCT_ERROR_MESSAGES} from "@/constants/updateProduct";
import {sendFormDataRequest, type UploadProgressHandler} from "@/lib/formDataUpload";
import type {UpdateProductApiResponse, UpdateProductFormValues} from "@/types/updateProduct";

const getUpdateProductUrl = (productId: string) => {
    return `${DELETE_PRODUCT_API_PATH}/${encodeURIComponent(productId)}`;
};

const appendTextField = (formData: FormData, name: string, value: string) => {
    formData.append(name, value.trim());
};

const appendCategoryFields = (formData: FormData, categories: string[]) => {
    for (const category of categories) {
        formData.append(CREATE_PRODUCT_FIELD_NAMES.categories, category);
    }
};

const appendKeptImageFields = (formData: FormData, imageUrls: string[]) => {
    for (const imageUrl of imageUrls) {
        formData.append("keptImageUrls", imageUrl);
    }
};

const buildUpdateProductFormData = (values: UpdateProductFormValues) => {
    const formData = new FormData();

    appendTextField(formData, CREATE_PRODUCT_FIELD_NAMES.name, values.name);
    appendTextField(formData, CREATE_PRODUCT_FIELD_NAMES.description, values.description);
    appendTextField(formData, CREATE_PRODUCT_FIELD_NAMES.price, values.priceUah);
    appendCategoryFields(formData, values.categories);
    appendKeptImageFields(formData, values.keptImageUrls);

    for (const image of values.image) {
        formData.append(CREATE_PRODUCT_FIELD_NAMES.image, image);
    }

    return formData;
};

const isUpdateProductApiResponse = (value: unknown): value is UpdateProductApiResponse => {
    if (!value || typeof value !== "object" || !("product" in value)) return false;

    const product = value.product;

    return Boolean(product && typeof product === "object" && "id" in product && typeof product.id === "string");
};

export const updateProduct = async (productId: string, values: UpdateProductFormValues, onUploadProgress?: UploadProgressHandler) => {
    return sendFormDataRequest<UpdateProductApiResponse>({
        body: buildUpdateProductFormData(values),
        fallbackErrorMessage: UPDATE_PRODUCT_ERROR_MESSAGES.unableToUpdate,
        isResponse: isUpdateProductApiResponse,
        method: "PUT",
        onUploadProgress,
        unexpectedResponseMessage: UPDATE_PRODUCT_ERROR_MESSAGES.unexpectedResponse,
        url: getUpdateProductUrl(productId),
    });
};
