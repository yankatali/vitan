import type {HeaderConfig} from "@/types/header";

export const HEADER_NAV_CLASS_NAMES = {
    header: "sticky top-0 z-40 w-full border-b-[0.5px] border-white/35 bg-white/40 px-6 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_0_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-2xl backdrop-saturate-[180%] backdrop-brightness-[1.05]",
    content: "flex items-center justify-center lg:justify-between",
    link: "relative z-10 flex h-[49px] min-w-0 flex-1 flex-col items-center justify-center rounded-[1.25rem] px-2 text-[11px] font-semibold text-[#1c1c1e] transition-colors duration-300 hover:text-[#1c1c1e] [&_svg]:[shape-rendering:geometricPrecision]",
    activeLink: "relative z-10 flex h-[49px] min-w-0 flex-1 flex-col items-center justify-center rounded-[1.25rem] px-2 text-[11px] font-semibold text-[#1c1c1e] transition-colors duration-300 [&_svg]:[shape-rendering:geometricPrecision]",
    iconWrapper: "relative",
    badge: "absolute -right-1 -top-1 flex min-h-[14px] min-w-[14px] items-center justify-center rounded-full bg-[#d92d20] px-0.5 text-[8px] font-bold leading-none text-white [text-shadow:none] [&_svg]:![filter:none]",
    mobileNav: "fixed bottom-3 left-1/2 z-40 grid h-16 w-[min(calc(100vw-1.5rem),30rem)] -translate-x-1/2 grid-cols-3 items-center gap-0.5 overflow-hidden rounded-full border-[0.5px] border-white/35 bg-white/50 p-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] backdrop-blur-2xl",
    mobileNavIndicator: "liquid-nav-indicator",
    desktopNav: "liquid-surface hidden items-center gap-6 rounded-full px-5 py-1 lg:flex",
    title: "hover:underline font-bold text-xl text-[#11100d] [font-family:var(--font-brand)]",
};

export const HEADER_HOME_ICON_NAME = "home";
export const PRODUCT_GRID_WITH_MOBILE_NAV_SPACING = "pb-4";
export const DEFAULT_HEADER_CONFIG: HeaderConfig = {
    title: "Vitan",
    headerButtons: [
        {url: "/", label: "Покупки", iconName: "shop"},
        {url: "/wishlist", label: "Вибране", iconName: "wishlist"},
        {url: "/cart", label: "Кошик", iconName: "cart"},
    ],
};
