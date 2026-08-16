import {TELEGRAM_API_ORIGIN} from "@/constants/telegram";

export const sendTelegramMessage = async (token: string, chatId: string, text: string) => {
    return fetch(`${TELEGRAM_API_ORIGIN}/bot${token}/sendMessage`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({chat_id: chatId, text, parse_mode: "HTML"}),
    });
};
