import fixture from "../../contentful-test-configs.json";
import type {CatalogSortOption} from "@/types/catalog";
import type {GetProductsParams, ProductsResult} from "@/types/product";
import type {ItemConfig} from "@/types/item";

interface FixtureComponent {
    entryId: string;
    type: [string];
    config: unknown;
    references?: string[];
}

interface LocalEntry {
    sys: { id: string };
    fields: {
        type: [string];
        config: unknown;
        references?: LocalEntry[];
    };
}

interface LocalPage {
    sys: { id: string };
    fields: {
        name: string;
        references: LocalEntry[];
    };
}

interface FixtureShape {
    page: {
        name: string;
        references: string[];
    };
    pageComponents: FixtureComponent[];
}

const localFixture = fixture as FixtureShape;

const byId = new Map(localFixture.pageComponents.map(component => [component.entryId, component]));

const buildComponent = (id: string, chain = new Set<string>()): LocalEntry | null => {
    const component = byId.get(id);
    if (!component || chain.has(id)) {
        return null;
    }

    const nextChain = new Set(chain);
    nextChain.add(id);

    const references = component.references
        ?.map(referenceId => buildComponent(referenceId, nextChain))
        .filter((reference): reference is LocalEntry => Boolean(reference));

    return {
        sys: {id: component.entryId},
        fields: {
            type: component.type,
            config: component.config,
            references,
        },
    };
};

export const getLocalFixturePage = (name = "/"): LocalPage | null => {
    if (name !== localFixture.page.name) {
        return null;
    }

    const references = localFixture.page.references
        .map(referenceId => buildComponent(referenceId))
        .filter((reference): reference is LocalEntry => Boolean(reference));

    return {
        sys: {id: `local-page-${name}`},
        fields: {
            name,
            references,
        },
    };
};

const isItemConfig = (config: unknown): config is ItemConfig => {
    if (!config || typeof config !== "object") return false;
    const item = config as Partial<ItemConfig>;

    return typeof item.title === "string"
        && (typeof item.purchasePriceUah === "number" || typeof item.priceUsd === "number");
};

const normalizeFixtureItem = (item: ItemConfig): ItemConfig => {
    if (typeof item.purchasePriceUah === "number") return item;

    return {
        ...item,
        purchasePriceUah: item.priceUsd,
    };
};

const sortItems = (items: ItemConfig[], sortBy?: CatalogSortOption) => {
    const sorted = [...items];

    switch (sortBy) {
        case "priceAsc":
            sorted.sort((a, b) => (a.purchasePriceUah ?? 0) - (b.purchasePriceUah ?? 0));
            break;
        case "priceDesc":
            sorted.sort((a, b) => (b.purchasePriceUah ?? 0) - (a.purchasePriceUah ?? 0));
            break;
        case "titleAsc":
            sorted.sort((a, b) => a.title.localeCompare(b.title, "uk"));
            break;
        case "newest":
        default:
            break;
    }

    return sorted;
};

const getSearchTokens = (item: ItemConfig) => {
    return [
        item.title,
        item.description,
        item.category,
        item.sku,
    ]
        .join(" ")
        .toLowerCase()
        .split(/\s+/)
        .map(token => token.replace(/[^\p{L}\p{N}]+/gu, ""))
        .filter(Boolean);
};

const matchesSearchQuery = (item: ItemConfig, query?: string) => {
    const normalizedQuery = query?.trim().toLowerCase();
    if (!normalizedQuery) return true;

    if (normalizedQuery.length < 2) {
        return getSearchTokens(item).includes(normalizedQuery);
    }

    return [
        item.title,
        item.description,
        item.category,
        item.sku,
    ].some(value => value?.toLowerCase().includes(normalizedQuery));
};

export const getLocalFixtureProducts = ({
    query,
    category,
    sortBy,
    skip = 0,
    limit = 100,
}: GetProductsParams): ProductsResult => {
    const activeCategories = category?.filter(c => c && c !== "all");

    const filtered = localFixture.pageComponents
        .filter(component => component.type[0] === "Item")
        .map(component => component.config)
        .filter(isItemConfig)
        .map((item, index) => ({
            ...normalizeFixtureItem(item),
            id: item.id ?? item.sku ?? item.slug ?? `local-product-${index}`,
        }))
        .filter(item => item.isActive !== false)
        .filter(item => matchesSearchQuery(item, query))
        .filter(item => !activeCategories?.length || activeCategories.includes(item.category));

    const sorted = sortItems(filtered, sortBy);
    const start = Math.max(skip, 0);
    const size = Math.max(limit, 1);
    const items = sorted.slice(start, start + size);

    return {
        items,
        total: sorted.length,
        skip: start,
        limit: size,
        hasMore: start + items.length < sorted.length,
    };
};
