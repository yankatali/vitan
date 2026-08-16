"use client"
import {usePathname} from "next/navigation";
import {useEffect, useMemo, useState, type CSSProperties} from "react";
import { useMedia } from 'react-use';
import {getActiveNavIndex, getHeaderNavItems, getIconSize} from "@/lib/headerNavItems";
import {MediaSize} from "@/types/components";
import {HeaderConfig} from "@/types/header";
import {HEADER_NAV_CLASS_NAMES} from "@/constants/header";
import {useSavedProductCounts} from "@/hooks/useSavedProductCounts";

interface Props {
    config: HeaderConfig;
}

const Header = ({ config }: Props) => {
    const isLg = useMedia(MediaSize.isUpDesktop, false);
    const pathname = usePathname();
    const savedProductCounts = useSavedProductCounts();
    const [activeNavIndex, setActiveNavIndex] = useState(() => getActiveNavIndex(config.headerButtons ?? [], pathname));

    const iconSize = getIconSize(isLg);
    const headerButtons = useMemo(() => config.headerButtons ?? [], [config.headerButtons]);
    const currentActiveNavIndex = useMemo(() => getActiveNavIndex(headerButtons, pathname), [headerButtons, pathname]);
    const mobileNavItems = useMemo(
        () => getHeaderNavItems(headerButtons, iconSize, savedProductCounts, pathname, setActiveNavIndex),
        [headerButtons, iconSize, savedProductCounts, pathname],
    );

    useEffect(() => {
        setActiveNavIndex(currentActiveNavIndex);
    }, [currentActiveNavIndex]);

    return (
        <nav className={HEADER_NAV_CLASS_NAMES.mobileNav}>
            {activeNavIndex !== null && (
                <span
                    className={HEADER_NAV_CLASS_NAMES.mobileNavIndicator}
                    style={{"--active-index": activeNavIndex} as CSSProperties}
                    aria-hidden="true"
                />
            )}
            {mobileNavItems}
        </nav>
    )
}

export default Header;
