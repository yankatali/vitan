import type {ItemConfig} from "@/types/item";

export interface ProductCardActionsProps {
    categoryOptions: string[];
    showAdminActions?: boolean;
    product: ItemConfig;
    onProductChanged: () => void;
}

export type UseProductCardActionsParams = Pick<ProductCardActionsProps, "onProductChanged" | "product">;
