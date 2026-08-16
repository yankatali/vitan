import {type FC} from "react";
import CartIcon from "@/app/components/icon/CartIcon";
import HomeIcon from "@/app/components/icon/IconHome";
import ShopIcon from "@/app/components/icon/ShopIcon";
import WishlistIcon from "@/app/components/icon/WishlistIcon";
import type {IconName} from "@/types/header";

export const HEADER_NAV_ICON_MAP: Record<IconName, FC<{ size?: number; className?: string }>> = {
    home: HomeIcon,
    shop: ShopIcon,
    wishlist: WishlistIcon,
    cart: CartIcon,
};
