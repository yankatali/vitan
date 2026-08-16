import {getContentfulFetchCacheOptions} from "@/lib/cache";
import {PRICING_CONFIG_QUERY} from "@/constants/contentfulQueries";
import type {PricingConfig} from "@/types/pricingConfig";

const space = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

interface PricingConfigGraphqlResponse {
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

export const getPricingConfig = async (revalidateSeconds?: number): Promise<PricingConfig | null> => {
    if (!space || !accessToken) return null;

    try {
        const response = await fetch(`https://graphql.contentful.com/content/v1/spaces/${space}`, {
            method: "POST",
            ...getContentfulFetchCacheOptions(revalidateSeconds),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({query: PRICING_CONFIG_QUERY}),
        });

        if (!response.ok) return null;

        const json = await response.json() as {data?: PricingConfigGraphqlResponse};
        const item = json.data?.pricingConfigCollection?.items?.[0];

        if (!item?.usdToUahRate) return null;

        return {
            usdToUahRate: item.usdToUahRate,
            retailMarkup: item.retailMarkup ?? 30,
            wholesaleMarkup: item.wholesaleMarkup ?? 15,
            wholesaleDescription: item.wholesaleDescription ?? "",
            optPrice: item.optPrice ?? 200,
            descriptionAfterOptValid: item.descriptionAfterOptValid ?? "",
        };
    } catch {
        return null;
    }
};
