import {describe, it} from "node:test";
import assert from "node:assert/strict";
import {getApiErrorMessage, getPayloadErrorMessage} from "@/lib/apiErrorMessage";
import type {SiteContent} from "@/types/siteContent";

const contentfulCopy: SiteContent["contentful"] = {
    missingManagementToken: "Немає токена",
    missingSpaceId: "Немає space id",
    categoryUnavailableWithExpected: "Категорія {value} недоступна. Доступні: {expected}.",
    categoryUnavailable: "Категорія недоступна.",
};

describe("apiErrorMessage", () => {
    it("turns Contentful category validation errors into customer-facing copy with allowed values", () => {
        const error = new Error(JSON.stringify({
            message: "Validation error",
            details: {
                errors: [{
                    path: ["fields", "category"],
                    value: "Архів",
                    expected: ["Насіння", "Добрива"],
                }],
            },
        }));

        assert.equal(
            getApiErrorMessage(error, "fallback", contentfulCopy),
            "Категорія Архів недоступна. Доступні: Насіння, Добрива.",
        );
    });

    it("falls back to detailed Contentful error text for non-category validation errors", () => {
        const error = new Error(JSON.stringify({
            message: "Validation error",
            details: {
                errors: [{details: "Назва товару обов'язкова"}],
            },
        }));

        assert.equal(getApiErrorMessage(error, "fallback", contentfulCopy), "Назва товару обов'язкова");
    });

    it("reads message and error fields from API payloads before using the fallback", () => {
        assert.equal(getPayloadErrorMessage({message: "Bad request"}, "fallback"), "Bad request");
        assert.equal(getPayloadErrorMessage({error: "Unauthorized"}, "fallback"), "Unauthorized");
        assert.equal(getPayloadErrorMessage({}, "fallback"), "fallback");
    });
});
