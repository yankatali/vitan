"use client";

import {useState} from "react";
import {AdminSettingsModal} from "@/app/components/AdminSettings/AdminSettingsModal";
import {SettingsIcon} from "@/app/components/icon/SettingsIcon";

export const AdminSettingsButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="vitan-accent-button flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-[0.94]"
                aria-label="Налаштування"
            >
                <SettingsIcon />
            </button>
            <AdminSettingsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};
