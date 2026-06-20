import {
    CACHE_CONTROL_HEADER,
    CONTENTFUL_CACHE_ENABLED_ENV,
    CONTENTFUL_CACHE_ENABLED_VALUE,
    CONTENTFUL_REVALIDATE_SECONDS_ENV,
    DEFAULT_CONTENTFUL_REVALIDATE_SECONDS,
    NO_STORE_CACHE_CONTROL,
    STALE_WHILE_REVALIDATE_MULTIPLIER,
} from "@/constants/cache";
import type {CacheControlHeaders, ContentfulFetchCacheOptions} from "@/types/cache";

const getValidRevalidateSeconds = (value?: string) => {
    const parsedValue = Number(value);

    if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
        return DEFAULT_CONTENTFUL_REVALIDATE_SECONDS;
    }

    return parsedValue;
};

export const isContentfulCacheEnabled = () => {
    return process.env[CONTENTFUL_CACHE_ENABLED_ENV] === CONTENTFUL_CACHE_ENABLED_VALUE;
};

export const getContentfulRevalidateSeconds = () => {
    return getValidRevalidateSeconds(process.env[CONTENTFUL_REVALIDATE_SECONDS_ENV]);
};

export const getContentfulFetchCacheOptions = (
    revalidateSeconds = getContentfulRevalidateSeconds(),
    tags: string[] = [],
): ContentfulFetchCacheOptions => {
    if (!isContentfulCacheEnabled()) {
        return {cache: NO_STORE_CACHE_CONTROL};
    }

    return {
        next: {
            revalidate: revalidateSeconds,
            tags,
        },
    };
};

export const getProductsApiCacheHeaders = (): CacheControlHeaders => {
    if (!isContentfulCacheEnabled()) {
        return {[CACHE_CONTROL_HEADER]: NO_STORE_CACHE_CONTROL};
    }

    const revalidateSeconds = getContentfulRevalidateSeconds();

    return {
        [CACHE_CONTROL_HEADER]: `s-maxage=${revalidateSeconds}, stale-while-revalidate=${revalidateSeconds * STALE_WHILE_REVALIDATE_MULTIPLIER}`,
    };
};
