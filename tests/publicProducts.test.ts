import {describe, it} from "node:test";
import assert from "node:assert/strict";
import {getAdminProductsResult, getPublicProduct, getPublicProductsResult} from "@/lib/publicProducts";
import type {ItemConfig} from "@/types/item";
import type {PricingConfig} from "@/types/pricingConfig";
import type {ProductsResult} from "@/types/product";

const pricingConfig: PricingConfig = {
    usdToUahRate: 42,
    retailMarkup: 30,
    wholesaleMarkup: 15,
    wholesaleDescription: "Оптова ціна діє від {opt_price} грн.",
    optPrice: 200,
    descriptionAfterOptValid: "Опт вже активний",
};

const product = (overrides: Partial<ItemConfig> = {}): ItemConfig => ({
    id: "product-1",
    title: "Товар",
    description: "Опис",
    category: "Категорія",
    imageUrl: "/image.jpg",
    purchasePriceUah: 10,
    priceUsd: 0.24,
    ...overrides,
});

describe("publicProducts", () => {
    it("removes purchase price and USD purchase price from public product payload", () => {
        const publicProduct = getPublicProduct(product(), pricingConfig);

        assert.equal("purchasePriceUah" in publicProduct, false);
        assert.equal("priceUsd" in publicProduct, false);
    });

    it("calculates retail and wholesale public UAH prices from purchase price and config", () => {
        const publicProduct = getPublicProduct(product({purchasePriceUah: 10.2}), pricingConfig);

        assert.equal(publicProduct.priceUah, 13.5);
        assert.equal(publicProduct.priceUahWholesale, 12);
        assert.equal(publicProduct.wholesaleDescription, "Оптова ціна діє від 200 грн.");
    });

    it("preserves product collection metadata while transforming every public item", () => {
        const result: ProductsResult = {
            items: [product({id: "a"}), product({id: "b", purchasePriceUah: 20})],
            total: 5,
            skip: 2,
            limit: 2,
            hasMore: true,
        };

        const publicResult = getPublicProductsResult(result, pricingConfig);

        assert.deepEqual(
            {
                total: publicResult.total,
                skip: publicResult.skip,
                limit: publicResult.limit,
                hasMore: publicResult.hasMore,
            },
            {total: 5, skip: 2, limit: 2, hasMore: true},
        );
        assert.equal(publicResult.items.length, 2);
        assert.equal("purchasePriceUah" in publicResult.items[0], false);
        assert.equal(publicResult.items[1].priceUah, 26);
    });

    it("removes public derived prices from admin payload so edit forms use original purchase values", () => {
        const result = getAdminProductsResult({
            items: [
                product({
                    priceUah: 13,
                    priceUahWholesale: 11.5,
                    wholesaleDescription: "public copy",
                }),
            ],
            total: 1,
            skip: 0,
            limit: 1,
            hasMore: false,
        });

        assert.equal(result.items[0].purchasePriceUah, 10);
        assert.equal(result.items[0].priceUsd, 0.24);
        assert.equal("priceUah" in result.items[0], false);
        assert.equal("priceUahWholesale" in result.items[0], false);
        assert.equal("wholesaleDescription" in result.items[0], false);
    });
});
