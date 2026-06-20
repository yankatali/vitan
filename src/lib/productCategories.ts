import type {ItemConfig} from "@/types/item";

export const splitProductCategories = (category: string) => {
    return category
        .split(",")
        .map(value => value.trim())
        .filter(Boolean);
};

export const getProductCategories = (items: ItemConfig[], fallbackCategories: string[] = []) => {
    const result = new Set(fallbackCategories.filter(Boolean));

    for (const item of items) {
        splitProductCategories(item.category).forEach(category => result.add(category));
    }

    return Array.from(result);
};
