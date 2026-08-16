import type {ItemConfig} from "@/types/item";

export interface OrderProductItem {
    product: ItemConfig;
    quantity: number;
}

export const getOrderItems = (itemsParam: string, productsById: Map<string, ItemConfig>): OrderProductItem[] => {
    if (!itemsParam) return [];

    return itemsParam.split(",").flatMap(pair => {
        const [id, qty] = pair.split(":");
        const product = productsById.get(id);
        return product ? [{product, quantity: parseInt(qty, 10) || 1}] : [];
    });
};
