import {describe, it} from "node:test";
import assert from "node:assert/strict";
import {getUahPriceInputFromUsd, getUsdPriceInputFromUah} from "@/lib/priceInputSync";

describe("priceInputSync", () => {
    it("updates UAH input from USD input in real time using the configured rate", () => {
        assert.equal(getUahPriceInputFromUsd("2", 41.5), "83");
        assert.equal(getUahPriceInputFromUsd("2,5", 40), "100");
    });

    it("updates USD input from UAH input in real time using two decimals", () => {
        assert.equal(getUsdPriceInputFromUah("83", 41.5), "2.00");
        assert.equal(getUsdPriceInputFromUah("100,5", 40), "2.51");
    });

    it("keeps the paired field empty for blank, invalid, or missing-rate values", () => {
        assert.equal(getUahPriceInputFromUsd("", 41.5), "");
        assert.equal(getUahPriceInputFromUsd("abc", 41.5), "");
        assert.equal(getUahPriceInputFromUsd("2", null), "");
        assert.equal(getUsdPriceInputFromUah("", 41.5), "");
        assert.equal(getUsdPriceInputFromUah("100", 0), "");
    });
});
