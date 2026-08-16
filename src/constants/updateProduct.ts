import type {UpdateProductFormValues} from "@/types/updateProduct";

export const UPDATE_PRODUCT_KEPT_IMAGE_URLS_FIELD_NAME = "keptImageUrls";

export const EMPTY_UPDATE_PRODUCT_IMAGE: Pick<UpdateProductFormValues, "image"> = {
    image: [],
};
