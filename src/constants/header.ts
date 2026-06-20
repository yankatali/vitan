import type {HeaderConfig} from "@/types/header";

export const HEADER_NAV_CLASS_NAMES = {
    header: "sticky top-0 z-40 w-full border-b border-white/45 bg-white/32 px-6 py-2 backdrop-blur-2xl",
    content: "flex items-center justify-center min-[1024px]:justify-between",
    link: "relative z-10 flex h-16 min-w-0 flex-1 flex-col items-center justify-center rounded-[1.75rem] px-2 text-[#8f8780] transition-colors duration-300 hover:text-[#17150c]",
    activeLink: "relative z-10 flex h-16 min-w-0 flex-1 flex-col items-center justify-center rounded-[1.75rem] px-2 text-[#188f63] transition-colors duration-300",
    iconWrapper: "relative",
    badge: "absolute -right-3 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full border border-white/70 bg-[#d92d20]/90 px-1 text-[10px] font-bold leading-none text-white shadow-lg shadow-[#d92d20]/20 backdrop-blur",
    mobileNav: "fixed bottom-6 left-1/2 z-40 grid h-20 w-[min(calc(100vw-2rem),28rem)] -translate-x-1/2 grid-cols-3 items-center gap-1 overflow-hidden rounded-[2.35rem] border border-white/55 bg-white/50 p-2 shadow-[0_12px_30px_rgba(23,21,12,0.12),inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-2xl",
    mobileNavIndicator: "liquid-nav-indicator",
    desktopNav: "liquid-surface hidden items-center gap-6 rounded-full px-5 py-1 min-[1024px]:flex",
    title: "hover:underline font-bold text-xl text-[#11100d]",
};

export const HEADER_HOME_ICON_NAME = "home";
export const PRODUCT_GRID_WITH_MOBILE_NAV_SPACING = "pb-36 min-[1024px]:pb-4";
export const DEFAULT_HEADER_CONFIG: HeaderConfig = {
    title: "Vitan",
    headerButtons: [
        {url: "/", label: "Покупки", iconName: "shop"},
        {url: "/wishlist", label: "Вибране", iconName: "wishlist"},
        {url: "/cart", label: "Кошик", iconName: "cart"},
    ],
};
