import {HeaderNavItem} from "@/app/components/Header/HeaderNavItem";
import type {SavedProductCounts} from "@/lib/savedProductCounts";
import type {HeaderConfig} from "@/types/header";

export const getIconSize = (isLg: boolean) => {
    if (isLg) return 18;

    return 22;
};

export const isNavItemActive = (url: string, pathname: string) => {
    if (url === "/") return pathname === "/";

    return pathname === url || pathname.startsWith(`${url}/`);
};

const getHeaderNavItem = (
    button: NonNullable<HeaderConfig["headerButtons"]>[number],
    index: number,
    iconSize: number,
    counts: SavedProductCounts,
    pathname: string,
    onSelect?: (index: number | null) => void,
) => {
    const {url, label, iconName} = button;
    const count = iconName === "cart" || iconName === "wishlist" ? counts[iconName] : 0;

    return (
        <HeaderNavItem
            key={url}
            url={url}
            label={label}
            iconName={iconName}
            iconSize={iconSize}
            count={count}
            isActive={isNavItemActive(url, pathname)}
            onClick={() => onSelect?.(index)}
        />
    );
};

export const getHeaderNavItems = (
    buttons: HeaderConfig["headerButtons"] = [],
    iconSize: number,
    counts: SavedProductCounts = {cart: 0, wishlist: 0},
    pathname = "",
    onSelect?: (index: number | null) => void,
) => {
    return buttons.map((button, index) => getHeaderNavItem(button, index, iconSize, counts, pathname, onSelect));
};

export const getActiveNavIndex = (buttons: HeaderConfig["headerButtons"] = [], pathname: string): number | null => {
    const activeIndex = buttons.findIndex(({url}) => isNavItemActive(url, pathname));
    return activeIndex >= 0 ? activeIndex : null;
};
