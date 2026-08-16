import {getCtfPage} from "@/lib/getPage";
import {getReactComponent} from "@/lib/getReactComponent";
import {CtfComponent, isRenderableCtfComponent, RenderableCtfComponent} from "@/types/ctfComponents";
import {Fragment} from "react";
import {getProducts} from "@/lib/products";
import {getPricingConfig} from "@/lib/pricingConfig";
import {getContentfulRevalidateSeconds} from "@/lib/cache";
import {isAdminSession} from "@/lib/adminAuth";
import {getAdminProductsResult, getPublicProductsResult} from "@/lib/publicProducts";
import {getSiteContent} from "@/lib/siteContent";
import {CatalogSortOption} from "@/types/catalog";
import type {ProductsResult} from "@/types/product";
import type {HeaderConfig} from "@/types/header";

const isCtfComponent = (value: unknown): value is CtfComponent => {
    if (!value || typeof value !== "object") return false;
    const entry = value as { fields?: { type?: unknown }, sys?: { id?: unknown } };
    const fields = entry.fields;
    const id = entry.sys?.id;

    return Boolean(fields && Array.isArray(fields.type) && typeof fields.type[0] === "string" && typeof id === "string");
};

const normalizeCtfComponent = (component: Omit<CtfComponent, 'type' | 'config'>): CtfComponent => ({
    ...component,
    type: component.fields.type[0],
    config: component.fields.config,
} as CtfComponent);

const getInitialProductSort = (components: RenderableCtfComponent[]): CatalogSortOption | null => {
    const productListComponent = components.find(component => {
        return component.type === "MainPage" || component.type === "Catalog";
    });

    if (!productListComponent) return null;

    if (productListComponent.type === "Catalog") {
        return productListComponent.config.defaultSort ?? "newest";
    }

    return "newest";
};

const getHeaderConfig = (components: RenderableCtfComponent[]): HeaderConfig | undefined => {
    const headerComponent = components.find(component => component.type === "Header");
    if (!headerComponent || headerComponent.type !== "Header") return undefined;

    return headerComponent.config;
};

export async function renderPageByPath(path = "/") {
    const page = await getCtfPage(path);
    if (!page?.fields) return null;
    const references = page?.fields.references;

    if (Array.isArray(references)) {
        const components: RenderableCtfComponent[] = [];
        for (const reference of references) {
            if (isCtfComponent(reference)) {
                const component = normalizeCtfComponent(reference);

                if (isRenderableCtfComponent(component)) {
                    components.push(component);
                }
            }
        }

        const initialProductSort = getInitialProductSort(components);
        const headerConfig = getHeaderConfig(components);
        const isAdmin = await isAdminSession();
        let initialProducts: ProductsResult | undefined;

        if (initialProductSort) {
            const revalidateSeconds = getContentfulRevalidateSeconds();

            initialProducts = await getProducts({
                limit: 100,
                sortBy: initialProductSort,
                revalidateSeconds,
            });
        }

        const [pricingConfig, siteContent] = await Promise.all([
            getPricingConfig(),
            getSiteContent(),
        ]);
        const clientInitialProducts = initialProducts
            ? isAdmin ? getAdminProductsResult(initialProducts) : getPublicProductsResult(initialProducts, pricingConfig, siteContent.wholesale)
            : undefined;
        const componentOptions = {
            headerConfig,
            initialProducts: clientInitialProducts,
            isAdmin,
            ...(isAdmin ? {pricingConfig} : {}),
        };

        const renderedComponents = await Promise.all(components.map(ref => getReactComponent(ref, componentOptions)));

        return renderedComponents.map((component, index) => (
            <Fragment key={components[index].sys.id}>
                {component}
            </Fragment>
        ));
    }

    return null;
}
