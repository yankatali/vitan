import type {AdminSettingsValues} from "@/constants/adminSettings";
import type {PricingConfig} from "@/types/pricingConfig";

export const getSettingsValues = (settings: PricingConfig): AdminSettingsValues => ({
    usdToUahRate: String(settings.usdToUahRate),
    retailMarkup: String(settings.retailMarkup),
    wholesaleMarkup: String(settings.wholesaleMarkup),
    wholesaleDescription: settings.wholesaleDescription,
    optPrice: String(settings.optPrice),
    descriptionAfterOptValid: settings.descriptionAfterOptValid,
});
