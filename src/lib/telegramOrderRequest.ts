import {
    TELEGRAM_ORDER_MAX_COMMENT_LENGTH,
    TELEGRAM_ORDER_MAX_ITEM_QUANTITY,
    TELEGRAM_ORDER_MAX_ITEM_TITLE_LENGTH,
    TELEGRAM_ORDER_MAX_ITEMS,
    TELEGRAM_ORDER_MAX_NAME_LENGTH,
    TELEGRAM_ORDER_MAX_PHONE_LENGTH,
    TELEGRAM_ORDER_MAX_PRICE_LENGTH,
    TELEGRAM_ORDER_MAX_TOTAL_LENGTH,
    TELEGRAM_SITE_URL_ENV,
} from "@/constants/telegram";
import type {TelegramOrderItem, TelegramOrderPayload} from "@/types/telegram";

const isRecord = (value: unknown): value is Record<string, unknown> => {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
};

const getTrimmedString = (value: unknown, maxLength: number) => {
    if (typeof value !== "string") return "";

    return value.trim().slice(0, maxLength);
};

const getImageUrl = (value: unknown) => {
    const imageUrl = getTrimmedString(value, 2048);
    if (!imageUrl) return undefined;

    try {
        const url = new URL(imageUrl);

        return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : undefined;
    } catch {
        return undefined;
    }
};

const getOrderItem = (value: unknown): TelegramOrderItem | null => {
    if (!isRecord(value)) return null;

    const id = getTrimmedString(value.id, 128);
    const title = getTrimmedString(value.title, TELEGRAM_ORDER_MAX_ITEM_TITLE_LENGTH);
    const quantity = typeof value.quantity === "number" ? value.quantity : Number(value.quantity);
    const price = getTrimmedString(value.price, TELEGRAM_ORDER_MAX_PRICE_LENGTH);

    if (
        !id
        || !title
        || !price
        || !Number.isInteger(quantity)
        || quantity < 1
        || quantity > TELEGRAM_ORDER_MAX_ITEM_QUANTITY
    ) {
        return null;
    }

    return {
        id,
        title,
        quantity,
        price,
        imageUrl: getImageUrl(value.imageUrl),
    };
};

export const getTelegramOrderPayload = async (request: Request): Promise<TelegramOrderPayload | null> => {
    const payload: unknown = await request.json().catch(() => null);
    if (!isRecord(payload)) return null;

    const name = getTrimmedString(payload.name, TELEGRAM_ORDER_MAX_NAME_LENGTH);
    const phone = getTrimmedString(payload.phone, TELEGRAM_ORDER_MAX_PHONE_LENGTH);
    const comment = getTrimmedString(payload.comment, TELEGRAM_ORDER_MAX_COMMENT_LENGTH);
    const total = getTrimmedString(payload.total, TELEGRAM_ORDER_MAX_TOTAL_LENGTH);
    const items = Array.isArray(payload.items)
        ? payload.items.slice(0, TELEGRAM_ORDER_MAX_ITEMS).map(getOrderItem)
        : [];

    if (!name || !phone || !total || !items.length || items.some(item => item === null)) {
        return null;
    }

    return {
        name,
        phone,
        comment,
        items: items.filter((item): item is TelegramOrderItem => item !== null),
        total,
    };
};

export const getTelegramOrderSiteUrl = (request: Request) => {
    const configuredUrl = process.env[TELEGRAM_SITE_URL_ENV];
    if (configuredUrl) return configuredUrl.replace(/\/+$/g, "");

    return new URL(request.url).origin;
};
