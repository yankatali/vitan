export type ContentfulFetchCacheOptions =
    | {cache: "no-store"}
    | {next: {revalidate: number; tags?: string[]}};

export type CacheControlHeaders = {
    "Cache-Control": string;
};
