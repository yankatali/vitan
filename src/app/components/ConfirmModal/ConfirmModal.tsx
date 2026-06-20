interface ConfirmModalProps {
    isOpen: boolean;
    text: string;
    onCancel: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export const ConfirmModal = ({
                                 isOpen,
                                 text,
                                 onCancel,
                                 onConfirm,
                                 isLoading = false,
                             }: ConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/28 px-2 py-2 backdrop-blur-md min-[744px]:items-center min-[744px]:px-4">
            <div className="vitan-sheet-panel flex w-full max-w-sm flex-col overflow-hidden rounded-[var(--radius-2xl)]">
                <span className="mx-auto mt-2 h-1.5 w-10 shrink-0 rounded-full bg-[var(--label-quaternary)]" aria-hidden="true" />
                <div className="grid gap-6 px-5 pb-5 pt-5">
                    <p className="text-[17px] font-medium leading-[22px] tracking-[-0.2px] text-[var(--text-primary)]">{text}</p>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            className="rounded-[var(--radius-capsule)] bg-[var(--fill)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition-transform hover:bg-[var(--fill-secondary)] active:scale-[0.96]"
                            onClick={onCancel}
                        >
                            Скасувати
                        </button>

                        <button
                            type="button"
                            className="rounded-[var(--radius-capsule)] bg-[rgba(255,59,48,0.12)] px-5 py-2.5 text-sm font-semibold text-[var(--destructive)] transition-transform hover:bg-[rgba(255,59,48,0.2)] active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={onConfirm}
                            disabled={isLoading}
                        >
                            Видалити
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
