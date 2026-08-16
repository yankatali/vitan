import type {SiteContent} from "@/types/siteContent";

export interface ContentfulValidationError {
    name?: unknown;
    value?: unknown;
    expected?: unknown;
    details?: unknown;
    path?: unknown;
}

export interface ContentfulErrorPayload {
    message?: unknown;
    details?: {
        errors?: ContentfulValidationError[];
    };
}

export type ContentfulErrorCopy = SiteContent["contentful"];
