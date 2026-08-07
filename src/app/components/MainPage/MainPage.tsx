"use client";

import {ProductList} from "@/app/components/ProductList/ProductList";
import {PRODUCT_LIST_CLASS_NAMES} from "@/constants/productListLayout";
import type {HeaderConfig} from "@/types/header";
import type {MainPageConfig} from "@/types/main";
import type {PricingConfig} from "@/types/pricingConfig";
import type {ProductsResult} from "@/types/product";

interface MainPageProps {
    config: MainPageConfig;
    headerConfig?: HeaderConfig;
    initialProducts: ProductsResult;
    isAdmin?: boolean;
    pricingConfig?: PricingConfig | null;
}

export const MainPage = ({config, headerConfig, initialProducts, isAdmin = false, pricingConfig}: MainPageProps) => {
    const heading = 'Вітан';

    return (
        <div className={PRODUCT_LIST_CLASS_NAMES.mainPageContainer}>

            <ProductList
                initialProducts={initialProducts}
                pricingConfig={pricingConfig}
                categories={config.categories}
                toolbarButtons={headerConfig?.headerButtons}
                toolbarTitle={heading}
                showCategories
                showSort
                showCategoryOnCard
                showCreateProductButton={isAdmin}
                showDeleteProductButton={isAdmin}
                rootClassName={PRODUCT_LIST_CLASS_NAMES.mainPageRoot}
                toolbarClassName="toolbar"
                searchWrapperClassName={PRODUCT_LIST_CLASS_NAMES.mainPageSearch}
                productCreatorWrapperClassName={PRODUCT_LIST_CLASS_NAMES.mainPageCreator}
                filterWrapperClassName={PRODUCT_LIST_CLASS_NAMES.mainPageFilters}
                sortWrapperClassName={PRODUCT_LIST_CLASS_NAMES.mainPageSort}
                gridClassName={PRODUCT_LIST_CLASS_NAMES.mainPageGrid}
                messageClassName={PRODUCT_LIST_CLASS_NAMES.mainPageMessage}
            />
        </div>
    );
};
