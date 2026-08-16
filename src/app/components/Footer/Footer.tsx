"use client";

import Image from "next/image";
import {AdminAccess} from "@/app/components/AdminAccess/AdminAccess";
import {
    FOOTER_ADDRESS_ICON_CLASS_NAME,
    FOOTER_ADDRESS_LINK_CLASS_NAME,
    FOOTER_ICON_CLASS_NAME,
    FOOTER_LINK_CLASS_NAME,
    FOOTER_LINK_TEXT_CLASS_NAME,
    FOOTER_SECTION_TITLE_CLASS_NAME,
} from "@/constants/footer";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {PAGE_CONTENT_PX} from "@/constants/pageLayout";
import type {FooterProps} from "@/types/props";


export const Footer = ({isAdmin = false}: FooterProps) => {
    const {brand, footer} = useSiteContent();
    const phoneNumber = footer.phone.label;
    const normalizedPhoneNumber = footer.phone.normalized;

    return (
        <footer className="mt-4 lg:mt-5" id="site-footer">
            <div className={`vitan-footer-surface liquid-surface rounded-t-3xl pt-4 lg:pt-5 ${PAGE_CONTENT_PX}`}>
                <div className="vitan-footer-content flex flex-col gap-3 lg:gap-4">
                    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(12rem,auto)] lg:items-start lg:gap-8">
                        <div className="flex min-w-0 items-center gap-3">
                            <Image
                                src={brand.logo.src}
                                alt={brand.logo.alt}
                                width={48}
                                height={48}
                                className="h-11 w-11 shrink-0 rounded-full object-cover shadow-[0_4px_12px_rgba(23,21,12,0.12)] lg:h-12 lg:w-12"
                            />
                            <div className="flex min-w-0 flex-col gap-1">
                                <p className="text-[18px] font-bold leading-6 tracking-normal text-[var(--text-primary)] lg:text-[21px] lg:leading-7">{brand.name}</p>
                                <p className="max-w-[30rem] text-[12px] leading-5 text-[var(--text-secondary)] lg:text-[13px]">
                                    {brand.tagline}
                                </p>
                            </div>
                        </div>

                        <div className="flex min-w-0 flex-col gap-1.5">
                            <p className={FOOTER_SECTION_TITLE_CLASS_NAME}>{footer.locationTitle}</p>
                            <a
                                href={footer.address.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={FOOTER_ADDRESS_LINK_CLASS_NAME}
                                aria-label={footer.address.ariaLabel}
                            >
                                <span className={FOOTER_ADDRESS_ICON_CLASS_NAME} aria-hidden="true">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.15" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 10c0 5-5.54 10.19-7.4 11.8a.94.94 0 0 1-1.2 0C9.54 20.19 4 15 4 10a8 8 0 0 1 16 0Z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                </span>
                                <span className={`${FOOTER_LINK_TEXT_CLASS_NAME} max-w-[20rem]`}>{footer.address.label}</span>
                            </a>
                        </div>
                    </div>

                    <div className="h-px bg-black/8" />

                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 flex-col gap-1.5">
                            <p className={FOOTER_SECTION_TITLE_CLASS_NAME}>{footer.contactsTitle}</p>
                            <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1">
                                <a
                                    href={`tel:+${normalizedPhoneNumber}`}
                                    className={FOOTER_LINK_CLASS_NAME}
                                    aria-label={footer.phone.ariaLabel}
                                >
                                    <span className={`${FOOTER_ICON_CLASS_NAME} text-[var(--text-primary)]`} aria-hidden="true">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.15" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 16.92v2.55a2.2 2.2 0 0 1-2.4 2.19 19.15 19.15 0 0 1-8.34-2.96 18.86 18.86 0 0 1-5.82-5.82 19.15 19.15 0 0 1-2.96-8.38A2.2 2.2 0 0 1 4.66 2.1h2.56a2.2 2.2 0 0 1 2.18 1.89c.14 1 .37 1.97.7 2.9a2.2 2.2 0 0 1-.49 2.25l-1.08 1.08a15.08 15.08 0 0 0 5.25 5.25l1.08-1.08a2.2 2.2 0 0 1 2.25-.49c.93.33 1.9.56 2.9.7A2.2 2.2 0 0 1 22 16.92Z"/>
                                        </svg>
                                    </span>
                                    <span className={FOOTER_LINK_TEXT_CLASS_NAME}>{phoneNumber}</span>
                                </a>

                                <a
                                    href={`tg://resolve?phone=${normalizedPhoneNumber}`}
                                    className={FOOTER_LINK_CLASS_NAME}
                                    aria-label={footer.telegram.ariaLabel}
                                >
                                    <span className={FOOTER_ICON_CLASS_NAME} aria-hidden="true">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="#229ED9">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm4.64 6.87-1.56 7.35c-.12.52-.43.65-.88.4l-2.42-1.78-1.17 1.13c-.13.13-.24.24-.49.24l.17-2.47 4.5-4.06c.2-.17-.04-.27-.3-.1l-5.56 3.5-2.39-.75c-.52-.16-.53-.52.11-.77l9.33-3.6c.43-.16.82.1.66.9Z"/>
                                        </svg>
                                    </span>
                                    <span className={FOOTER_LINK_TEXT_CLASS_NAME}>{footer.telegram.label}</span>
                                </a>

                                <a
                                    href={`viber://chat/?number=%2B${normalizedPhoneNumber}`}
                                    className={FOOTER_LINK_CLASS_NAME}
                                    aria-label={footer.viber.ariaLabel}
                                >
                                    <span className={FOOTER_ICON_CLASS_NAME} aria-hidden="true">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="#7360f2">
                                            <path d="M12 2C6.1 2 3 5.1 3 11v1.75c0 3.75 1.2 6.24 3.6 7.7v1.68c0 .56.67.86 1.1.5l1.98-1.56c.72.08 1.5.12 2.32.12 5.9 0 9-3.1 9-9V11c0-5.9-3.1-9-9-9Zm4.4 13.75c-.24.68-1.17 1.28-1.78 1.36-.52.07-1.18.11-3.3-.78-2.78-1.16-4.57-4.02-4.72-4.2-.14-.19-1.12-1.55-1.12-2.95 0-1.4.7-2.08.95-2.36.25-.27.55-.34.73-.34h.58c.2 0 .44.02.62.45.23.54.78 1.9.85 2.04.07.14.12.32.02.52-.1.2-.16.32-.32.5-.16.18-.33.4-.47.53-.15.15-.31.31-.13.6.18.28.78 1.3 1.67 2.1 1.15 1.02 2.1 1.33 2.4 1.49.3.15.48.13.66-.08.2-.23.78-.9.98-1.22.2-.32.42-.27.7-.16.28.1 1.78.84 2.08.99.3.15.5.23.57.36.08.13.08.78-.16 1.45Z"/>
                                        </svg>
                                    </span>
                                    <span className={FOOTER_LINK_TEXT_CLASS_NAME}>{footer.viber.label}</span>
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center lg:justify-end">
                            <AdminAccess initialIsAdmin={isAdmin} />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
