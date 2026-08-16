import {NextRequest, NextResponse} from "next/server";
import {sendTelegramMessage} from "@/lib/telegramApi";
import {getSiteContent} from "@/lib/siteContent";
import {getTelegramOrderMessage, getTelegramOrderUrl} from "@/lib/telegramOrder";
import {
    getTelegramOrderRateLimitKey,
    isTelegramOrderRateLimited,
    recordTelegramOrderAttempt,
} from "@/lib/telegramOrderRateLimit";
import {getTelegramOrderPayload, getTelegramOrderSiteUrl} from "@/lib/telegramOrderRequest";

export async function POST(req: NextRequest) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const rateLimitKey = getTelegramOrderRateLimitKey(req);

    if (!token || !chatId) {
        return NextResponse.json({error: "Telegram not configured"}, {status: 500});
    }

    if (isTelegramOrderRateLimited(rateLimitKey)) {
        return NextResponse.json({error: "Too many requests"}, {status: 429});
    }

    recordTelegramOrderAttempt(rateLimitKey);

    const body = await getTelegramOrderPayload(req);
    if (!body) {
        return NextResponse.json({error: "Invalid order payload"}, {status: 400});
    }

    const siteUrl = getTelegramOrderSiteUrl(req);
    const orderUrl = getTelegramOrderUrl(siteUrl, body);
    const response = await sendTelegramMessage(
        token,
        chatId,
        getTelegramOrderMessage(body, orderUrl, (await getSiteContent()).telegramOrder),
    );

    const result = await response.text();
    console.log("[Telegram] response:", response.status, result);

    if (!response.ok) {
        return NextResponse.json({error: result}, {status: 500});
    }

    return NextResponse.json({ok: true});
}
