import type {ItemConfig} from "@/types/item";
import {splitProductCategories} from "@/lib/productCategories";

export const getCategoriesFromProducts = (products: ItemConfig[]): Set<string> => {
    const categories = new Set<string>();

    products.forEach(product => {
        splitProductCategories(product.category).forEach(category => categories.add(category));
    });

    return categories;
};

export const getRelatedProducts = (
    excludeIds: Set<string>,
    targetCategories: Set<string>,
    allProducts: ItemConfig[],
    max = 20,
): ItemConfig[] => {
    const candidates = allProducts.filter(product => !excludeIds.has(product.id));
    if (!targetCategories.size) return candidates.slice(0, max);

    const matching: ItemConfig[] = [];
    const others: ItemConfig[] = [];

    candidates.forEach(product => {
        const productCategories = splitProductCategories(product.category);
        if (productCategories.some(category => targetCategories.has(category))) {
            matching.push(product);
            return;
        }

        others.push(product);
    });

    return [...matching, ...others].slice(0, max);
};
