export const DELETE_PRODUCT_API_PATH = "/api/products";

export const DELETE_PRODUCT_ERROR_MESSAGES = {
    missingId: "ID товару обов'язковий для видалення.",
    unableToDelete: "Не вдалося видалити товар у Contentful.",
    unexpectedResponse: "Contentful повернув неочікувану відповідь після видалення.",
};

export const DELETE_PRODUCT_BUTTON_LABELS = {
    idle: "Видалити",
    deleting: "Видаляю...",
};

export const DELETE_PRODUCT_CLASS_NAMES = {
    wrapper: "mt-3 grid gap-2",
    button: "liquid-button-danger rounded-full px-3 py-2 text-xs font-semibold text-[#8c2d1d] transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60",
    error: "text-xs text-[#8c2d1d]",
};

export const DELETE_PRODUCT_CONFIRM_TEXT = "Видалити товар з Contentful?";
