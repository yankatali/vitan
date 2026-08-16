export interface ContentfulEntriesResponse {
    items?: Array<{
        fields?: Record<string, unknown>;
    }>;
}

export interface AdminPasswordConfig {
    password: string;
    passwordHash: string;
}

export interface ContentfulAsset {
    url?: string | null;
    title?: string | null;
    description?: string | null;
}

export interface ContentfulProduct {
    sys: {
        id: string;
    };
    name?: string | null;
    description?: string | null;
    price?: number | null;
    category?: string[] | null;
    imagesCollection?: {
        items?: ContentfulAsset[] | null;
    } | null;
}

export interface ProductsGraphqlResponse {
    productCollection?: {
        total: number;
        items?: ContentfulProduct[] | null;
    } | null;
}

export interface PricingConfigGraphqlResponse {
    pricingConfigCollection?: {
        items?: Array<{
            usdToUahRate?: number | null;
            retailMarkup?: number | null;
            wholesaleMarkup?: number | null;
            wholesaleDescription?: string | null;
            optPrice?: number | null;
            descriptionAfterOptValid?: string | null;
        }> | null;
    } | null;
}
