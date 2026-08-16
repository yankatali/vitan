export interface RateLimitWindow {
    count: number;
    expiresAt: number;
}

export type LoginAttemptWindow = RateLimitWindow;
export type TelegramOrderWindow = RateLimitWindow;
