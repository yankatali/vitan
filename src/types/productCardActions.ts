import type {ItemConfig} from "@/types/item";
import type {PricingConfig} from "@/types/pricingConfig";

export interface ProductCardActionsProps {
    categoryOptions: string[];
    pricingConfig?: PricingConfig | null;
    showAdminActions?: boolean;
    showCartButton?: boolean;
    product: ItemConfig;
    onProductChanged: () => void;
}

export type UseProductCardActionsParams = Pick<ProductCardActionsProps, "onProductChanged" | "product">;
