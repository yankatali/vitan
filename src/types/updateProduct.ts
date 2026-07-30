import type {ItemConfig} from "@/types/item";
import type {PricingConfig} from "@/types/pricingConfig";

export interface UpdateProductFormValues {
    name: string;
    description: string;
    price: string;
    priceUah: string;
    categories: string[];
    image: File[];
    keptImageUrls: string[];
}

export interface UpdateProductInput {
    id: string;
    name: string;
    description: string;
    price: number;
    categories: string[];
    images?: File[];
    keptImageUrls?: string[];
}

export interface UpdateProductResult {
    id: string;
    assetIds?: string[];
}

export interface UpdateProductApiResponse {
    product: UpdateProductResult;
}

export interface ProductEditModalProps {
    categoryOptions: string[];
    isOpen: boolean;
    onClose: () => void;
    onProductUpdated: () => void;
    pricingConfig?: PricingConfig | null;
    product: ItemConfig;
}

export interface UseUpdateProductFormParams {
    onClose: () => void;
    onProductUpdated: () => void;
    pricingConfig?: PricingConfig | null;
    product: ItemConfig;
}

export type UpdateProductTextField = Exclude<keyof UpdateProductFormValues, "categories" | "image" | "keptImageUrls">;
