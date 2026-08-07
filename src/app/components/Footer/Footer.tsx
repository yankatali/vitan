import {AdminAccess} from "@/app/components/AdminAccess/AdminAccess";

interface FooterProps {
    isAdmin?: boolean;
}

const footerLinkClassName = "group flex w-fit max-w-full items-center gap-1 rounded-[var(--radius-sm)] py-1 text-[var(--text-primary)] transition-opacity active:opacity-65";
const footerIconClassName = "flex h-[18px] w-[18px] shrink-0 items-center justify-center";

export const Footer = ({isAdmin = false}: FooterProps) => {
    const phoneNumber = "+380 506 725 136";
    const normalizedPhoneNumber = "380506725136";

    return (
        <footer className="mt-5" id="site-footer">
            <div className="liquid-surface rounded-t-3xl px-4 pt-5 md:px-6 lg:pb-6" style={{paddingBottom: '100px'}}>
                <div className="flex flex-col gap-4">

                    {/* Brand */}
                    <div className="flex flex-col">
                        <p className="text-[18px] font-bold tracking-normal text-[var(--text-primary)]">Вітан</p>
                        <p className="max-w-[34rem] text-[12px] leading-5 text-[var(--text-secondary)]">
                            Універсальний магазин, у якому можна знайти майже все.
                        </p>
                    </div>

                    <div className="h-px bg-black/8" />

                    {/* Two columns */}
                    <div className="grid gap-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">

                        {/* Contacts — left */}
                        <div className="flex min-w-0 flex-col gap-2">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                                Контакти
                            </p>
                            <a
                                href={`tel:+${normalizedPhoneNumber}`}
                                className={footerLinkClassName}
                                aria-label={`Подзвонити ${phoneNumber}`}
                            >
                                <span className={`${footerIconClassName} text-[var(--text-primary)]`} aria-hidden="true">
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.15" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v2.55a2.2 2.2 0 0 1-2.4 2.19 19.15 19.15 0 0 1-8.34-2.96 18.86 18.86 0 0 1-5.82-5.82 19.15 19.15 0 0 1-2.96-8.38A2.2 2.2 0 0 1 4.66 2.1h2.56a2.2 2.2 0 0 1 2.18 1.89c.14 1 .37 1.97.7 2.9a2.2 2.2 0 0 1-.49 2.25l-1.08 1.08a15.08 15.08 0 0 0 5.25 5.25l1.08-1.08a2.2 2.2 0 0 1 2.25-.49c.93.33 1.9.56 2.9.7A2.2 2.2 0 0 1 22 16.92Z"/>
                                    </svg>
                                </span>
                                <span className="min-w-0 text-[13px] font-semibold leading-5 text-[var(--text-primary)]">{phoneNumber}</span>
                            </a>
                            <a
                                href={`tg://resolve?phone=${normalizedPhoneNumber}`}
                                className={footerLinkClassName}
                                aria-label={`Написати в Telegram ${phoneNumber}`}
                            >
                                <span className={footerIconClassName} aria-hidden="true">
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="#229ED9">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm4.64 6.87-1.56 7.35c-.12.52-.43.65-.88.4l-2.42-1.78-1.17 1.13c-.13.13-.24.24-.49.24l.17-2.47 4.5-4.06c.2-.17-.04-.27-.3-.1l-5.56 3.5-2.39-.75c-.52-.16-.53-.52.11-.77l9.33-3.6c.43-.16.82.1.66.9Z"/>
                                    </svg>
                                </span>
                                <span className="min-w-0 text-[13px] font-semibold leading-5 text-[var(--text-primary)]">Telegram</span>
                            </a>
                            <a
                                href={`viber://chat/?number=%2B${normalizedPhoneNumber}`}
                                className={footerLinkClassName}
                                aria-label={`Написати у Viber ${phoneNumber}`}
                            >
                                <span className={footerIconClassName} aria-hidden="true">
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="#7360f2">
                                        <path d="M12 2C6.1 2 3 5.1 3 11v1.75c0 3.75 1.2 6.24 3.6 7.7v1.68c0 .56.67.86 1.1.5l1.98-1.56c.72.08 1.5.12 2.32.12 5.9 0 9-3.1 9-9V11c0-5.9-3.1-9-9-9Zm4.4 13.75c-.24.68-1.17 1.28-1.78 1.36-.52.07-1.18.11-3.3-.78-2.78-1.16-4.57-4.02-4.72-4.2-.14-.19-1.12-1.55-1.12-2.95 0-1.4.7-2.08.95-2.36.25-.27.55-.34.73-.34h.58c.2 0 .44.02.62.45.23.54.78 1.9.85 2.04.07.14.12.32.02.52-.1.2-.16.32-.32.5-.16.18-.33.4-.47.53-.15.15-.31.31-.13.6.18.28.78 1.3 1.67 2.1 1.15 1.02 2.1 1.33 2.4 1.49.3.15.48.13.66-.08.2-.23.78-.9.98-1.22.2-.32.42-.27.7-.16.28.1 1.78.84 2.08.99.3.15.5.23.57.36.08.13.08.78-.16 1.45Z"/>
                                    </svg>
                                </span>
                                <span className="min-w-0 text-[13px] font-semibold leading-5 text-[var(--text-primary)]">Viber</span>
                            </a>
                        </div>
                        {/* Addresses — right */}
                        <div className="flex min-w-0 flex-col gap-2">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                                Де знайти
                            </p>
                            <a
                                href="https://maps.app.goo.gl/tBJFPrhTpUefVp5x6"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={footerLinkClassName}
                                aria-label="Відкрити Вітан на карті"
                            >
                                <span className={`${footerIconClassName} text-[var(--text-primary)]`} aria-hidden="true">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.05" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 10c0 5-5.54 10.19-7.4 11.8a.94.94 0 0 1-1.2 0C9.54 20.19 4 15 4 10a8 8 0 0 1 16 0Z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                </span>
                                <span className="min-w-0 text-[13px] font-semibold leading-5 text-[var(--text-primary)]">Вітан</span>
                            </a>
                        </div>
                    </div>

                    <div className="h-px bg-black/8" />

                    <AdminAccess initialIsAdmin={isAdmin} />
                </div>
            </div>
        </footer>
    );
};
