import type {ReactNode} from "react";
import {DEFAULT_PAGE_HEADER_PADDING_CLASS_NAME, OTHER_PAGES_HEADER_PADDING_CLASS_NAME} from "@/constants/pageHeader";

interface PageHeaderProps {
    children: ReactNode;
    className?: string;
    isProductList?: boolean;
}

export const PageHeader = ({isProductList, children, className = ""}: PageHeaderProps) => (
    <div
        className={`isolate flex min-h-[64px] items-center justify-between gap-4 rounded-full bg-white/80 shadow-[inset_0_-1px_1px_rgba(0,0,0,0.05),0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-md backdrop-saturate-[140%] ${isProductList ? DEFAULT_PAGE_HEADER_PADDING_CLASS_NAME : OTHER_PAGES_HEADER_PADDING_CLASS_NAME} ${className}`.trim()}
    >
        {children}
    </div>
);
