import type { HeaderConfig } from './header';
import type { AboutUsConfig } from './about';
import type { MainPageConfig } from './main';


export interface HeaderComponent {
    fields: {
        type: ['Header'];
        config: HeaderConfig;
    };
}

export interface AboutUsComponent {
    fields: {
        type: ['AboutUs'];
        config: AboutUsConfig;
    };
}

export interface MainPageComponent {
    fields: {
        type: ['MainPage'];
        config: MainPageConfig;
    };
}

export type CtfComponent =
    | HeaderComponent
    | AboutUsComponent
    | MainPageComponent;
