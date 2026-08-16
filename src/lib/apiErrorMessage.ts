import type {ContentfulErrorCopy, ContentfulErrorPayload} from "@/types/apiError";


const isRecord = (value: unknown): value is Record<string, unknown> => {
    return Boolean(value && typeof value === "object");
};

const parseErrorMessagePayload = (message: string): unknown => {
    try {
        return JSON.parse(message);
    } catch {
        return null;
    }
};

const getContentfulValidationMessage = (payload: unknown, copy?: ContentfulErrorCopy) => {
    if (!isRecord(payload)) return null;

    const contentfulPayload = payload as ContentfulErrorPayload;
    const validationErrors = contentfulPayload.details?.errors;
    if (!Array.isArray(validationErrors) || !validationErrors.length) return null;

    const categoryError = validationErrors.find(error => {
        return Array.isArray(error.path) && error.path.includes("category");
    });

    if (categoryError) {
        const value = typeof categoryError.value === "string" ? categoryError.value : "";
        const expected = Array.isArray(categoryError.expected)
            ? categoryError.expected.filter((item): item is string => typeof item === "string")
            : [];

        if (value && expected.length && copy) {
            return copy.categoryUnavailableWithExpected
                .replace("{value}", value)
                .replace("{expected}", expected.join(", "));
        }

        return copy?.categoryUnavailable ?? null;
    }

    const firstError = validationErrors[0];
    if (typeof firstError.details === "string") return firstError.details;

    return typeof contentfulPayload.message === "string" ? contentfulPayload.message : null;
};

export const getApiErrorMessage = (error: unknown, fallbackMessage: string, contentfulCopy?: ContentfulErrorCopy) => {
    if (error instanceof Error && error.message) {
        return getContentfulValidationMessage(parseErrorMessagePayload(error.message), contentfulCopy) ?? error.message;
    }

    if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
        return getContentfulValidationMessage(parseErrorMessagePayload(error.message), contentfulCopy) ?? error.message;
    }

    return fallbackMessage;
};

export const getPayloadErrorMessage = (payload: unknown, fallbackMessage: string) => {
    if (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string") {
        return payload.message;
    }

    if (payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string") {
        return payload.error;
    }

    return fallbackMessage;
};
