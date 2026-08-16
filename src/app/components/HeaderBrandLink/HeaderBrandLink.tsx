"use client";

import Image from "next/image";
import Link from "next/link";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import type {HeaderBrandLinkProps} from "@/types/props";


export const HeaderBrandLink = ({label, className = ""}: HeaderBrandLinkProps) => {
    const {brand, navigation} = useSiteContent();

    return (
        <Link
            href="/"
            className={`inline-flex min-w-0 items-center gap-2 rounded-full text-[var(--text-primary)] transition-opacity active:opacity-60 ${className}`.trim()}
            aria-label={navigation.homeAriaLabel}
        >
            <Image
                src={brand.logo.src}
                alt={brand.logo.alt}
                width={36}
                height={36}
                className="h-9 w-9 shrink-0 rounded-full object-cover shadow-[0_2px_8px_rgba(23,21,12,0.12)]"
                priority
            />
            <span className="min-w-0 truncate whitespace-nowrap text-[22px] font-bold leading-7 tracking-[-0.4px] text-[var(--text-primary)] [font-family:var(--font-brand)]">
                {label ?? brand.name}
            </span>
        </Link>
    );
};
