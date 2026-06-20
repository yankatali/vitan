import {CREATE_PRODUCT_FIELD_NAMES} from "@/constants/createProduct";
import {DELETE_PRODUCT_API_PATH} from "@/constants/deleteProduct";
import {UPDATE_PRODUCT_ERROR_MESSAGES} from "@/constants/updateProduct";
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
    appendTextField(formData, CREATE_PRODUCT_FIELD_NAMES.price, values.price);
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

const getResponseErrorMessage = async (response: Response) => {
    const payload: unknown = await response.json();

    if (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string") {
        return payload.message;
    }

    return UPDATE_PRODUCT_ERROR_MESSAGES.unableToUpdate;
};

export const updateProduct = async (productId: string, values: UpdateProductFormValues) => {
    const response = await fetch(getUpdateProductUrl(productId), {
        method: "PUT",
        body: buildUpdateProductFormData(values),
    });

    if (!response.ok) {
        throw new Error(await getResponseErrorMessage(response));
    }

    const payload: unknown = await response.json();

    if (!isUpdateProductApiResponse(payload)) {
        throw new Error(UPDATE_PRODUCT_ERROR_MESSAGES.unexpectedResponse);
    }

    return payload;
};
