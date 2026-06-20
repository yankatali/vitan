export const CONTENTFUL_SPACE_ID_ENV = "CONTENTFUL_SPACE_ID";
export const CONTENTFUL_MANAGEMENT_TOKEN_ENV = "CONTENTFUL_MANAGEMENT_TOKEN";
export const CONTENTFUL_ENVIRONMENT_ENV = "CONTENTFUL_ENVIRONMENT";
export const CONTENTFUL_DEFAULT_ENVIRONMENT = "master";
export const CONTENTFUL_DEFAULT_LOCALE = "en-US";
export const CONTENTFUL_PRODUCT_CONTENT_TYPE = "product";

export const CONTENTFUL_PRODUCT_FIELD_IDS = {
    name: "name",
    description: "description",
    price: "price",
    category: "category",
    images: "images",
};

export const CONTENTFUL_MISSING_ENV_MESSAGES: Record<string, string> = {
    [CONTENTFUL_MANAGEMENT_TOKEN_ENV]: "CONTENTFUL_MANAGEMENT_TOKEN не заданий у .env.local. Створення товарів потребує Contentful Management API token.",
    [CONTENTFUL_SPACE_ID_ENV]: "CONTENTFUL_SPACE_ID не заданий у .env.local.",
};
