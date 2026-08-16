import {DELETE_PRODUCT_API_PATH} from "@/constants/deleteProduct";
import {ADMIN_REQUEST_HEADERS} from "@/lib/adminRequestHeaders";
import type {SiteContent} from "@/constants/siteContent";
import type {DeleteProductApiResponse} from "@/types/deleteProduct";

const getDeleteProductUrl = (productId: string) => {
    return `${DELETE_PRODUCT_API_PATH}/${encodeURIComponent(productId)}`;
};

const isDeleteProductApiResponse = (value: unknown): value is DeleteProductApiResponse => {
    if (!value || typeof value !== "object" || !("product" in value)) return false;

    const product = value.product;

    return Boolean(product && typeof product === "object" && "id" in product && typeof product.id === "string");
};

const getResponseErrorMessage = async (response: Response, fallbackErrorMessage: string) => {
    const payload: unknown = await response.json();

    if (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string") {
        return payload.message;
    }

    return fallbackErrorMessage;
};

export const deleteProduct = async (productId: string, copy: SiteContent["deleteProduct"]["errors"]) => {
    const response = await fetch(getDeleteProductUrl(productId), {
        method: "DELETE",
        headers: ADMIN_REQUEST_HEADERS,
    });

    if (!response.ok) {
        throw new Error(await getResponseErrorMessage(response, copy.unableToDelete));
    }

    const payload: unknown = await response.json();

    if (!isDeleteProductApiResponse(payload)) {
        throw new Error(copy.unexpectedResponse);
    }

    return payload;
};
