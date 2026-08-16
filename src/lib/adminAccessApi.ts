import {ADMIN_LOGIN_API_PATH, ADMIN_LOGOUT_API_PATH} from "@/constants/admin";
import {ADMIN_REQUEST_HEADERS} from "@/lib/adminRequestHeaders";
import {getPayloadErrorMessage} from "@/lib/apiErrorMessage";
import type {SiteContent} from "@/constants/siteContent";

export const loginAdmin = async (password: string, copy: SiteContent["adminAccess"]) => {
    const response = await fetch(ADMIN_LOGIN_API_PATH, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...ADMIN_REQUEST_HEADERS,
        },
        body: JSON.stringify({password}),
    });
    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(getPayloadErrorMessage(payload, copy.loginRequestError));
    }
};

export const logoutAdmin = async (copy: SiteContent["adminAccess"]) => {
    const response = await fetch(ADMIN_LOGOUT_API_PATH, {
        method: "POST",
        headers: ADMIN_REQUEST_HEADERS,
    });

    if (!response.ok) {
        const payload: unknown = await response.json().catch(() => null);
        throw new Error(getPayloadErrorMessage(payload, copy.logoutRequestError));
    }
};
