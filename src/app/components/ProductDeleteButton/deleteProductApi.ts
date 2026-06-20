import {DELETE_PRODUCT_API_PATH, DELETE_PRODUCT_ERROR_MESSAGES} from "@/constants/deleteProduct";
import type {DeleteProductApiResponse} from "@/types/deleteProduct";

const getDeleteProductUrl = (productId: string) => {
    return `${DELETE_PRODUCT_API_PATH}/${encodeURIComponent(productId)}`;
};

const isDeleteProductApiResponse = (value: unknown): value is DeleteProductApiResponse => {
    if (!value || typeof value !== "object" || !("product" in value)) return false;

    const product = value.product;

    return Boolean(product && typeof product === "object" && "id" in product && typeof product.id === "string");
};

const getResponseErrorMessage = async (response: Response) => {
    const payload: unknown = await response.json();

    if (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string") {
        return payload.message;
    }

    return DELETE_PRODUCT_ERROR_MESSAGES.unableToDelete;
};

export const deleteProduct = async (productId: string) => {
    const response = await fetch(getDeleteProductUrl(productId), {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error(await getResponseErrorMessage(response));
    }

    const payload: unknown = await response.json();

    if (!isDeleteProductApiResponse(payload)) {
        throw new Error(DELETE_PRODUCT_ERROR_MESSAGES.unexpectedResponse);
    }

    return payload;
};
