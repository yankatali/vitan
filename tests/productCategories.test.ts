import {describe, it} from "node:test";
import assert from "node:assert/strict";
import {getProductCategories, splitProductCategories} from "@/lib/productCategories";
import type {ItemConfig} from "@/types/item";

const product = (category: string, id = category): ItemConfig => ({
    id,
    title: "Товар",
    description: "",
    category,
    imageUrl: "",
});

describe("productCategories", () => {
    it("splits comma-separated categories, trims labels, and removes empty values", () => {
        assert.deepEqual(splitProductCategories(" Насіння, , Добрива,  Засоби "), [
            "Насіння",
            "Добрива",
            "Засоби",
        ]);
    });

    it("deduplicates product and fallback categories while preserving first-seen order", () => {
        assert.deepEqual(
            getProductCategories(
                [
                    product("Насіння, Добрива", "a"),
                    product("Добрива, Інше", "b"),
                ],
                ["Усі", "Насіння", ""],
            ),
            ["Усі", "Насіння", "Добрива", "Інше"],
        );
    });
});
