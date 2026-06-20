import type {ItemConfig} from "@/types/item";

export interface CartStorageItem {
    productId: string;
    quantity: number;
}

export interface CartProductItem {
    product: ItemConfig;
    quantity: number;
}
