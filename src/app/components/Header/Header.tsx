"use client"
import Link from "next/link";
import {usePathname} from "next/navigation";
import React, {useEffect, useMemo, useState, type CSSProperties} from "react";
import HomeIcon from "@/app/components/icon/IconHome";
import ShopIcon from "@/app/components/icon/ShopIcon";
import WishlistIcon from "@/app/components/icon/WishlistIcon";
import CartIcon from "@/app/components/icon/CartIcon";
import { useMedia } from 'react-use';
import {MediaSize} from "@/types/components";
import {HeaderConfig, IconName} from "@/types/header";
import {HEADER_NAV_CLASS_NAMES} from "@/constants/header";
import {useSavedProductCounts, type SavedProductCounts} from "@/app/components/Header/useSavedProductCounts";

interface Props {
    config: HeaderConfig;
}
const iconMap: Record<IconName, React.FC<{ size?: number; className?: string }>> = {
    home: HomeIcon,
    shop: ShopIcon,
    wishlist: WishlistIcon,
    cart: CartIcon,
};

const getIconSize = (isLg: boolean) => {
    if (isLg) return 20;

    return 26;
};

const isNavItemActive = (url: string, pathname: string) => {
    if (url === "/") return pathname === "/";

    return pathname === url || pathname.startsWith(`${url}/`);
};

export const getHeaderNavItems = (
    buttons: HeaderConfig["headerButtons"] = [],
    iconSize: number,
    counts: SavedProductCounts = {cart: 0, wishlist: 0},
    pathname = "",
    onSelect?: (index: number) => void,
) => {
    return buttons.map(({ url, label, iconName }, index) => {
        const Icon = iconMap[iconName];
        const count = iconName === "cart" || iconName === "wishlist" ? counts[iconName] : 0;
        const isActive = isNavItemActive(url, pathname);

        return (
            <Link
                key={url}
                href={url}
                className={isActive ? HEADER_NAV_CLASS_NAMES.activeLink : HEADER_NAV_CLASS_NAMES.link}
                aria-current={isActive ? "page" : undefined}
                onClick={() => onSelect?.(index)}
            >
                <span className={HEADER_NAV_CLASS_NAMES.iconWrapper}>
                    {Icon && <Icon size={iconSize} />}
                    {count > 0 && (
                        <span className={HEADER_NAV_CLASS_NAMES.badge} aria-label={`${count} товарів`}>
                            {count > 99 ? "99+" : count}
                        </span>
                    )}
                </span>
                <span className="text-xs">{label}</span>
            </Link>
        );
    });
};

const getActiveNavIndex = (buttons: HeaderConfig["headerButtons"] = [], pathname: string) => {
    const activeIndex = buttons.findIndex(({url}) => isNavItemActive(url, pathname));

    return activeIndex >= 0 ? activeIndex : 0;
};

const Header = ({ config }: Props) => {
    const isLg = useMedia(MediaSize.isUpDesktop, false);
    const pathname = usePathname();
    const savedProductCounts = useSavedProductCounts();
    const iconSize = getIconSize(isLg);
    const headerButtons = useMemo(() => config.headerButtons ?? [], [config.headerButtons]);
    const currentActiveNavIndex = useMemo(() => getActiveNavIndex(headerButtons, pathname), [headerButtons, pathname]);
    const [activeNavIndex, setActiveNavIndex] = useState(currentActiveNavIndex);

    useEffect(() => {
        setActiveNavIndex(currentActiveNavIndex);
    }, [currentActiveNavIndex]);

    const mobileNavItems = useMemo(
        () => getHeaderNavItems(headerButtons, iconSize, savedProductCounts, pathname, setActiveNavIndex),
        [headerButtons, iconSize, savedProductCounts, pathname],
    );

    return (
        <>
            {!isLg && (
                <nav className={HEADER_NAV_CLASS_NAMES.mobileNav}>
                    <span
                        className={HEADER_NAV_CLASS_NAMES.mobileNavIndicator}
                        style={{"--active-index": activeNavIndex} as CSSProperties}
                        aria-hidden="true"
                    />
                    {mobileNavItems}
                </nav>
            )}
        </>
    )
}

export default Header;
