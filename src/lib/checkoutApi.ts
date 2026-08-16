import {TELEGRAM_ORDER_API_PATH} from "@/constants/checkout";
import type {TelegramOrderPayload} from "@/types/telegram";

export const submitTelegramOrder = async (payload: TelegramOrderPayload, fallbackErrorMessage: string) => {
    const response = await fetch(TELEGRAM_ORDER_API_PATH, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(fallbackErrorMessage);
    }
};
