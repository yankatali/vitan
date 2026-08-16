import {describe, it} from "node:test";
import assert from "node:assert/strict";
import {getCheckoutCartProducts, getCheckoutPayloadItems, getCheckoutTotals} from "@/lib/checkoutProducts";
import type {CartProductItem} from "@/types/cart";
import type {ItemConfig} from "@/types/item";

const product = (overrides: Partial<ItemConfig> = {}): ItemConfig => ({
    id: "product-1",
    title: "Товар",
    description: "",
    category: "",
    imageUrl: "/fallback.jpg",
    priceUah: 30,
    priceUahWholesale: 25,
    ...overrides,
});

describe("checkoutProducts", () => {
    it("drops cart items for products removed from the catalog before checkout", () => {
        const productsById = new Map([["a", product({id: "a"})]]);

        assert.deepEqual(
            getCheckoutCartProducts([
                {productId: "a", quantity: 2},
                {productId: "missing", quantity: 1},
            ], productsById),
            [{product: productsById.get("a"), quantity: 2}],
        );
    });

    it("uses active wholesale prices in Telegram order payload and prefers the first gallery image", () => {
        const items: CartProductItem[] = [
            {product: product({id: "a", title: "Добриво", imageUrl: "/fallback.jpg", imageUrls: ["/main.jpg"]}), quantity: 3},
        ];

        assert.deepEqual(getCheckoutPayloadItems(items, true), [
            {id: "a", title: "Добриво", quantity: 3, price: "75,00 грн", imageUrl: "/main.jpg"},
        ]);
    });

    it("calculates total quantity and price for retail checkout", () => {
        const items: CartProductItem[] = [
            {product: product({id: "a", priceUah: 30}), quantity: 2},
            {product: product({id: "b", priceUah: 12.5}), quantity: 4},
        ];

        assert.deepEqual(getCheckoutTotals(items, false), {totalPrice: 110, totalQuantity: 6});
    });
});
