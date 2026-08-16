import {MainPage} from "@/app/components/MainPage/MainPage";
import {Catalog} from "@/app/components/Catalog/Catalog";
import {getUsdToUahRate} from "@/lib/exchange";
import type {GetReactComponentOptions, RenderableCtfComponent} from "@/types/ctfComponents";
import {EMPTY_PRODUCTS_RESULT} from "@/constants/products";

export const getReactComponent = async (
    component: RenderableCtfComponent,
    options: GetReactComponentOptions = {}
) => {
    const {type, config} = component;
    const headerConfig = options.headerConfig;
    const initialProducts = options.initialProducts ?? EMPTY_PRODUCTS_RESULT;
    const isAdmin = options.isAdmin ?? false;
    const pricingConfig = options.pricingConfig;

    switch (type) {
        case "Header":
            return null;

        case "AboutUs":
            return (
                <div className="flex flex-col gap-3 p-4">
                    <h1 className="text-xl text-teal-400 leading-[1.4]">{config.title}</h1>
                    <p className="text-base text-[#8ED7B8] leading-[1.4]">{config.description}</p>
                </div>
            );

        case "MainPage":
            const mainPageProps = {
                config,
                headerConfig,
                initialProducts,
                isAdmin,
                ...(isAdmin ? {pricingConfig} : {}),
            };

            return (
                <MainPage {...mainPageProps} />
            );

        case "Catalog":
            const rate = await getUsdToUahRate(config.currency?.revalidateSeconds ?? 3600);

            return (
                <Catalog
                    config={config}
                    initialProducts={initialProducts}
                    usdToUahRate={rate}
                />
            );
    }
};
