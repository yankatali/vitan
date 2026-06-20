import {AboutUs} from "@/app/components/AboutUs/AboutUs";
import {MainPage} from "@/app/components/MainPage/MainPage";
import {CatalogSection} from "@/app/components/Catalog/CatalogSection";
import type {GetReactComponentOptions, RenderableCtfComponent} from "@/types/ctfComponents";
import {EMPTY_PRODUCTS_RESULT} from "@/constants/products";

export const getReactComponent = (
    component: RenderableCtfComponent,
    options: GetReactComponentOptions = {}
) => {
    const {type, config} = component;
    const headerConfig = options.headerConfig;
    const initialProducts = options.initialProducts ?? EMPTY_PRODUCTS_RESULT;

    switch (type) {
        case "Header":
            return null;

        case "AboutUs":
            return <AboutUs config={config}/>;

        case "MainPage":
            return (
                <MainPage
                    config={config}
                    headerConfig={headerConfig}
                    initialProducts={initialProducts}
                />
            );

        case "Catalog":
            return (
                <CatalogSection
                    config={config}
                    initialProducts={initialProducts}
                />
            );
    }
};
