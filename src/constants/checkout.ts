export const TELEGRAM_ORDER_API_PATH = "/api/telegram";

export const CHECKOUT_FORM_FIELDS = [
    {id: "name", type: "text", required: true, rows: null},
    {id: "phone", type: "tel", required: true, rows: null},
    {id: "comment", type: "textarea", required: false, rows: 3},
] as const;
