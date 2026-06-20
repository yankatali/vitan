import {Catalog} from "@/app/components/Catalog/Catalog";
import {getUsdToUahRate} from "@/lib/exchange";
import type {CatalogConfig} from "@/types/catalog";
import type {ProductsResult} from "@/types/product";

interface CatalogSectionProps {
    config: CatalogConfig;
    initialProducts: ProductsResult;
}

export const CatalogSection = async ({config, initialProducts}: CatalogSectionProps) => {
    const rate = await getUsdToUahRate(config.currency?.revalidateSeconds ?? 3600);

    return (
        <Catalog
            config={config}
            initialProducts={initialProducts}
            usdToUahRate={rate}
        />
    );
};
