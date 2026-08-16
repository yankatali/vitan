import Link from "next/link";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {HEADER_NAV_CLASS_NAMES} from "@/constants/header";
import {HEADER_NAV_ICON_MAP} from "@/constants/headerNavIcons";
import {IconName} from "@/types/header";
import type {HeaderNavItemProps} from "@/types/props";


export const HeaderNavItem = ({url, label, iconName, iconSize, count, isActive, onClick}: HeaderNavItemProps) => {
    const Icon = HEADER_NAV_ICON_MAP[iconName];
    const copy = useSiteContent().common;

    return (
        <Link
            href={url}
            className={isActive ? HEADER_NAV_CLASS_NAMES.activeLink : HEADER_NAV_CLASS_NAMES.link}
            aria-current={isActive ? "page" : undefined}
            onClick={onClick}
        >
            <span className={HEADER_NAV_CLASS_NAMES.iconWrapper}>
                {Icon && <Icon size={iconSize} />}
                {count > 0 && (
                    <span className={HEADER_NAV_CLASS_NAMES.badge} aria-label={`${count} ${copy.productCountSuffix}`}>
                        {count > 99 ? "99+" : count}
                    </span>
                )}
            </span>
            <span className="text-xs">{label}</span>
        </Link>
    );
};
