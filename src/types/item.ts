export interface ItemConfig {
    id: string;
    sku?: string;
    slug?: string;
    title: string;
    description: string;
    category: string;
    priceUsd: number;
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
    priceUsd?: number;
    priceUah?: number | null;
    category?: string;
    showProductActions?: boolean;
    showAdminActions?: boolean;
    onProductDeleted?: () => void;
}
