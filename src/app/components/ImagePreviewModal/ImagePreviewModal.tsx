"use client";

import {useEffect} from "react";
import {createPortal} from "react-dom";
import Image from "next/image";
import {CloseIcon} from "@/app/components/icon/CloseIcon";

interface ImagePreviewModalProps {
    alt: string;
    imageUrl: string;
    isOpen: boolean;
    onClose: () => void;
}

export const ImagePreviewModal = ({alt, imageUrl, isOpen, onClose}: ImagePreviewModalProps) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen || typeof document === "undefined") return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17150c]/72 p-4 backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-label={`Збільшене зображення: ${alt}`}
            onClick={onClose}
        >
            <div
                className="relative flex max-h-[92vh] max-w-[94vw] items-center justify-center"
                onClick={(event) => event.stopPropagation()}
            >
                <Image
                    src={imageUrl}
                    alt={alt}
                    width={1600}
                    height={1200}
                    className="h-auto max-h-[92vh] w-auto max-w-[94vw] rounded-[1.75rem] object-contain shadow-[0_18px_60px_rgba(0,0,0,0.28)]"
                    priority
                />
                <button
                    type="button"
                    className="liquid-button-soft absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#17150c] transition-transform hover:scale-105"
                    onClick={onClose}
                    aria-label="Закрити зображення"
                >
                    <CloseIcon />
                </button>
            </div>
        </div>,
        document.body
    );
};
