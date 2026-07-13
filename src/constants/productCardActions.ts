export const PRODUCT_CARD_ACTION_CLASS_NAMES = {
    wrapper: "flex w-full items-center gap-2",
    adminRow: "flex w-full items-center gap-2",
    cartButton: "vitan-accent-button inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] transition-transform duration-200 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50",
    activeCartButton: "vitan-accent-button inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] transition-transform duration-200 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50",
    iconButton: "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--fill)] p-0 text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--fill-secondary)] active:scale-[0.92] disabled:cursor-not-allowed disabled:opacity-50",
    dangerButton: "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--fill)] p-0 text-[var(--destructive)] transition-all duration-200 hover:bg-[rgba(255,59,48,0.2)] active:scale-[0.92] disabled:cursor-not-allowed disabled:opacity-50",
    error: "rounded-[var(--radius-md)] bg-[rgba(255,59,48,0.1)] px-3 py-2 text-xs text-[var(--destructive)]",
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
