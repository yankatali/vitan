import type {PricingConfig} from "@/types/pricingConfig";

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

export interface ItemComponentProps {
    categoryOptions?: string[];
    image: string;
    images?: string[];
    item?: ItemConfig;
    title: string;
    description?: string;
    purchasePriceUah?: number;
    priceUsd?: number;
    priceUah?: number | null;
    priceUahWholesale?: number | null;
    wholesaleDescription?: string;
    wholesaleActiveDescription?: string;
    wholesaleAsPrimary?: boolean;
    category?: string;
    showProductActions?: boolean;
    showAdminActions?: boolean;
    pricingConfig?: PricingConfig | null;
    onProductDeleted?: () => void;
}
