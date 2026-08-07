import {getMarkedUpUahPrice} from "@/lib/productPricing";
import {getWholesaleDescriptionText} from "@/lib/wholesalePricing";
import type {ItemConfig} from "@/types/item";
import type {PricingConfig} from "@/types/pricingConfig";
import type {ProductsResult} from "@/types/product";

const getRetailMarkup = (pricingConfig?: PricingConfig | null) => {
    return pricingConfig?.retailMarkup ?? 30;
};

const getWholesaleMarkup = (pricingConfig?: PricingConfig | null) => {
    return pricingConfig?.wholesaleMarkup ?? 15;
};

export const getPublicProduct = (product: ItemConfig, pricingConfig?: PricingConfig | null): ItemConfig => {
    const {purchasePriceUah, priceUsd: _priceUsd, ...publicProduct} = product;

    return {
        ...publicProduct,
        priceUah: getMarkedUpUahPrice(purchasePriceUah, getRetailMarkup(pricingConfig)),
        priceUahWholesale: getMarkedUpUahPrice(purchasePriceUah, getWholesaleMarkup(pricingConfig)),
        wholesaleDescription: getWholesaleDescriptionText(pricingConfig, product.wholesaleDescription),
    };
};

export const getPublicProductsResult = (products: ProductsResult, pricingConfig?: PricingConfig | null): ProductsResult => {
    return {
        ...products,
        items: products.items.map(product => getPublicProduct(product, pricingConfig)),
    };
};

export const getAdminProductsResult = (products: ProductsResult): ProductsResult => {
    return {
        ...products,
        items: products.items.map(product => {
            const {
                priceUah: _priceUah,
                priceUahWholesale: _priceUahWholesale,
                wholesaleDescription: _wholesaleDescription,
                ...adminProduct
            } = product;

            return adminProduct;
        }),
    };
};
