import {cookies} from "next/headers";
import {createHmac, pbkdf2Sync, timingSafeEqual} from "crypto";
import {
    ADMIN_COOKIE_NAME,
    ADMIN_SESSION_CLOCK_TOLERANCE_MS,
    ADMIN_SESSION_MAX_AGE_MS,
    ADMIN_SESSION_MAX_AGE_SECONDS,
    ADMIN_SESSION_SECRET_ENV,
    DEFAULT_ADMIN_PASSWORD_FIELD,
    DEFAULT_ADMIN_PASSWORD_HASH_FIELD,
} from "@/constants/admin";
import {
    CONTENTFUL_DEFAULT_ENVIRONMENT,
    CONTENTFUL_ENVIRONMENT_ENV,
    CONTENTFUL_PRICING_CONFIG_CONTENT_TYPE,
    CONTENTFUL_SPACE_ID_ENV,
} from "@/constants/contentful";
import type {AdminPasswordConfig, ContentfulEntriesResponse} from "@/types/contentfulResponses";


const contentfulAccessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const contentfulSpaceId = process.env[CONTENTFUL_SPACE_ID_ENV];
const adminSessionSecret = process.env[ADMIN_SESSION_SECRET_ENV];

export const adminCookieOptions = {
    httpOnly: true,
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
};

const getContentfulEnvironmentId = () => {
    return process.env[CONTENTFUL_ENVIRONMENT_ENV] ?? CONTENTFUL_DEFAULT_ENVIRONMENT;
};

const getStringField = (fields: Record<string, unknown> | undefined, fieldId: string) => {
    const value = fields?.[fieldId];

    if (typeof value === "string") return value.trim();

    return "";
};

const getAdminPasswordConfigFromContentful = async (): Promise<AdminPasswordConfig> => {
    if (!contentfulSpaceId || !contentfulAccessToken) {
        return {
            password: "",
            passwordHash: "",
        };
    }

    const params = new URLSearchParams({
        content_type: CONTENTFUL_PRICING_CONFIG_CONTENT_TYPE,
        limit: "1",
    });

    const response = await fetch(
        `https://cdn.contentful.com/spaces/${contentfulSpaceId}/environments/${getContentfulEnvironmentId()}/entries?${params.toString()}`,
        {
            cache: "no-store",
            headers: {
                Authorization: `Bearer ${contentfulAccessToken}`,
            },
        },
    );

    if (!response.ok) {
        return {
            password: "",
            passwordHash: "",
        };
    }

    const payload = await response.json() as ContentfulEntriesResponse;
    const fields = payload.items?.[0]?.fields;

    return {
        password: getStringField(fields, DEFAULT_ADMIN_PASSWORD_FIELD),
        passwordHash: getStringField(fields, DEFAULT_ADMIN_PASSWORD_HASH_FIELD),
    };
};

const safeEqual = (left: string, right: string) => {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);

    if (leftBuffer.length !== rightBuffer.length) return false;

    return timingSafeEqual(leftBuffer, rightBuffer);
};

const getAdminSessionSigningKey = (passwordConfig: AdminPasswordConfig) => {
    const passwordMaterial = passwordConfig.passwordHash || passwordConfig.password;
    if (!passwordMaterial) return "";

    return adminSessionSecret ? `${adminSessionSecret}.${passwordMaterial}` : passwordMaterial;
};

const signAdminSession = (payload: string, signingKey: string) => {
    return createHmac("sha256", signingKey).update(payload).digest("hex");
};

const verifyPbkdf2Sha256Password = (password: string, passwordHash: string) => {
    const [algorithm, iterationsValue, salt, expectedHash] = passwordHash.split(":");
    const iterations = Number(iterationsValue);

    if (algorithm !== "pbkdf2-sha256" || !Number.isInteger(iterations) || iterations <= 0 || !salt || !expectedHash) {
        return false;
    }

    try {
        const expectedHashBuffer = Buffer.from(expectedHash, "hex");
        const actualHash = pbkdf2Sync(password, salt, iterations, expectedHashBuffer.length, "sha256").toString("hex");

        return safeEqual(actualHash, expectedHash);
    } catch {
        return false;
    }
};

export const createAdminSessionToken = async () => {
    const passwordConfig = await getAdminPasswordConfigFromContentful();
    const signingKey = getAdminSessionSigningKey(passwordConfig);
    if (!signingKey) return null;

    const payload = `v1.${Date.now()}`;
    const signature = signAdminSession(payload, signingKey);

    return `${payload}.${signature}`;
};

export const isValidAdminSessionToken = async (token?: string) => {
    if (!token) return false;

    const [version, issuedAtValue, signature] = token.split(".");
    if (version !== "v1" || !issuedAtValue || !signature) return false;

    const issuedAt = Number(issuedAtValue);
    if (!Number.isFinite(issuedAt)) return false;

    const now = Date.now();
    if (issuedAt > now + ADMIN_SESSION_CLOCK_TOLERANCE_MS) return false;
    if (now - issuedAt > ADMIN_SESSION_MAX_AGE_MS) return false;

    const passwordConfig = await getAdminPasswordConfigFromContentful();
    const signingKey = getAdminSessionSigningKey(passwordConfig);
    if (!signingKey) return false;

    return safeEqual(signature, signAdminSession(`${version}.${issuedAtValue}`, signingKey));
};

export const isAdminSession = async () => {
    const cookieStore = await cookies();

    return isValidAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
};

export const verifyAdminPassword = async (password: string) => {
    const passwordConfig = await getAdminPasswordConfigFromContentful();

    if (passwordConfig.passwordHash) {
        return verifyPbkdf2Sha256Password(password, passwordConfig.passwordHash);
    }

    if (!passwordConfig.password) return null;

    return safeEqual(password, passwordConfig.password);
};
