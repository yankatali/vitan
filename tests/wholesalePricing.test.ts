import {describe, it} from "node:test";
import assert from "node:assert/strict";
import {
    getCartRetailTotal,
    getOptPrice,
    getProductPriceUah,
    getRetailPriceUah,
    getWholesaleDescriptionText,
    getWholesalePriceUah,
    getWholesaleTooltipText,
    isWholesaleEligible,
} from "@/lib/wholesalePricing";
import type {CartProductItem} from "@/types/cart";
import type {ItemConfig} from "@/types/item";
import type {PricingConfig} from "@/types/pricingConfig";

const pricingConfig: PricingConfig = {
    usdToUahRate: 42,
    retailMarkup: 30,
    wholesaleMarkup: 15,
    wholesaleDescription: "Оптова ціна діє від {opt_price} грн.",
    optPrice: 200,
    descriptionAfterOptValid: "Опт активний від {opt_price} грн.",
};

const product = (overrides: Partial<ItemConfig> = {}): ItemConfig => ({
    id: "product-1",
    title: "Товар",
    description: "",
    category: "",
    imageUrl: "",
    ...overrides,
});

describe("wholesalePricing", () => {
    it("uses Contentful opt threshold and falls back to the default threshold", () => {
        assert.equal(getOptPrice(pricingConfig), 200);
        assert.equal(getOptPrice(null), 200);
        assert.equal(isWholesaleEligible(199.99, pricingConfig), false);
        assert.equal(isWholesaleEligible(200, pricingConfig), true);
    });

    it("prefers public prices already prepared for the client", () => {
        const item = product({
            purchasePriceUah: 100,
            priceUah: 145,
            priceUahWholesale: 125,
        });

        assert.equal(getRetailPriceUah(item, pricingConfig), 145);
        assert.equal(getWholesalePriceUah(item, pricingConfig), 125);
        assert.equal(getProductPriceUah(item, false, pricingConfig), 145);
        assert.equal(getProductPriceUah(item, true, pricingConfig), 125);
    });

    it("calculates fallback prices from purchase UAH price when public prices are absent", () => {
        const item = product({purchasePriceUah: 10.2});

        assert.equal(getRetailPriceUah(item, pricingConfig), 13.5);
        assert.equal(getWholesalePriceUah(item, pricingConfig), 12);
    });

    it("falls back to retail price when wholesale price cannot be calculated", () => {
        const item = product({priceUah: 99, priceUahWholesale: null});

        assert.equal(getProductPriceUah(item, true, pricingConfig), 99);
    });

    it("calculates cart retail total using retail prices and quantities", () => {
        const items: CartProductItem[] = [
            {product: product({priceUah: 50, priceUahWholesale: 40}), quantity: 2},
            {product: product({id: "product-2", purchasePriceUah: 10}), quantity: 3},
        ];

        assert.equal(getCartRetailTotal(items, pricingConfig), 139);
    });

    it("renders wholesale copy from config and normalizes the old unit-based copy", () => {
        assert.equal(
            getWholesaleDescriptionText(pricingConfig),
            "Оптова ціна діє від 200 грн.",
        );
        assert.equal(
            getWholesaleDescriptionText({...pricingConfig, wholesaleDescription: ""}, "Опт від {opt_price} од."),
            "Опт від 200 грн",
        );
    });

    it("uses the active wholesale tooltip text when present and falls back to normal wholesale copy", () => {
        assert.equal(getWholesaleTooltipText(pricingConfig), "Опт активний від 200 грн.");
        assert.equal(
            getWholesaleTooltipText({...pricingConfig, descriptionAfterOptValid: ""}, "Опт від {opt_price} грн"),
            "Оптова ціна діє від 200 грн.",
        );
    });
});
