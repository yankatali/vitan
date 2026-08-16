import {isCatalogSortOption} from "@/lib/catalogSort";
import type {CatalogSortOption} from "@/types/catalog";

export const getNumberParam = (value: string | null) => {
    if (!value) return undefined;
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) return undefined;

    return parsed;
};

export const getSortParam = (value: string | null): CatalogSortOption | undefined => {
    if (!value) return undefined;

    if (!isCatalogSortOption(value)) return undefined;

    return value;
};
