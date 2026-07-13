import type { HeaderConfig } from './header';
import type { AboutUsConfig } from './about';
import type { MainPageConfig } from './main';
import type { CatalogConfig } from './catalog';
import type { ItemConfig } from './item';
import type { PricingConfig } from './pricingConfig';
import type { ProductsResult } from './product';

interface ComponentSys {
    id: string;
}

interface BaseComponent<TypeName extends string, Config> {
    type: TypeName;
    config: Config;
    sys: ComponentSys;
    fields: {
        type: [TypeName];
        config: Config;
        references?: unknown[];
    };
}

export type HeaderComponent = BaseComponent<'Header', HeaderConfig>;
export type AboutUsComponent = BaseComponent<'AboutUs', AboutUsConfig>;
export type MainPageComponent = BaseComponent<'MainPage', MainPageConfig>;
export type CatalogComponent = BaseComponent<'Catalog', CatalogConfig>;
export type ItemCtfComponent = BaseComponent<'Item', ItemConfig>;


export type CtfComponent =
    | HeaderComponent
    | AboutUsComponent
    | MainPageComponent
    | CatalogComponent
    | ItemCtfComponent;

export type RenderableCtfComponent =
    | HeaderComponent
    | AboutUsComponent
    | MainPageComponent
    | CatalogComponent;

export const isRenderableCtfComponent = (component: CtfComponent): component is RenderableCtfComponent => {
    const type = component.type;

    return type === 'Header'
        || type === 'AboutUs'
        || type === 'MainPage'
        || type === 'Catalog';
};

export interface GetReactComponentOptions {
    headerConfig?: HeaderConfig;
    initialProducts?: ProductsResult;
    pricingConfig?: PricingConfig | null;
}
