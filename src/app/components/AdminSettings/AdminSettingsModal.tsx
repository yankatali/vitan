import {FormEvent, useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {useRouter} from "next/navigation";
import {fetchAdminSettings, saveAdminSettings} from "@/lib/adminSettingsApi";
import {ADMIN_SETTINGS_FIELDS, EMPTY_SETTINGS_VALUES, type AdminSettingsValues} from "@/constants/adminSettings";
import {CloseIcon} from "@/app/components/icon/CloseIcon";
import {LoadingSpinnerIcon} from "@/app/components/icon/LoadingSpinnerIcon";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {useLockScroll} from "@/hooks/useLockScroll";
import type {AdminSettingsModalProps} from "@/types/props";


export const AdminSettingsModal = ({isOpen, onClose}: AdminSettingsModalProps) => {
    const [values, setValues] = useState<AdminSettingsValues>(EMPTY_SETTINGS_VALUES);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const router = useRouter();
    const copy = useSiteContent().adminSettings;

    useLockScroll(isOpen);

    useEffect(() => {
        if (!isOpen) return;

        let isActive = true;

        const loadSettings = async () => {
            setError(null);
            setIsLoading(true);

            try {
                const settingsValues = await fetchAdminSettings(copy);
                if (isActive && settingsValues) setValues(settingsValues);
            } catch (error) {
                if (isActive) {
                    setError(error instanceof Error ? error.message : copy.loadError);
                }
            } finally {
                if (isActive) setIsLoading(false);
            }
        };

        void loadSettings();

        return () => {
            isActive = false;
        };
    }, [copy, isOpen]);

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
            const settingsValues = await saveAdminSettings(values, copy);
            if (settingsValues) setValues(settingsValues);

            onClose();
            router.push("/");
        } catch (error) {
            setError(error instanceof Error ? error.message : copy.saveError);
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
                    <h2 className="text-[18px] font-semibold leading-6 text-[var(--text-primary)]">{copy.title}</h2>
                    <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--fill)] text-[var(--text-secondary)] transition-transform active:scale-[0.92]"
                        onClick={handleClose}
                        aria-label={copy.closeAriaLabel}
                        disabled={isSaving}
                    >
                        <CloseIcon />
                    </button>
                </div>

                <form className="grid min-h-0 gap-3 overflow-y-auto px-5 pb-5" onSubmit={handleSubmit}>
                    {ADMIN_SETTINGS_FIELDS.map(({field, ...inputProps}) => (
                        <label key={field} className="grid gap-1.5 text-[13px] font-semibold leading-[18px] text-[var(--text-secondary)]">
                            {copy.fields[field]}
                            <input
                                {...inputProps}
                                value={values[field]}
                                onChange={(event) => setFieldValue(field, event.target.value)}
                                className="rounded-[var(--radius-sm)] bg-[var(--fill-tertiary)] px-4 py-3 text-[17px] leading-[22px] text-[var(--text-primary)] shadow-[inset_0_0_0_1px_var(--separator)] outline-none transition-shadow focus:shadow-[inset_0_0_0_2px_var(--label)]"
                                disabled={isLoading || isSaving}
                            />
                        </label>
                    ))}

                    {error && <p className="rounded-[var(--radius-sm)] bg-[rgba(255,59,48,0.1)] px-4 py-3 text-sm text-[var(--destructive)]">{error}</p>}

                    <button
                        type="submit"
                        className="vitan-accent-button inline-flex items-center justify-center gap-2 rounded-[var(--radius-capsule)] px-5 py-2.5 text-sm font-semibold transition-transform active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isLoading || isSaving}
                    >
                        {(isLoading || isSaving) && <LoadingSpinnerIcon />}
                        {copy.submitButton}
                    </button>
                </form>
            </div>
        </div>,
        document.body,
    );
};
