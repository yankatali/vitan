export const PRODUCT_CARD_ACTION_CLASS_NAMES = {
    wrapper: "grid gap-2 pt-1",
    row: "grid max-w-full grid-cols-[1fr_auto] items-center gap-2",
    adminRow: "grid max-w-full grid-cols-[1fr_auto_auto_auto] items-center gap-2",
    cartButton: "vitan-accent-button inline-flex h-9 min-w-0 items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-[var(--radius-sm)] px-3 text-[13px] font-semibold leading-4 transition-transform duration-200 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50",
    activeCartButton: "inline-flex h-9 min-w-0 items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-[var(--radius-sm)] bg-[var(--vitan-tint)] px-3 text-[13px] font-semibold leading-4 text-[var(--accent-press)] transition-transform duration-200 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50",
    iconButton: "inline-flex h-9 w-9 min-w-9 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--fill)] p-0 text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--fill-secondary)] active:scale-[0.92] disabled:cursor-not-allowed disabled:opacity-50",
    dangerButton: "inline-flex h-9 w-9 min-w-9 items-center justify-center rounded-[var(--radius-sm)] bg-[rgba(255,59,48,0.12)] p-0 text-[var(--destructive)] transition-all duration-200 hover:bg-[rgba(255,59,48,0.2)] active:scale-[0.92] disabled:cursor-not-allowed disabled:opacity-50",
    activeFavoriteButton: "inline-flex h-9 w-9 min-w-9 items-center justify-center rounded-[var(--radius-sm)] bg-[rgba(255,45,85,0.14)] p-0 text-[var(--favorite)] transition-all duration-200 active:scale-[0.92]",
    error: "rounded-[var(--radius-sm)] bg-[rgba(255,59,48,0.1)] px-3 py-2 text-xs text-[var(--destructive)]",
};

export const PRODUCT_CARD_ACTION_LABELS = {
    addToCart: "В кошик",
    inCart: "У кошику",
    delete: "Видалити товар",
    favorite: "Додати у вибране",
    favoriteActive: "У вибраному",
    edit: "Змінити товар",
    deleting: "Видаляю...",
};
