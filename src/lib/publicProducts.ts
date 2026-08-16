import {getMarkedUpUahPrice} from "@/lib/productPricing";
import {getWholesaleDescriptionText} from "@/lib/wholesalePricing";
import type {SiteContent} from "@/constants/siteContent";
import type {ItemConfig} from "@/types/item";
import type {PricingConfig} from "@/types/pricingConfig";
import type {ProductsResult} from "@/types/product";

const getRetailMarkup = (pricingConfig?: PricingConfig | null) => {
    return pricingConfig?.retailMarkup ?? 30;
};

const getWholesaleMarkup = (pricingConfig?: PricingConfig | null) => {
    return pricingConfig?.wholesaleMarkup ?? 15;
};

export const getPublicProduct = (
    product: ItemConfig,
    pricingConfig?: PricingConfig | null,
    wholesaleCopy?: SiteContent["wholesale"],
): ItemConfig => {
    const publicProduct: ItemConfig = {...product};
    delete publicProduct.purchasePriceUah;
    delete publicProduct.priceUsd;

    return {
        ...publicProduct,
        priceUah: getMarkedUpUahPrice(product.purchasePriceUah, getRetailMarkup(pricingConfig)),
        priceUahWholesale: getMarkedUpUahPrice(product.purchasePriceUah, getWholesaleMarkup(pricingConfig)),
        wholesaleDescription: getWholesaleDescriptionText(pricingConfig, product.wholesaleDescription, wholesaleCopy),
    };
};

export const getPublicProductsResult = (
    products: ProductsResult,
    pricingConfig?: PricingConfig | null,
    wholesaleCopy?: SiteContent["wholesale"],
): ProductsResult => {
    return {
        ...products,
        items: products.items.map(product => getPublicProduct(product, pricingConfig, wholesaleCopy)),
    };
};

export const getAdminProductsResult = (products: ProductsResult): ProductsResult => {
    return {
        ...products,
        items: products.items.map(product => {
            const adminProduct: ItemConfig = {...product};
            delete adminProduct.priceUah;
            delete adminProduct.priceUahWholesale;
            delete adminProduct.wholesaleDescription;

            return adminProduct;
        }),
    };
};
