import {afterEach, describe, it} from "node:test";
import assert from "node:assert/strict";
import {pbkdf2Sync} from "node:crypto";

type AdminAuthModule = typeof import("../src/lib/adminAuth");

const originalEnv = {...process.env};
const originalFetch = globalThis.fetch;

const getPasswordHash = (password: string, salt: string, iterations = 1000) => {
    const hash = pbkdf2Sync(password, salt, iterations, 32, "sha256").toString("hex");

    return `pbkdf2-sha256:${iterations}:${salt}:${hash}`;
};

const loadAdminAuth = (fields: Record<string, string>) => {
    process.env.CONTENTFUL_SPACE_ID = "space-id";
    process.env.CONTENTFUL_ACCESS_TOKEN = "delivery-token";
    process.env.CONTENTFUL_ENVIRONMENT = "master";

    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
        assert.match(String(input), /\/spaces\/space-id\/environments\/master\/entries\?/);
        assert.equal((init?.headers as Record<string, string> | undefined)?.Authorization, "Bearer delivery-token");

        return new Response(JSON.stringify({
            items: [{fields}],
        }), {status: 200});
    }) as typeof fetch;

    const modulePath = require.resolve("@/lib/adminAuth");
    delete require.cache[modulePath];

    return require("@/lib/adminAuth") as AdminAuthModule;
};

afterEach(() => {
    process.env = {...originalEnv};
    globalThis.fetch = originalFetch;

    const modulePath = require.resolve("@/lib/adminAuth");
    delete require.cache[modulePath];
});

describe("adminAuth", () => {
    it("verifies PBKDF2 admin password hashes and rejects wrong passwords", async () => {
        const adminAuth = loadAdminAuth({
            adminPasswordHash: getPasswordHash("correct-password", "fixed-salt"),
        });

        assert.equal(await adminAuth.verifyAdminPassword("correct-password"), true);
        assert.equal(await adminAuth.verifyAdminPassword("wrong-password"), false);
    });

    it("rejects malformed hash configuration instead of granting access", async () => {
        const adminAuth = loadAdminAuth({
            adminPasswordHash: "pbkdf2-sha256:not-a-number:salt:hash",
        });

        assert.equal(await adminAuth.verifyAdminPassword("anything"), false);
    });

    it("invalidates existing admin session tokens when Contentful password hash changes", async () => {
        let fields = {
            adminPasswordHash: getPasswordHash("first-password", "first-salt"),
        };
        const adminAuth = loadAdminAuth(fields);

        const token = await adminAuth.createAdminSessionToken();
        assert.equal(typeof token, "string");
        assert.equal(await adminAuth.isValidAdminSessionToken(token ?? undefined), true);

        fields = {
            adminPasswordHash: getPasswordHash("second-password", "second-salt"),
        };
        globalThis.fetch = (async () => new Response(JSON.stringify({
            items: [{fields}],
        }), {status: 200})) as typeof fetch;

        assert.equal(await adminAuth.isValidAdminSessionToken(token ?? undefined), false);
    });

    it("rejects expired admin session tokens even when the signature is valid", async () => {
        const originalDateNow = Date.now;
        const issuedAt = 1_700_000_000_000;
        const adminAuth = loadAdminAuth({
            adminPasswordHash: getPasswordHash("correct-password", "fixed-salt"),
        });

        try {
            Date.now = () => issuedAt;
            const token = await adminAuth.createAdminSessionToken();

            Date.now = () => issuedAt + (60 * 60 * 24 * 401 * 1000);
            assert.equal(await adminAuth.isValidAdminSessionToken(token ?? undefined), false);
        } finally {
            Date.now = originalDateNow;
        }
    });

    it("does not create sessions or validate passwords when Contentful has no admin password configured", async () => {
        const adminAuth = loadAdminAuth({});

        assert.equal(await adminAuth.createAdminSessionToken(), null);
        assert.equal(await adminAuth.verifyAdminPassword("anything"), null);
        assert.equal(await adminAuth.isValidAdminSessionToken("v1.123.bad-signature"), false);
    });
});
