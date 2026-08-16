import {afterEach, describe, it} from "node:test";
import assert from "node:assert/strict";
import {
    clearAdminLoginRateLimit,
    getAdminLoginRateLimitKey,
    isAdminLoginRateLimited,
    recordFailedAdminLogin,
} from "@/lib/adminLoginRateLimit";
import {
    getTelegramOrderRateLimitKey,
    isTelegramOrderRateLimited,
    recordTelegramOrderAttempt,
} from "@/lib/telegramOrderRateLimit";

const originalDateNow = Date.now;

afterEach(() => {
    Date.now = originalDateNow;
});

describe("rate limits", () => {
    it("uses forwarded IPs before real IPs for admin login rate-limit keys", () => {
        const request = new Request("https://example.test", {
            headers: {
                "x-forwarded-for": "203.0.113.10, 198.51.100.1",
                "x-real-ip": "198.51.100.2",
            },
        });

        assert.equal(getAdminLoginRateLimitKey(request), "203.0.113.10");
    });

    it("blocks admin login after repeated failures and clears the block after successful login", () => {
        const key = "admin-test-key";
        clearAdminLoginRateLimit(key);

        for (let index = 0; index < 5; index += 1) {
            assert.equal(isAdminLoginRateLimited(key), false);
            recordFailedAdminLogin(key);
        }

        assert.equal(isAdminLoginRateLimited(key), true);
        clearAdminLoginRateLimit(key);
        assert.equal(isAdminLoginRateLimited(key), false);
    });

    it("starts a new admin login window after the old window expires", () => {
        const key = "admin-expiring-window";
        clearAdminLoginRateLimit(key);
        Date.now = () => 1_700_000_000_000;

        for (let index = 0; index < 5; index += 1) recordFailedAdminLogin(key);
        assert.equal(isAdminLoginRateLimited(key), true);

        Date.now = () => 1_700_000_000_000 + (16 * 60 * 1000);
        assert.equal(isAdminLoginRateLimited(key), false);
    });

    it("tracks Telegram order attempts separately from admin login attempts", () => {
        const request = new Request("https://example.test", {
            headers: {"x-real-ip": "198.51.100.50"},
        });
        const key = `${getTelegramOrderRateLimitKey(request)}-${Date.now()}`;

        for (let index = 0; index < 10; index += 1) {
            assert.equal(isTelegramOrderRateLimited(key), false);
            recordTelegramOrderAttempt(key);
        }

        assert.equal(isTelegramOrderRateLimited(key), true);
    });
});
