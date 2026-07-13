export interface ItemConfig {
    id: string;
    sku?: string;
    slug?: string;
    title: string;
    description: string;
    category: string;
    priceUsd?: number;
    priceUah: number | null;
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
    priceUsd?: number;
    priceUah?: number | null;
    priceUahWholesale?: number | null;
    wholesaleDescription?: string;
    category?: string;
    showProductActions?: boolean;
    showAdminActions?: boolean;
    onProductDeleted?: () => void;
}
