import {describe, it} from "node:test";
import assert from "node:assert/strict";
import {getCartProducts, getCleanCartItems, shouldSaveCleanCartItems} from "@/lib/cartProducts";
import type {CartStorageItem} from "@/types/cart";
import type {ItemConfig} from "@/types/item";

const product = (overrides: Partial<ItemConfig> = {}): ItemConfig => ({
    id: "product-1",
    title: "Товар",
    description: "",
    category: "",
    imageUrl: "",
    priceUah: 30,
    priceUahWholesale: 26,
    ...overrides,
});

describe("cartProducts", () => {
    it("builds cart rows only for products that still exist in the catalog", () => {
        const productsById = new Map([
            ["a", product({id: "a", title: "Насіння"})],
        ]);

        assert.deepEqual(
            getCartProducts([
                {productId: "a", quantity: 2},
                {productId: "deleted", quantity: 1},
            ], productsById),
            [{product: productsById.get("a"), quantity: 2}],
        );
    });

    it("refreshes cart price snapshots from current public product prices", () => {
        const productsById = new Map([
            ["a", product({id: "a", priceUah: 45, priceUahWholesale: 39})],
        ]);

        assert.deepEqual(
            getCleanCartItems([{productId: "a", quantity: 3, priceUah: 40}], productsById),
            [{productId: "a", quantity: 3, priceUah: 45, priceUahWholesale: 39}],
        );
    });

    it("saves cleaned cart data only when stale products or stale prices were found", () => {
        const cleanItems: CartStorageItem[] = [{productId: "a", quantity: 1, priceUah: 45, priceUahWholesale: 39}];

        assert.equal(shouldSaveCleanCartItems(cleanItems, cleanItems), false);
        assert.equal(shouldSaveCleanCartItems(cleanItems, [{productId: "a", quantity: 1, priceUah: 40}]), true);
        assert.equal(shouldSaveCleanCartItems(cleanItems, [...cleanItems, {productId: "deleted", quantity: 1}]), true);
    });
});
