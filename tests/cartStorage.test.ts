import {beforeEach, describe, it} from "node:test";
import assert from "node:assert/strict";
import {
    addProductToCart,
    clearCart,
    getCartItems,
    getCartPriceSnapshot,
    getCartQuantity,
    removeProductFromCart,
    setCartItems,
    updateCartQuantity,
} from "@/lib/cartStorage";
import {CART_STORAGE_KEY} from "@/constants/cart";
import {SAVED_PRODUCTS_CHANGE_EVENT} from "@/lib/savedProductsEvents";
import type {ItemConfig} from "@/types/item";

class TestLocalStorage {
    private values = new Map<string, string>();

    getItem(key: string) {
        return this.values.get(key) ?? null;
    }

    setItem(key: string, value: string) {
        this.values.set(key, value);
    }

    removeItem(key: string) {
        this.values.delete(key);
    }

    clear() {
        this.values.clear();
    }
}

let dispatchedEvents: string[];

const product = (overrides: Partial<ItemConfig> = {}): ItemConfig => ({
    id: "product-1",
    title: "Товар",
    description: "",
    category: "",
    imageUrl: "",
    ...overrides,
});

beforeEach(() => {
    const localStorage = new TestLocalStorage();
    dispatchedEvents = [];

    globalThis.window = ({
        localStorage,
        dispatchEvent: (event: Event) => {
            dispatchedEvents.push(event.type);
            return true;
        },
    } as unknown) as Window & typeof globalThis;
});

describe("cartStorage", () => {
    it("reads old cart format without dropping existing users' carts", () => {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(["a", "b"]));

        assert.deepEqual(getCartItems(), [
            {productId: "a", quantity: 1},
            {productId: "b", quantity: 1},
        ]);
    });

    it("normalizes duplicate cart entries and preserves the newest available price snapshot", () => {
        setCartItems([
            {productId: "a", quantity: 1, priceUah: 10, priceUahWholesale: 8},
            {productId: "a", quantity: 2, priceUah: 12},
            {productId: "b", quantity: 1},
        ]);

        assert.deepEqual(getCartItems(), [
            {productId: "a", quantity: 3, priceUah: 12, priceUahWholesale: 8},
            {productId: "b", quantity: 1},
        ]);
        assert.deepEqual(dispatchedEvents, [SAVED_PRODUCTS_CHANGE_EVENT]);
    });

    it("adds products, increments quantity, and updates public prices used by wholesale totals", () => {
        assert.equal(addProductToCart("a", 1, {priceUah: 30, priceUahWholesale: 26.5}), 1);
        assert.equal(addProductToCart("a", 2, {priceUah: 32, priceUahWholesale: 28}), 3);

        assert.deepEqual(getCartItems(), [
            {productId: "a", quantity: 3, priceUah: 32, priceUahWholesale: 28},
        ]);
        assert.equal(getCartQuantity("a"), 3);
    });

    it("removes items when quantity goes below one", () => {
        setCartItems([{productId: "a", quantity: 2}]);

        assert.deepEqual(updateCartQuantity("a", 0), []);
        assert.deepEqual(getCartItems(), []);
    });

    it("removes a single product and can clear the whole cart", () => {
        setCartItems([
            {productId: "a", quantity: 1},
            {productId: "b", quantity: 1},
        ]);

        assert.deepEqual(removeProductFromCart("a"), [{productId: "b", quantity: 1}]);
        clearCart();
        assert.deepEqual(getCartItems(), []);
    });

    it("ignores invalid stored data instead of crashing checkout or header counters", () => {
        window.localStorage.setItem(CART_STORAGE_KEY, "{bad json");
        assert.deepEqual(getCartItems(), []);

        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([{productId: "a", quantity: 1.5}]));
        assert.deepEqual(getCartItems(), []);
    });

    it("stores only public price snapshot fields for a product", () => {
        assert.deepEqual(
            getCartPriceSnapshot(product({purchasePriceUah: 20, priceUsd: 1, priceUah: 30, priceUahWholesale: 26.5})),
            {priceUah: 30, priceUahWholesale: 26.5},
        );
    });
});
