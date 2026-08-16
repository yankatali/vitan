import {cache} from "react";
import {cf} from "@/lib/contentful";
import {
    CONTENTFUL_SITE_CONTENT_CONTENT_TYPE,
    CONTENTFUL_SITE_CONTENT_FIELD_IDS,
} from "@/constants/contentful";
import {SITE_CONTENT_ENTRY_NAME, type SiteContent} from "@/constants/siteContent";

let siteContentPromise: Promise<SiteContent> | null = null;

const isRecord = (value: unknown): value is Record<string, unknown> => {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
};

const isSiteContentEntryConfig = (config: unknown): config is SiteContent => {
    return isRecord(config);
};

const getSiteContentEntries = async () => {
    if (!cf) throw new Error("Contentful client is not configured.");

    const response = await cf.getEntries({
        content_type: CONTENTFUL_SITE_CONTENT_CONTENT_TYPE,
        [`fields.${CONTENTFUL_SITE_CONTENT_FIELD_IDS.name}`]: SITE_CONTENT_ENTRY_NAME,
        limit: 1,
    });

    if (response.items.length) return response.items;

    const fallbackResponse = await cf.getEntries({
        content_type: CONTENTFUL_SITE_CONTENT_CONTENT_TYPE,
        limit: 1,
    });

    return fallbackResponse.items;
};

const fetchSiteContentFromContentful = async (): Promise<SiteContent> => {
    const entries = await getSiteContentEntries();
    const config = entries[0]?.fields?.[CONTENTFUL_SITE_CONTENT_FIELD_IDS.config];

    if (!isSiteContentEntryConfig(config)) {
        throw new Error("Contentful siteContent config is missing.");
    }

    return config;
};

export const getSiteContent = cache(() => {
    siteContentPromise ??= fetchSiteContentFromContentful().catch(error => {
        siteContentPromise = null;
        throw error;
    });

    return siteContentPromise;
});
