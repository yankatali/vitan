import type {CreateProductFormValues} from "@/types/createProduct";

export const CREATE_PRODUCT_API_PATH = "/api/products/create";
export const CREATE_PRODUCT_MAX_IMAGE_SIZE = 10 * 1024 * 1024;
export const CREATE_PRODUCT_ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const CREATE_PRODUCT_FIELD_NAMES = {
    name: "name",
    description: "description",
    price: "price",
    categories: "categories",
    image: "image",
} satisfies Record<string, keyof CreateProductFormValues>;

export const CREATE_PRODUCT_ERROR_MESSAGES = {
    missingName: "Назва товару обов'язкова.",
    invalidPrice: "Ціна має бути числом більше або дорівнювати 0.",
    invalidImageType: "Формат фото має бути JPEG, PNG, WebP або GIF.",
    oversizedImage: "Фото має бути не більше 10 MB.",
    unableToCreate: "Не вдалося створити товар у Contentful.",
};

export const CREATE_PRODUCT_BUTTON_LABELS = {
    idle: "Створити товар",
    submitting: "Створюю...",
};

export const CREATE_PRODUCT_MODAL_CLASS_NAMES = {
    overlay: "fixed inset-0 z-[120] flex items-end justify-center overflow-y-auto bg-black/28 px-2 py-2 backdrop-blur-md min-[744px]:items-center min-[744px]:px-4 min-[744px]:py-6",
    panel: "vitan-sheet-panel relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-[var(--radius-2xl)]",
    grabber: "mx-auto mt-2 h-1.5 w-10 shrink-0 rounded-full bg-[var(--label-quaternary)]",
    header: "flex items-start justify-between gap-4 px-5 pb-3 pt-3 pr-14 min-[744px]:px-6",
    eyebrow: "text-xs uppercase tracking-[0.22em] text-[var(--text-secondary)]",
    title: "text-[20px] font-semibold leading-[25px] tracking-[-0.4px] text-[var(--text-primary)]",
    closeButton: "absolute right-5 top-5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--fill)] text-[var(--text-secondary)] transition-transform hover:scale-105 active:scale-[0.92]",
    form: "grid gap-4 overflow-y-auto px-5 pb-5 min-[744px]:px-6",
    label: "grid self-start gap-1.5 text-[13px] font-semibold leading-[18px] text-[var(--text-secondary)]",
    input: "rounded-[var(--radius-sm)] bg-[var(--fill-tertiary)] px-4 py-3 text-[17px] leading-[22px] text-[var(--text-primary)] shadow-[inset_0_0_0_1px_var(--separator)] outline-none transition-shadow focus:shadow-[inset_0_0_0_2px_var(--accent)]",
    textarea: "min-h-28 resize-y rounded-[var(--radius-sm)] bg-[var(--fill-tertiary)] px-4 py-3 text-[17px] leading-[22px] text-[var(--text-primary)] shadow-[inset_0_0_0_1px_var(--separator)] outline-none transition-shadow focus:shadow-[inset_0_0_0_2px_var(--accent)]",
    categorySelect: "group relative",
    categorySelectTrigger: "flex cursor-pointer list-none items-center justify-between gap-3 rounded-[var(--radius-sm)] bg-[var(--fill-tertiary)] px-4 py-3 text-[17px] font-normal leading-[22px] text-[var(--text-primary)] shadow-[inset_0_0_0_1px_var(--separator)] outline-none transition-shadow marker:hidden hover:shadow-[inset_0_0_0_1px_var(--text-tertiary)] [&::-webkit-details-marker]:hidden",
    categorySelectMenu: "liquid-popover absolute inset-x-0 top-[calc(100%+0.5rem)] z-[130] grid max-h-56 gap-1 overflow-y-auto rounded-[var(--radius-lg)] p-2",
    categorySelectEmpty: "px-3 py-2 text-xs font-normal text-[var(--text-tertiary)]",
    checkboxLabel: "flex items-center gap-3 rounded-[var(--radius-sm)] px-2 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--fill)]",
    checkbox: "h-5 w-5 rounded border-[var(--separator)] accent-[var(--accent)]",
    hint: "text-xs font-normal text-[var(--text-tertiary)]",
    selectedImages: "grid gap-1 text-xs font-normal text-[var(--text-tertiary)]",
    existingImages: "flex min-h-24 gap-2 overflow-x-auto rounded-[var(--radius-sm)] bg-[var(--fill-tertiary)] p-2 shadow-[inset_0_0_0_1px_var(--separator)]",
    existingImageItem: "relative h-20 w-24 shrink-0 overflow-hidden rounded-[var(--radius-sm)]",
    existingImage: "h-full w-full object-cover",
    existingImageRemoveButton: "absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--destructive)] text-white shadow-lg shadow-black/15",
    imageAddInput: "sr-only",
    imageAddTile: "flex h-20 w-24 shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-sm)] bg-[var(--fill)] text-[var(--text-secondary)] transition-transform hover:scale-[1.03] active:scale-[0.96]",
    error: "rounded-[var(--radius-sm)] bg-[rgba(255,59,48,0.1)] px-4 py-3 text-sm text-[var(--destructive)]",
    actions: "sticky bottom-0 z-10 -mx-5 flex flex-wrap justify-end gap-3 border-t border-[var(--separator)] bg-[var(--glass-tint-thick)] px-5 pb-1 pt-3 backdrop-blur-xl min-[744px]:-mx-6 min-[744px]:px-6",
    secondaryButton: "rounded-[var(--radius-capsule)] bg-[var(--fill)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition-transform hover:bg-[var(--fill-secondary)] active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50",
    primaryButton: "vitan-accent-button rounded-[var(--radius-capsule)] px-5 py-2.5 text-sm font-semibold transition-transform active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50",
    trigger: "vitan-accent-button flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-[0.94]",
};

export const EMPTY_CREATE_PRODUCT_FORM: CreateProductFormValues = {
    name: "",
    description: "",
    price: "",
    categories: [],
    image: [],
};
