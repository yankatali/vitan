"use client"
import Link from "next/link";
import React, {useMemo} from "react";
import HomeIcon from "@/app/components/icon/IconHome";
import ShopIcon from "@/app/components/icon/ShopIcon";
import WishlistIcon from "@/app/components/icon/WishlistIcon";
import CartIcon from "@/app/components/icon/CartIcon";
import { useMedia } from 'react-use';
import {MediaSize} from "@/types/components";
import {HeaderConfig, IconName} from "@/types/header";

interface Props {
    config: HeaderConfig;
}
const iconMap: Record<IconName, React.FC<{ size?: number; className?: string }>> = {
    home: HomeIcon,
    shop: ShopIcon,
    wishlist: WishlistIcon,
    cart: CartIcon,
};
const Header = ({config}: Props) => {
    const buttons = config?.headerButtons ?? [];
    const isLg = useMedia(MediaSize.isUpLg, false);
    const navItems = useMemo(
        () =>
            buttons.map(({ url, label, iconName }) => {
                const Icon = iconMap[iconName];
                return (
                    <Link
                        key={url}
                        href={url}
                        className="flex flex-col items-center text-[#a79d96] hover:text-[#17150c]"
                    >
                        {Icon && <Icon size={isLg ? 20 : 26} />}
                        <span className="text-xs">{label}</span>
                    </Link>
                );
            }),
        [buttons, isLg]
    );
    return (
        <>
            <header className="w-full px-6 py-4">
                <div className={`flex items-center ${isLg ? 'justify-between' : 'justify-center'}`}>
                    <strong className="text-xl text-[#11100d]">{config.title}</strong>
                    {isLg && <nav className="flex items-center gap-6">{navItems}</nav>}
                </div>
            </header>

            {!isLg && (
                <nav className="fixed inset-x-0 bottom-0 flex justify-around bg-white/80 backdrop-blur border-t border-[#a79d96] py-2">
                    {navItems}
                </nav>
            )}
        </>
    )
}

export default Header;