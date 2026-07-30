import {NextRequest, NextResponse} from "next/server";

export interface TelegramOrderPayload {
    name: string;
    phone: string;
    comment: string;
    items: {id: string; title: string; quantity: number; price: string; imageUrl?: string}[];
    total: string;
}

export async function POST(req: NextRequest) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        return NextResponse.json({error: "Telegram not configured"}, {status: 500});
    }

    const body: TelegramOrderPayload = await req.json();

    const proto = req.headers.get("x-forwarded-proto") ?? "http";
    const host = req.headers.get("host") ?? "localhost:3000";
    const siteUrl = `${proto}://${host}`;

    // Build order page URL
    const itemsParam = body.items.map(i => `${i.id}:${i.quantity}`).join(",");
    const orderUrl = `${siteUrl}/order?items=${encodeURIComponent(itemsParam)}&name=${encodeURIComponent(body.name)}&phone=${encodeURIComponent(body.phone)}${body.comment ? `&comment=${encodeURIComponent(body.comment)}` : ""}`;

    const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const itemLines = body.items
        .map(item => {
            const title = item.imageUrl
                ? `<a href="${item.imageUrl}">${esc(item.title)}</a>`
                : esc(item.title);
            return `• ${title} × ${item.quantity} = ${item.price}`;
        })
        .join("\n");

    const text = [
        "🛍 Нове замовлення!",
        "",
        `👤 ${esc(body.name)}`,
        `📞 ${esc(body.phone)}`,
        body.comment ? `💬 ${esc(body.comment)}` : null,
        "",
        "📦 Товари:",
        itemLines,
        "",
        `💰 Сума: ${body.total}`,
        "",
        `🔗 ${orderUrl}`,
    ]
        .filter(l => l !== null)
        .join("\n");

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({chat_id: chatId, text, parse_mode: "HTML"}),
    });

    const result = await response.text();
    console.log("[Telegram] response:", response.status, result);

    if (!response.ok) {
        return NextResponse.json({error: result}, {status: 500});
    }

    return NextResponse.json({ok: true});
}
