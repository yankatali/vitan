import type {ItemConfig} from "@/types/item";

export interface CartStorageItem {
    productId: string;
    quantity: number;
    priceUah?: number | null;
    priceUahWholesale?: number | null;
}

export interface CartProductItem {
    product: ItemConfig;
    quantity: number;
}
