import type {TelegramOrderPayload} from "@/types/telegram";
import type {SiteContent} from "@/constants/siteContent";

export const getTelegramOrderUrl = (siteUrl: string, body: TelegramOrderPayload) => {
    const itemsParam = body.items.map(item => `${item.id}:${item.quantity}`).join(",");
    const params = new URLSearchParams({
        items: itemsParam,
        name: body.name,
        phone: body.phone,
    });

    if (body.comment) {
        params.set("comment", body.comment);
    }

    return `${siteUrl}/order?${params.toString()}`;
};

const escapeHtml = (value: string) => {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

export const getTelegramOrderMessage = (
    body: TelegramOrderPayload,
    orderUrl: string,
    copy: SiteContent["telegramOrder"],
) => {
    const itemLines = body.items
        .map(item => {
            const title = item.imageUrl
                ? `<a href="${item.imageUrl}">${escapeHtml(item.title)}</a>`
                : escapeHtml(item.title);

            return `• ${title} × ${item.quantity} = ${item.price}`;
        })
        .join("\n");

    return [
        copy.title,
        "",
        `👤 ${escapeHtml(body.name)}`,
        `📞 ${escapeHtml(body.phone)}`,
        body.comment ? `💬 ${escapeHtml(body.comment)}` : null,
        "",
        copy.productsTitle,
        itemLines,
        "",
        `${copy.totalPrefix} ${body.total}`,
        "",
        `🔗 ${orderUrl}`,
    ]
        .filter(line => line !== null)
        .join("\n");
};
