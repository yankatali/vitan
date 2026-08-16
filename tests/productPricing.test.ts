import {describe, it} from "node:test";
import assert from "node:assert/strict";
import {getMarkedUpUahPrice, getUsdPriceFromUah} from "@/lib/productPricing";

describe("productPricing", () => {
    it("rounds kopiyky by the business rule after applying markup", () => {
        assert.equal(getMarkedUpUahPrice(1, 25), 1.5);
        assert.equal(getMarkedUpUahPrice(1, 49), 1.5);
        assert.equal(getMarkedUpUahPrice(1, 50), 2);
        assert.equal(getMarkedUpUahPrice(1, 65), 2);
        assert.equal(getMarkedUpUahPrice(100, 30), 130);
    });

    it("returns null when purchase price is missing instead of inventing a price", () => {
        assert.equal(getMarkedUpUahPrice(undefined, 30), null);
        assert.equal(getMarkedUpUahPrice(null, 30), null);
    });

    it("converts UAH purchase price to USD with two decimals", () => {
        assert.equal(getUsdPriceFromUah(80, 42), 1.9);
        assert.equal(getUsdPriceFromUah(2, 41.5), 0.05);
    });

    it("does not convert USD when the base UAH price or exchange rate is missing", () => {
        assert.equal(getUsdPriceFromUah(undefined, 42), null);
        assert.equal(getUsdPriceFromUah(80, null), null);
        assert.equal(getUsdPriceFromUah(80, 0), null);
    });
});
