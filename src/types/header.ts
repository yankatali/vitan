

export type IconName = 'home' | 'shop' | 'wishlist' | 'cart';

export interface HeaderButton {
    url: string;
    label: string;
    iconName: IconName;
}

export interface HeaderConfig {
    title: string;
    headerButtons?: HeaderButton[];
}