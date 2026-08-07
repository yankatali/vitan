interface ContentfulValidationError {
    name?: unknown;
    value?: unknown;
    expected?: unknown;
    details?: unknown;
    path?: unknown;
}

interface ContentfulErrorPayload {
    message?: unknown;
    details?: {
        errors?: ContentfulValidationError[];
    };
}

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

const getContentfulValidationMessage = (payload: unknown) => {
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

        if (value && expected.length) {
            return `Категорія "${value}" недоступна. Оберіть одну з: ${expected.join(", ")}.`;
        }

        return "Обрана категорія недоступна в Contentful.";
    }

    const firstError = validationErrors[0];
    if (typeof firstError.details === "string") return firstError.details;

    return typeof contentfulPayload.message === "string" ? contentfulPayload.message : null;
};

export const getApiErrorMessage = (error: unknown, fallbackMessage: string) => {
    if (error instanceof Error && error.message) {
        return getContentfulValidationMessage(parseErrorMessagePayload(error.message)) ?? error.message;
    }

    if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
        return getContentfulValidationMessage(parseErrorMessagePayload(error.message)) ?? error.message;
    }

    return fallbackMessage;
};
