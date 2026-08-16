import type {PricingConfig} from "@/types/pricingConfig";

export const ADMIN_SETTINGS_API_PATH = "/api/admin/settings";
export const ADMIN_SETTINGS_TEXT_FIELD_MAX_LENGTH = 256;

export type AdminSettingsValues = Record<keyof PricingConfig, string>;

export interface AdminSettingsFieldConfig {
    field: keyof AdminSettingsValues;
    type: "number" | "text";
    min?: string;
    step?: string;
    maxLength?: number;
    required?: boolean;
}

export const EMPTY_SETTINGS_VALUES: AdminSettingsValues = {
    usdToUahRate: "",
    retailMarkup: "",
    wholesaleMarkup: "",
    wholesaleDescription: "",
    optPrice: "",
    descriptionAfterOptValid: "",
};

export const ADMIN_SETTINGS_FIELDS: AdminSettingsFieldConfig[] = [
    {field: "usdToUahRate", type: "number", min: "0.01", step: "0.01", required: true},
    {field: "retailMarkup", type: "number", min: "0", step: "0.01", required: true},
    {field: "wholesaleMarkup", type: "number", min: "0", step: "0.01", required: true},
    {field: "wholesaleDescription", type: "text", maxLength: ADMIN_SETTINGS_TEXT_FIELD_MAX_LENGTH},
    {field: "optPrice", type: "number", min: "0", step: "0.01", required: true},
    {field: "descriptionAfterOptValid", type: "text", maxLength: ADMIN_SETTINGS_TEXT_FIELD_MAX_LENGTH},
];
