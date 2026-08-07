"use client";

import {FormEvent, useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {useRouter} from "next/navigation";
import {CloseIcon} from "@/app/components/icon/CloseIcon";
import {LoadingSpinnerIcon} from "@/app/components/icon/LoadingSpinnerIcon";
import {useLockScroll} from "@/hooks/useLockScroll";
import type {PricingConfig} from "@/types/pricingConfig";

interface AdminSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type AdminSettingsValues = Record<keyof PricingConfig, string>;

const EMPTY_SETTINGS_VALUES: AdminSettingsValues = {
    usdToUahRate: "",
    retailMarkup: "",
    wholesaleMarkup: "",
    wholesaleDescription: "",
    optPrice: "",
    descriptionAfterOptValid: "",
};

const getErrorMessage = (payload: unknown, fallback: string) => {
    if (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string") {
        return payload.message;
    }

    return fallback;
};

const getSettingsValues = (settings: PricingConfig): AdminSettingsValues => ({
    usdToUahRate: String(settings.usdToUahRate),
    retailMarkup: String(settings.retailMarkup),
    wholesaleMarkup: String(settings.wholesaleMarkup),
    wholesaleDescription: settings.wholesaleDescription,
    optPrice: String(settings.optPrice),
    descriptionAfterOptValid: settings.descriptionAfterOptValid,
});

export const AdminSettingsModal = ({isOpen, onClose}: AdminSettingsModalProps) => {
    const router = useRouter();
    const [values, setValues] = useState<AdminSettingsValues>(EMPTY_SETTINGS_VALUES);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useLockScroll(isOpen);

    useEffect(() => {
        if (!isOpen) return;

        let isActive = true;

        const loadSettings = async () => {
            setError(null);
            setIsLoading(true);

            try {
                const response = await fetch("/api/admin/settings", {cache: "no-store"});
                const payload: unknown = await response.json().catch(() => null);

                if (!response.ok) {
                    if (isActive) setError(getErrorMessage(payload, "Не вдалося завантажити налаштування."));
                    return;
                }

                if (
                    payload
                    && typeof payload === "object"
                    && "settings" in payload
                    && payload.settings
                    && typeof payload.settings === "object"
                ) {
                    if (isActive) setValues(getSettingsValues(payload.settings as PricingConfig));
                }
            } catch {
                if (isActive) setError("Не вдалося завантажити налаштування.");
            } finally {
                if (isActive) setIsLoading(false);
            }
        };

        void loadSettings();

        return () => {
            isActive = false;
        };
    }, [isOpen]);

    const handleClose = () => {
        if (isSaving) return;

        setError(null);
        onClose();
    };

    const setFieldValue = (field: keyof AdminSettingsValues, value: string) => {
        setValues(currentValues => ({
            ...currentValues,
            [field]: value,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsSaving(true);

        try {
            const response = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            const payload: unknown = await response.json().catch(() => null);

            if (!response.ok) {
                setError(getErrorMessage(payload, "Не вдалося зберегти налаштування."));
                return;
            }

            if (
                payload
                && typeof payload === "object"
                && "settings" in payload
                && payload.settings
                && typeof payload.settings === "object"
            ) {
                setValues(getSettingsValues(payload.settings as PricingConfig));
            }

            onClose();
            router.push("/");
            router.refresh();
        } catch {
            setError("Не вдалося зберегти налаштування.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen || typeof document === "undefined") return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[220] flex items-center justify-center bg-black/28 px-4 backdrop-blur-md"
            onClick={handleClose}
        >
            <div
                className="vitan-sheet-panel relative flex max-h-[90vh] w-full max-w-sm flex-col overflow-hidden rounded-[var(--radius-2xl)]"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-center justify-between gap-4 px-5 py-4">
                    <h2 className="text-[18px] font-semibold leading-6 text-[var(--text-primary)]">Налаштування</h2>
                    <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--fill)] text-[var(--text-secondary)] transition-transform active:scale-[0.92]"
                        onClick={handleClose}
                        aria-label="Закрити"
                        disabled={isSaving}
                    >
                        <CloseIcon />
                    </button>
                </div>

                <form className="grid min-h-0 gap-3 overflow-y-auto px-5 pb-5" onSubmit={handleSubmit}>
                    <label className="grid gap-1.5 text-[13px] font-semibold leading-[18px] text-[var(--text-secondary)]">
                        Курс USD до грн
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={values.usdToUahRate}
                            onChange={(event) => setFieldValue("usdToUahRate", event.target.value)}
                            className="rounded-[var(--radius-sm)] bg-[var(--fill-tertiary)] px-4 py-3 text-[17px] leading-[22px] text-[var(--text-primary)] shadow-[inset_0_0_0_1px_var(--separator)] outline-none transition-shadow focus:shadow-[inset_0_0_0_2px_var(--label)]"
                            disabled={isLoading || isSaving}
                            required
                        />
                    </label>

                    <label className="grid gap-1.5 text-[13px] font-semibold leading-[18px] text-[var(--text-secondary)]">
                        Роздрібна націнка, %
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={values.retailMarkup}
                            onChange={(event) => setFieldValue("retailMarkup", event.target.value)}
                            className="rounded-[var(--radius-sm)] bg-[var(--fill-tertiary)] px-4 py-3 text-[17px] leading-[22px] text-[var(--text-primary)] shadow-[inset_0_0_0_1px_var(--separator)] outline-none transition-shadow focus:shadow-[inset_0_0_0_2px_var(--label)]"
                            disabled={isLoading || isSaving}
                            required
                        />
                    </label>

                    <label className="grid gap-1.5 text-[13px] font-semibold leading-[18px] text-[var(--text-secondary)]">
                        Оптова націнка, %
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={values.wholesaleMarkup}
                            onChange={(event) => setFieldValue("wholesaleMarkup", event.target.value)}
                            className="rounded-[var(--radius-sm)] bg-[var(--fill-tertiary)] px-4 py-3 text-[17px] leading-[22px] text-[var(--text-primary)] shadow-[inset_0_0_0_1px_var(--separator)] outline-none transition-shadow focus:shadow-[inset_0_0_0_2px_var(--label)]"
                            disabled={isLoading || isSaving}
                            required
                        />
                    </label>

                    <label className="grid gap-1.5 text-[13px] font-semibold leading-[18px] text-[var(--text-secondary)]">
                        Опис оптової ціни
                        <input
                            type="text"
                            maxLength={256}
                            value={values.wholesaleDescription}
                            onChange={(event) => setFieldValue("wholesaleDescription", event.target.value)}
                            className="rounded-[var(--radius-sm)] bg-[var(--fill-tertiary)] px-4 py-3 text-[17px] leading-[22px] text-[var(--text-primary)] shadow-[inset_0_0_0_1px_var(--separator)] outline-none transition-shadow focus:shadow-[inset_0_0_0_2px_var(--label)]"
                            disabled={isLoading || isSaving}
                        />
                    </label>

                    <label className="grid gap-1.5 text-[13px] font-semibold leading-[18px] text-[var(--text-secondary)]">
                        Оптова ціна діє від, грн
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={values.optPrice}
                            onChange={(event) => setFieldValue("optPrice", event.target.value)}
                            className="rounded-[var(--radius-sm)] bg-[var(--fill-tertiary)] px-4 py-3 text-[17px] leading-[22px] text-[var(--text-primary)] shadow-[inset_0_0_0_1px_var(--separator)] outline-none transition-shadow focus:shadow-[inset_0_0_0_2px_var(--label)]"
                            disabled={isLoading || isSaving}
                            required
                        />
                    </label>

                    <label className="grid gap-1.5 text-[13px] font-semibold leading-[18px] text-[var(--text-secondary)]">
                        Опис після активації опту
                        <input
                            type="text"
                            maxLength={256}
                            value={values.descriptionAfterOptValid}
                            onChange={(event) => setFieldValue("descriptionAfterOptValid", event.target.value)}
                            className="rounded-[var(--radius-sm)] bg-[var(--fill-tertiary)] px-4 py-3 text-[17px] leading-[22px] text-[var(--text-primary)] shadow-[inset_0_0_0_1px_var(--separator)] outline-none transition-shadow focus:shadow-[inset_0_0_0_2px_var(--label)]"
                            disabled={isLoading || isSaving}
                        />
                    </label>

                    {error && <p className="rounded-[var(--radius-sm)] bg-[rgba(255,59,48,0.1)] px-4 py-3 text-sm text-[var(--destructive)]">{error}</p>}

                    <button
                        type="submit"
                        className="vitan-accent-button inline-flex items-center justify-center gap-2 rounded-[var(--radius-capsule)] px-5 py-2.5 text-sm font-semibold transition-transform active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isLoading || isSaving}
                    >
                        {(isLoading || isSaving) && <LoadingSpinnerIcon />}
                        Зберегти налаштування
                    </button>
                </form>
            </div>
        </div>,
        document.body,
    );
};
