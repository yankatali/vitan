import {describe, it} from "node:test";
import assert from "node:assert/strict";
import {getCategoriesFromProducts, getRelatedProducts} from "@/lib/relatedProducts";
import type {ItemConfig} from "@/types/item";

const product = (id: string, category: string): ItemConfig => ({
    id,
    title: id,
    description: "",
    category,
    imageUrl: "",
});

describe("relatedProducts", () => {
    it("extracts normalized categories from multi-category product labels", () => {
        assert.deepEqual(
            [...getCategoriesFromProducts([
                product("a", "Насіння, Добрива"),
                product("b", "Добрива, Захист"),
            ])],
            ["Насіння", "Добрива", "Захист"],
        );
    });

    it("prioritizes products from the same categories and excludes products already in the current list", () => {
        const products = [
            product("current", "Насіння"),
            product("fertilizer", "Добрива"),
            product("seed-1", "Насіння, Сад"),
            product("seed-2", "Насіння"),
            product("tools", "Інструменти"),
        ];

        assert.deepEqual(
            getRelatedProducts(new Set(["current"]), new Set(["Насіння"]), products).map(item => item.id),
            ["seed-1", "seed-2", "fertilizer", "tools"],
        );
    });

    it("falls back to catalog order when there are no target categories and respects the max limit", () => {
        assert.deepEqual(
            getRelatedProducts(new Set(["a"]), new Set(), [
                product("a", "Насіння"),
                product("b", "Добрива"),
                product("c", "Сад"),
            ], 1).map(item => item.id),
            ["b"],
        );
    });
});
