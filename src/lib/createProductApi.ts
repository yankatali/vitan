import {CREATE_PRODUCT_API_PATH, CREATE_PRODUCT_FIELD_NAMES} from "@/constants/createProduct";
import {sendFormDataRequest, type UploadProgressHandler} from "@/lib/formDataUpload";
import {appendProductCategoryFields, appendProductImageFields, appendProductTextField} from "@/lib/productFormData";
import type {SiteContent} from "@/constants/siteContent";
import type {CreateProductApiResponse, CreateProductFormValues} from "@/types/createProduct";

const buildCreateProductFormData = (values: CreateProductFormValues) => {
    const formData = new FormData();

    appendProductTextField(formData, CREATE_PRODUCT_FIELD_NAMES.name, values.name);
    appendProductTextField(formData, CREATE_PRODUCT_FIELD_NAMES.description, values.description);
    appendProductTextField(formData, CREATE_PRODUCT_FIELD_NAMES.price, values.priceUah);
    appendProductCategoryFields(formData, values.categories);
    appendProductImageFields(formData, values.image);

    return formData;
};

const isCreateProductApiResponse = (value: unknown): value is CreateProductApiResponse => {
    if (!value || typeof value !== "object" || !("product" in value)) return false;

    const product = value.product;

    return Boolean(product && typeof product === "object" && "id" in product && typeof product.id === "string");
};

export const createProduct = async (
    values: CreateProductFormValues,
    copy: SiteContent["createProduct"]["errors"],
    onUploadProgress?: UploadProgressHandler,
) => {
    return sendFormDataRequest<CreateProductApiResponse>({
        body: buildCreateProductFormData(values),
        fallbackErrorMessage: copy.unableToCreate,
        isResponse: isCreateProductApiResponse,
        method: "POST",
        onUploadProgress,
        unexpectedResponseMessage: copy.unexpectedResponse,
        url: CREATE_PRODUCT_API_PATH,
    });
};
