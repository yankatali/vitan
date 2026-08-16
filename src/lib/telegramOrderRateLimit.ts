import {
    TELEGRAM_ORDER_RATE_LIMIT_MAX_ATTEMPTS,
    TELEGRAM_ORDER_RATE_LIMIT_WINDOW_MS,
} from "@/constants/telegram";

interface TelegramOrderWindow {
    count: number;
    expiresAt: number;
}

const orderAttempts = new Map<string, TelegramOrderWindow>();

const getActiveWindow = (key: string, now: number) => {
    const window = orderAttempts.get(key);

    if (window && window.expiresAt > now) return window;

    const nextWindow = {
        count: 0,
        expiresAt: now + TELEGRAM_ORDER_RATE_LIMIT_WINDOW_MS,
    };

    orderAttempts.set(key, nextWindow);

    return nextWindow;
};

export const getTelegramOrderRateLimitKey = (request: Request) => {
    const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const realIp = request.headers.get("x-real-ip")?.trim();

    return forwardedFor || realIp || "unknown";
};

export const isTelegramOrderRateLimited = (key: string) => {
    return getActiveWindow(key, Date.now()).count >= TELEGRAM_ORDER_RATE_LIMIT_MAX_ATTEMPTS;
};

export const recordTelegramOrderAttempt = (key: string) => {
    getActiveWindow(key, Date.now()).count += 1;
};
