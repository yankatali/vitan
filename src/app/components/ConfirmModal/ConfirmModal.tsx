import {createPortal} from "react-dom";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {useLockScroll} from "@/hooks/useLockScroll";

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
    useLockScroll(isOpen);
    const copy = useSiteContent().common;
    if (!isOpen || typeof document === "undefined") return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/28 px-4 backdrop-blur-md"
            onClick={onCancel}
        >
            <div
                className="vitan-sheet-panel flex w-full max-w-sm flex-col overflow-hidden rounded-[var(--radius-2xl)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="grid gap-6 px-5 pb-5 pt-5">
                    <p className="text-[17px] font-medium leading-[22px] tracking-[-0.2px] text-[var(--text-primary)]">{text}</p>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            className="rounded-[var(--radius-capsule)] bg-[var(--fill)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition-transform hover:bg-[var(--fill-secondary)] active:scale-[0.96]"
                            onClick={onCancel}
                        >
                            {copy.confirmCancelButton}
                        </button>

                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-[var(--radius-capsule)] bg-[rgba(255,59,48,0.12)] px-5 py-2.5 text-sm font-semibold text-[var(--destructive)] transition-transform hover:bg-[rgba(255,59,48,0.2)] active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={onConfirm}
                            disabled={isLoading}
                        >
                            {isLoading && (
                                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                </svg>
                            )}
                            {copy.confirmDeleteButton}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
