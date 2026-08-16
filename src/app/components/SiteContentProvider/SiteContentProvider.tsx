"use client";

import {createContext, type ReactNode, useContext} from "react";
import type {SiteContent} from "@/constants/siteContent";
import type {SiteContentProviderProps} from "@/types/props";


const SiteContentContext = createContext<SiteContent | null>(null);

export const SiteContentProvider = ({children, content}: SiteContentProviderProps) => (
    <SiteContentContext.Provider value={content}>
        {children}
    </SiteContentContext.Provider>
);

export const useSiteContent = () => {
    const content = useContext(SiteContentContext);
    if (!content) {
        throw new Error("SiteContentProvider is missing.");
    }

    return content;
};
