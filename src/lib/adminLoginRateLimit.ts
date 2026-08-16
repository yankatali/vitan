import {
    ADMIN_LOGIN_RATE_LIMIT_MAX_ATTEMPTS,
    ADMIN_LOGIN_RATE_LIMIT_WINDOW_MS,
} from "@/constants/admin";

interface LoginAttemptWindow {
    count: number;
    expiresAt: number;
}

const loginAttempts = new Map<string, LoginAttemptWindow>();

const getActiveWindow = (key: string, now: number) => {
    const window = loginAttempts.get(key);

    if (window && window.expiresAt > now) return window;

    const nextWindow = {
        count: 0,
        expiresAt: now + ADMIN_LOGIN_RATE_LIMIT_WINDOW_MS,
    };

    loginAttempts.set(key, nextWindow);

    return nextWindow;
};

export const getAdminLoginRateLimitKey = (request: Request) => {
    const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const realIp = request.headers.get("x-real-ip")?.trim();

    return forwardedFor || realIp || "unknown";
};

export const isAdminLoginRateLimited = (key: string) => {
    const now = Date.now();
    const window = getActiveWindow(key, now);

    return window.count >= ADMIN_LOGIN_RATE_LIMIT_MAX_ATTEMPTS;
};

export const recordFailedAdminLogin = (key: string) => {
    const now = Date.now();
    const window = getActiveWindow(key, now);

    window.count += 1;
};

export const clearAdminLoginRateLimit = (key: string) => {
    loginAttempts.delete(key);
};
