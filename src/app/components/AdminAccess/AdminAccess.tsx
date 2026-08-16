"use client";

import {FormEvent, useState} from "react";
import {createPortal} from "react-dom";
import {useRouter} from "next/navigation";
import {loginAdmin, logoutAdmin} from "@/lib/adminAccessApi";
import {CloseIcon} from "@/app/components/icon/CloseIcon";
import {LoadingSpinnerIcon} from "@/app/components/icon/LoadingSpinnerIcon";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {useLockScroll} from "@/hooks/useLockScroll";
import type {AdminAccessProps} from "@/types/props";


export const AdminAccess = ({initialIsAdmin}: AdminAccessProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();
    const copy = useSiteContent().adminAccess;

    useLockScroll(isOpen);

    const close = () => {
        if (isSubmitting) return;

        setIsOpen(false);
        setPassword("");
        setError(null);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await loginAdmin(password, copy);
            setIsOpen(false);
            setPassword("");
            router.refresh();
        } catch (error) {
            setError(error instanceof Error ? error.message : copy.loginRequestError);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = async () => {
        setError(null);
        setIsSubmitting(true);

        try {
            await logoutAdmin(copy);
            setIsOpen(false);
            router.refresh();
        } catch (error) {
            setError(error instanceof Error ? error.message : copy.logoutRequestError);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <button
                type="button"
                className="inline-flex text-left text-[10px] text-[var(--text-secondary)] outline-none transition-colors hover:text-[var(--text-primary)] focus-visible:text-[var(--text-primary)]"
                onClick={() => setIsOpen(true)}
                aria-label={copy.triggerAriaLabel}
            >
                © {new Date().getFullYear()} Vitan
            </button>

            {isOpen && typeof document !== "undefined" && createPortal(
                <div
                    className="fixed inset-0 z-[220] flex items-center justify-center bg-black/28 px-4 backdrop-blur-md"
                    onClick={close}
                >
                    <div
                        className="vitan-sheet-panel relative flex max-h-[90vh] w-full max-w-sm flex-col overflow-hidden rounded-[var(--radius-2xl)]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between gap-4 px-5 py-4">
                            <h2 className="text-[18px] font-semibold leading-6 text-[var(--text-primary)]">{copy.title}</h2>
                            <button
                                type="button"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--fill)] text-[var(--text-secondary)] transition-transform active:scale-[0.92]"
                                onClick={close}
                                aria-label={copy.closeAriaLabel}
                                disabled={isSubmitting}
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        <div className="grid min-h-0 gap-4 overflow-y-auto px-5 pb-5">
                            {initialIsAdmin ? (
                                <>
                                    <p className="text-sm leading-5 text-[var(--text-secondary)]">{copy.activeMessage}</p>
                                    {error && <p className="rounded-[var(--radius-sm)] bg-[rgba(255,59,48,0.1)] px-4 py-3 text-sm text-[var(--destructive)]">{error}</p>}
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-capsule)] bg-[var(--fill)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition-transform active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50"
                                        onClick={handleLogout}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting && <LoadingSpinnerIcon />}
                                        {copy.logoutButton}
                                    </button>
                                </>
                            ) : (
                                <form className="grid gap-4" onSubmit={handleSubmit}>
                                    <label className="grid gap-1.5 text-[13px] font-semibold leading-[18px] text-[var(--text-secondary)]">
                                        {copy.passwordLabel}
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(event) => setPassword(event.target.value)}
                                            className="rounded-[var(--radius-sm)] bg-[var(--fill-tertiary)] px-4 py-3 text-[17px] leading-[22px] text-[var(--text-primary)] shadow-[inset_0_0_0_1px_var(--separator)] outline-none transition-shadow focus:shadow-[inset_0_0_0_2px_var(--label)]"
                                            autoComplete="current-password"
                                            required
                                            autoFocus
                                        />
                                    </label>

                                    {error && <p className="rounded-[var(--radius-sm)] bg-[rgba(255,59,48,0.1)] px-4 py-3 text-sm text-[var(--destructive)]">{error}</p>}

                                    <button
                                        type="submit"
                                        className="vitan-accent-button inline-flex items-center justify-center gap-2 rounded-[var(--radius-capsule)] px-5 py-2.5 text-sm font-semibold transition-transform active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting && <LoadingSpinnerIcon />}
                                        {copy.loginButton}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>,
                document.body,
            )}
        </>
    );
};
