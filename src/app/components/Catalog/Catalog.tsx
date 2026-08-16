"use client";

import {ProductList} from "@/app/components/ProductList/ProductList";
import {getCatalogSortOptions} from "@/lib/catalogHelpers";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {DEFAULT_PRODUCT_SORT} from "@/constants/products";
import {PRODUCT_GRID_WITH_MOBILE_NAV_SPACING} from "@/constants/header";
import type {CatalogProps} from "@/types/props";


export const Catalog = ({config, initialProducts, usdToUahRate}: CatalogProps) => {
    const sortOptions = getCatalogSortOptions(config);
    const copy = useSiteContent().catalog;

    return (
        <section className="flex flex-col gap-4 p-4">
            <div className="space-y-3">
                <h2 className="px-3 text-xl font-semibold text-[#17150c]">{config.title}</h2>
                <ProductList
                    initialProducts={initialProducts}
                    defaultSort={config.defaultSort ?? DEFAULT_PRODUCT_SORT}
                    searchPlaceholder={config.searchPlaceholder ?? copy.searchPlaceholder}
                    categories={config.categories}
                    sortOptions={sortOptions}
                    showCategories
                    showSort
                    showCategoryOnCard
                    usdToUahRate={usdToUahRate}
                    rootClassName="space-y-3"
                    filterWrapperClassName="flex flex-wrap gap-2 px-3"
                    sortWrapperClassName="px-3"
                    gridClassName={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${PRODUCT_GRID_WITH_MOBILE_NAV_SPACING}`}
                    messageClassName="px-3 text-sm text-[#6b615b]"
                />
            </div>
        </section>
    );
};
