import {NextRequest} from "next/server";
import {ADMIN_SETTINGS_TEXT_FIELD_MAX_LENGTH} from "@/constants/adminSettings";
import type {SiteContent} from "@/constants/siteContent";
import type {UpdatePricingConfigInput} from "@/types/pricingConfig";

const getNumberValue = (value: unknown) => {
    if (typeof value === "number") return value;
    if (typeof value === "string") return Number(value.replace(",", "."));

    return NaN;
};

const getTextValue = (value: unknown) => {
    return typeof value === "string" ? value.trim() : "";
};

export const getSettingsInput = async (
    request: NextRequest,
    copy: SiteContent["admin"],
): Promise<UpdatePricingConfigInput> => {
    const payload = await request.json() as Record<string, unknown>;
    const usdToUahRate = getNumberValue(payload.usdToUahRate);
    const retailMarkup = getNumberValue(payload.retailMarkup);
    const wholesaleMarkup = getNumberValue(payload.wholesaleMarkup);
    const optPrice = getNumberValue(payload.optPrice);
    const wholesaleDescription = getTextValue(payload.wholesaleDescription);
    const descriptionAfterOptValid = getTextValue(payload.descriptionAfterOptValid);

    if (
        !Number.isFinite(usdToUahRate)
        || usdToUahRate <= 0
        || !Number.isFinite(retailMarkup)
        || retailMarkup < 0
        || !Number.isFinite(wholesaleMarkup)
        || wholesaleMarkup < 0
        || !Number.isFinite(optPrice)
        || optPrice < 0
        || wholesaleDescription.length > ADMIN_SETTINGS_TEXT_FIELD_MAX_LENGTH
        || descriptionAfterOptValid.length > ADMIN_SETTINGS_TEXT_FIELD_MAX_LENGTH
    ) {
        throw new Error(copy.settingsInvalid);
    }

    return {
        usdToUahRate,
        retailMarkup,
        wholesaleMarkup,
        wholesaleDescription,
        optPrice,
        descriptionAfterOptValid,
    };
};
