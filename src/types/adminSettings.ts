import type {PricingConfig} from "@/types/pricingConfig";

export type AdminSettingsValues = Record<keyof PricingConfig, string>;

export interface AdminSettingsFieldConfig {
    field: keyof AdminSettingsValues;
    type: "number" | "text";
    min?: string;
    step?: string;
    maxLength?: number;
    required?: boolean;
}
