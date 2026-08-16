export interface ItemConfig {
    id: string;
    sku?: string;
    slug?: string;
    title: string;
    description: string;
    category: string;
    purchasePriceUah?: number;
    priceUsd?: number;
    priceUah?: number | null;
    priceUahWholesale?: number | null;
    wholesaleDescription?: string;
    imageUrl: string;
    imageUrls?: string[];
    imageAlt?: string;
    imageAlts?: string[];
    isActive?: boolean;
}

export type {ItemComponentProps} from "@/types/props";
