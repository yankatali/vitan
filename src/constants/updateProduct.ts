import type {UpdateProductFormValues} from "@/types/updateProduct";

export const UPDATE_PRODUCT_ERROR_MESSAGES = {
    missingId: "ID товару обов'язковий для редагування.",
    missingName: "Назва товару обов'язкова.",
    invalidPrice: "Ціна має бути числом більше або дорівнювати 0.",
    invalidImageType: "Формат фото має бути JPEG, PNG, WebP або GIF.",
    oversizedImage: "Фото має бути не більше 10 MB.",
    unableToUpdate: "Не вдалося оновити товар у Contentful.",
    unexpectedResponse: "Contentful повернув неочікувану відповідь після оновлення.",
};

export const UPDATE_PRODUCT_BUTTON_LABELS = {
    idle: "Зберегти зміни",
    submitting: "Зберігаю...",
};

export const EMPTY_UPDATE_PRODUCT_IMAGE: Pick<UpdateProductFormValues, "image"> = {
    image: [],
};
