"use client";

import {FormEvent, useState} from "react";
import {createPortal} from "react-dom";
import {useRouter} from "next/navigation";
import {CloseIcon} from "@/app/components/icon/CloseIcon";
import {LoadingSpinnerIcon} from "@/app/components/icon/LoadingSpinnerIcon";
import {useLockScroll} from "@/hooks/useLockScroll";

interface AdminAccessProps {
    initialIsAdmin: boolean;
}

const getErrorMessage = (payload: unknown, fallback: string) => {
    if (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string") {
        return payload.message;
    }

    return fallback;
};

export const AdminAccess = ({initialIsAdmin}: AdminAccessProps) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({password}),
            });
            const payload: unknown = await response.json().catch(() => null);

            if (!response.ok) {
                setError(getErrorMessage(payload, "Не вдалося увійти в адмін режим."));
                return;
            }

            setIsOpen(false);
            setPassword("");
            router.refresh();
        } catch {
            setError("Не вдалося увійти в адмін режим.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = async () => {
        setError(null);
        setIsSubmitting(true);

        try {
            await fetch("/api/admin/logout", {method: "POST"});
            setIsOpen(false);
            router.refresh();
        } catch {
            setError("Не вдалося вийти з адмін режиму.");
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
                aria-label="Адмін доступ"
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
                            <h2 className="text-[18px] font-semibold leading-6 text-[var(--text-primary)]">Адмін доступ</h2>
                            <button
                                type="button"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--fill)] text-[var(--text-secondary)] transition-transform active:scale-[0.92]"
                                onClick={close}
                                aria-label="Закрити"
                                disabled={isSubmitting}
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        <div className="grid min-h-0 gap-4 overflow-y-auto px-5 pb-5">
                            {initialIsAdmin ? (
                                <>
                                    <p className="text-sm leading-5 text-[var(--text-secondary)]">Адмін режим активний на цьому пристрої.</p>
                                    {error && <p className="rounded-[var(--radius-sm)] bg-[rgba(255,59,48,0.1)] px-4 py-3 text-sm text-[var(--destructive)]">{error}</p>}
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-capsule)] bg-[var(--fill)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition-transform active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50"
                                        onClick={handleLogout}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting && <LoadingSpinnerIcon />}
                                        Вийти
                                    </button>
                                </>
                            ) : (
                                <form className="grid gap-4" onSubmit={handleSubmit}>
                                    <label className="grid gap-1.5 text-[13px] font-semibold leading-[18px] text-[var(--text-secondary)]">
                                        Пароль
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
                                        Увійти
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
