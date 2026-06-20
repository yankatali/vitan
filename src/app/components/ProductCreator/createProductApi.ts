import {CREATE_PRODUCT_API_PATH, CREATE_PRODUCT_FIELD_NAMES} from "@/constants/createProduct";
import type {CreateProductApiResponse, CreateProductFormValues} from "@/types/createProduct";

const appendTextField = (formData: FormData, name: string, value: string) => {
    formData.append(name, value.trim());
};

const appendCategoryFields = (formData: FormData, categories: string[]) => {
    for (const category of categories) {
        formData.append(CREATE_PRODUCT_FIELD_NAMES.categories, category);
    }
};

const buildCreateProductFormData = (values: CreateProductFormValues) => {
    const formData = new FormData();

    appendTextField(formData, CREATE_PRODUCT_FIELD_NAMES.name, values.name);
    appendTextField(formData, CREATE_PRODUCT_FIELD_NAMES.description, values.description);
    appendTextField(formData, CREATE_PRODUCT_FIELD_NAMES.price, values.price);
    appendCategoryFields(formData, values.categories);

    for (const image of values.image) {
        formData.append(CREATE_PRODUCT_FIELD_NAMES.image, image);
    }

    return formData;
};

const isCreateProductApiResponse = (value: unknown): value is CreateProductApiResponse => {
    if (!value || typeof value !== "object" || !("product" in value)) return false;

    const product = value.product;

    return Boolean(product && typeof product === "object" && "id" in product && typeof product.id === "string");
};

const getResponseErrorMessage = async (response: Response) => {
    const payload: unknown = await response.json();

    if (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string") {
        return payload.message;
    }

    return "Не вдалося створити товар.";
};

export const createProduct = async (values: CreateProductFormValues) => {
    const response = await fetch(CREATE_PRODUCT_API_PATH, {
        method: "POST",
        body: buildCreateProductFormData(values),
    });

    if (!response.ok) {
        throw new Error(await getResponseErrorMessage(response));
    }

    const payload: unknown = await response.json();

    if (!isCreateProductApiResponse(payload)) {
        throw new Error("Contentful повернув неочікувану відповідь.");
    }

    return payload;
};
