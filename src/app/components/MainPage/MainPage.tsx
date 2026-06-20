"use client";

import {ProductList} from "@/app/components/ProductList/ProductList";
import {PRODUCT_LIST_CLASS_NAMES} from "@/constants/productListLayout";
import type {HeaderConfig} from "@/types/header";
import type {MainPageConfig} from "@/types/main";
import type {ProductsResult} from "@/types/product";

interface MainPageProps {
    config: MainPageConfig;
    headerConfig?: HeaderConfig;
    initialProducts: ProductsResult;
}

export const MainPage = ({config, headerConfig, initialProducts}: MainPageProps) => {
    const heading = headerConfig?.title ?? config.label ?? config.title;

    return (
        <div className={PRODUCT_LIST_CLASS_NAMES.mainPageContainer}>
            <ProductList
                initialProducts={initialProducts}
                toolbarButtons={headerConfig?.headerButtons}
                toolbarTitle={heading}
                showCategories
                showSort
                showCategoryOnCard
                showCreateProductButton
                showDeleteProductButton
                rootClassName={PRODUCT_LIST_CLASS_NAMES.mainPageRoot}
                toolbarClassName={PRODUCT_LIST_CLASS_NAMES.mainPageToolbar}
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
