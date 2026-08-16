export interface TelegramOrderItem {
    id: string;
    title: string;
    quantity: number;
    price: string;
    imageUrl?: string;
}

export interface TelegramOrderPayload {
    name: string;
    phone: string;
    comment: string;
    items: TelegramOrderItem[];
    total: string;
}
