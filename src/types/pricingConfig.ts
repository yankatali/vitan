export interface PricingConfig {
    usdToUahRate: number;
    retailMarkup: number;
    wholesaleMarkup: number;
    wholesaleDescription: string;
    optPrice: number;
    descriptionAfterOptValid: string;
}

export type UpdatePricingConfigInput = PricingConfig;
