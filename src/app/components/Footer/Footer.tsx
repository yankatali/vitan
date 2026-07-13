export const Footer = () => {
    return (
        <footer className="mt-4" id="site-footer">
            <div className="liquid-surface rounded-t-3xl px-4 pt-4 md:px-6 lg:pb-6" style={{paddingBottom: '100px'}}>
                <div className="flex flex-col gap-3">

                    {/* Brand */}
                    <div className="flex items-baseline gap-2">
                        <p className="text-[17px] font-bold tracking-[-0.3px] text-[var(--text-primary)]">Vitan</p>
                        <p className="text-[12px] leading-4 text-[var(--text-secondary)]">Канцелярія та товари для творчості</p>
                    </div>

                    <div className="h-px bg-black/8" />

                    {/* Two columns */}
                    <div className="flex gap-4">
                        {/* Addresses — left */}
                        <div className="flex flex-1 flex-col gap-1.5">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Де знайти</p>
                            <div className="flex items-start gap-1.5">
                                <svg className="mt-[3px] shrink-0 text-[var(--text-secondary)]" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                                </svg>
                                <div>
                                    <p className="text-[12px] font-semibold text-[var(--text-primary)]">Центральний ринок</p>
                                    <p className="text-[11px] text-[var(--text-secondary)]">вул. Ринкова, 1 — ряд 3, місце 12</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-1.5">
                                <svg className="mt-[3px] shrink-0 text-[var(--text-secondary)]" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                                </svg>
                                <div>
                                    <p className="text-[12px] font-semibold text-[var(--text-primary)]">Магазин у центрі</p>
                                    <p className="text-[11px] text-[var(--text-secondary)]">вул. Центральна, 5 — пн–сб 9–18</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-px bg-black/8" />

                        {/* Contacts — right */}
                        <div className="flex flex-1 flex-col gap-1.5">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Контакти</p>
                            <div className="flex items-center gap-1.5">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="#229ED9" className="shrink-0">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.012 9.484c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L6.26 14.4l-2.95-.924c-.642-.2-.655-.642.136-.953l11.526-4.443c.535-.194 1.003.13.59.168z"/>
                                </svg>
                                <p className="text-[12px] text-[var(--text-primary)]">@vitan_shop</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <svg className="shrink-0 text-[var(--text-secondary)]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.89 10.8a19.79 19.79 0 01-3.07-8.63A2 2 0 012.81 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.29 6.29l1.28-1.28a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                                </svg>
                                <p className="text-[12px] font-semibold text-[var(--text-primary)]">+38 (000) 000-00-00</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-black/8" />

                    <p className="text-[10px] text-[var(--text-secondary)]">© {new Date().getFullYear()} Vitan</p>
                </div>
            </div>
        </footer>
    );
};
