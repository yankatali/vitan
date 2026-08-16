"use client";

import Link from "next/link";
import {HeaderBrandLink} from "@/app/components/HeaderBrandLink/HeaderBrandLink";
import {PageHeader} from "@/app/components/PageHeader/PageHeader";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {PAGE_CONTENT_PX} from "@/constants/pageLayout";
import type {SiteContent} from "@/constants/siteContent";

interface CheckoutSuccessViewProps {
    copy: SiteContent["checkout"];
}

export const CheckoutSuccessView = ({copy}: CheckoutSuccessViewProps) => {
    const siteContent = useSiteContent();

    return (
        <main className="flex min-h-screen flex-col text-[var(--text-primary)]">
            <div className={`sticky top-0 z-20 pt-3 ${PAGE_CONTENT_PX}`}>
                <PageHeader>
                    <div className="flex items-center gap-1 md:gap-3">
                        <Link href="/" className="inline-flex h-[28px] items-center justify-start rounded-full text-[var(--text-primary)] transition-opacity active:opacity-60" aria-label={siteContent.navigation.backAriaLabel}>
                            <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2L2 10l8 8"/></svg>
                        </Link>
                        <HeaderBrandLink />
                    </div>
                </PageHeader>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent)]/15">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                </div>
                <div>
                    <h1 className="text-[24px] font-bold leading-[30px] tracking-[-0.4px]">{copy.successTitle}</h1>
                    <p className="mt-2 text-[15px] leading-[22px] text-[var(--text-secondary)]">{copy.successDescription}</p>
                </div>
                <Link href="/" className="vitan-accent-button rounded-[20px] px-6 py-3 text-[15px] font-semibold">
                    {siteContent.common.homeButton}
                </Link>
            </div>
        </main>
    );
};
