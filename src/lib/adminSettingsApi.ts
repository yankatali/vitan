import {getPayloadErrorMessage} from "@/lib/apiErrorMessage";
import {ADMIN_SETTINGS_API_PATH} from "@/constants/adminSettings";
import {ADMIN_REQUEST_HEADERS} from "@/lib/adminRequestHeaders";
import type {SiteContent} from "@/constants/siteContent";
import type {PricingConfig} from "@/types/pricingConfig";
import type {AdminSettingsValues} from "@/constants/adminSettings";
import {getSettingsValues} from "@/lib/adminSettingsForm";

const isSettingsResponse = (payload: unknown): payload is {settings: PricingConfig} => {
    return Boolean(
        payload
        && typeof payload === "object"
        && "settings" in payload
        && payload.settings
        && typeof payload.settings === "object",
    );
};

export const fetchAdminSettings = async (copy: SiteContent["adminSettings"]) => {
    const response = await fetch(ADMIN_SETTINGS_API_PATH, {cache: "no-store"});
    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(getPayloadErrorMessage(payload, copy.loadError));
    }

    if (!isSettingsResponse(payload)) return null;

    return getSettingsValues(payload.settings);
};

export const saveAdminSettings = async (values: AdminSettingsValues, copy: SiteContent["adminSettings"]) => {
    const response = await fetch(ADMIN_SETTINGS_API_PATH, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...ADMIN_REQUEST_HEADERS,
        },
        body: JSON.stringify(values),
    });
    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(getPayloadErrorMessage(payload, copy.saveError));
    }

    if (!isSettingsResponse(payload)) return null;

    return getSettingsValues(payload.settings);
};
