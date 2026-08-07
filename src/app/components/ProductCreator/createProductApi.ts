import {CREATE_PRODUCT_API_PATH, CREATE_PRODUCT_FIELD_NAMES} from "@/constants/createProduct";
import {sendFormDataRequest, type UploadProgressHandler} from "@/lib/formDataUpload";
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
    appendTextField(formData, CREATE_PRODUCT_FIELD_NAMES.price, values.priceUah);
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

export const createProduct = async (values: CreateProductFormValues, onUploadProgress?: UploadProgressHandler) => {
    return sendFormDataRequest<CreateProductApiResponse>({
        body: buildCreateProductFormData(values),
        fallbackErrorMessage: "Не вдалося створити товар.",
        isResponse: isCreateProductApiResponse,
        method: "POST",
        onUploadProgress,
        unexpectedResponseMessage: "Contentful повернув неочікувану відповідь.",
        url: CREATE_PRODUCT_API_PATH,
    });
};
