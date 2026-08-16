import {NextRequest} from "next/server";
import {ADMIN_REQUEST_HEADER_NAME, ADMIN_REQUEST_HEADER_VALUE} from "@/constants/admin";

const getRequestOrigin = (request: Request) => {
    const url = new URL(request.url);

    return url.origin;
};

const isSameOriginHeader = (value: string | null, targetOrigin: string) => {
    if (!value) return true;

    try {
        return new URL(value).origin === targetOrigin;
    } catch {
        return false;
    }
};

const isSafeFetchSite = (value: string | null) => {
    return !value || value === "same-origin" || value === "none";
};

export const isAdminRequestSecurityValid = (request: NextRequest | Request) => {
    const headers = request.headers;

    if (headers.get(ADMIN_REQUEST_HEADER_NAME) !== ADMIN_REQUEST_HEADER_VALUE) {
        return false;
    }

    if (!isSafeFetchSite(headers.get("sec-fetch-site"))) {
        return false;
    }

    const targetOrigin = getRequestOrigin(request);
    const origin = headers.get("origin");
    const referer = headers.get("referer");

    return isSameOriginHeader(origin, targetOrigin) && isSameOriginHeader(referer, targetOrigin);
};
