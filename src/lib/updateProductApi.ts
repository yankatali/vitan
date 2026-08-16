import {CREATE_PRODUCT_FIELD_NAMES} from "@/constants/createProduct";
import {DELETE_PRODUCT_API_PATH} from "@/constants/deleteProduct";
import {sendFormDataRequest, type UploadProgressHandler} from "@/lib/formDataUpload";
import {appendProductCategoryFields, appendProductImageFields, appendProductTextField} from "@/lib/productFormData";
import type {SiteContent} from "@/constants/siteContent";
import type {UpdateProductApiResponse, UpdateProductFormValues} from "@/types/updateProduct";

const getUpdateProductUrl = (productId: string) => {
    return `${DELETE_PRODUCT_API_PATH}/${encodeURIComponent(productId)}`;
};

const appendKeptImageFields = (formData: FormData, imageUrls: string[]) => {
    for (const imageUrl of imageUrls) {
        formData.append("keptImageUrls", imageUrl);
    }
};

const buildUpdateProductFormData = (values: UpdateProductFormValues) => {
    const formData = new FormData();

    appendProductTextField(formData, CREATE_PRODUCT_FIELD_NAMES.name, values.name);
    appendProductTextField(formData, CREATE_PRODUCT_FIELD_NAMES.description, values.description);
    appendProductTextField(formData, CREATE_PRODUCT_FIELD_NAMES.price, values.priceUah);
    appendProductCategoryFields(formData, values.categories);
    appendKeptImageFields(formData, values.keptImageUrls);
    appendProductImageFields(formData, values.image);

    return formData;
};

const isUpdateProductApiResponse = (value: unknown): value is UpdateProductApiResponse => {
    if (!value || typeof value !== "object" || !("product" in value)) return false;

    const product = value.product;

    return Boolean(product && typeof product === "object" && "id" in product && typeof product.id === "string");
};

export const updateProduct = async (
    productId: string,
    values: UpdateProductFormValues,
    copy: SiteContent["updateProduct"]["errors"],
    onUploadProgress?: UploadProgressHandler,
) => {
    return sendFormDataRequest<UpdateProductApiResponse>({
        body: buildUpdateProductFormData(values),
        fallbackErrorMessage: copy.unableToUpdate,
        isResponse: isUpdateProductApiResponse,
        method: "PUT",
        onUploadProgress,
        unexpectedResponseMessage: copy.unexpectedResponse,
        url: getUpdateProductUrl(productId),
    });
};
