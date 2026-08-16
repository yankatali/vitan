"use client";

import {useState} from "react";

export const useProductCreatorDisclosure = () => {
    const [isOpen, setIsOpen] = useState(false);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    return {
        close,
        isOpen,
        open,
    };
};
