import type {ReactNode} from "react";

interface PageHeaderProps {
    children: ReactNode;
    className?: string;
}

export const PageHeader = ({children, className = ""}: PageHeaderProps) => (
    <div className={`flex min-h-[64px] items-center justify-between gap-4 rounded-full bg-white/30 pl-5 pr-3 pb-3 pt-3 md:pl-6 lg:pr-6 xl:pr-[36px] shadow-[inset_0_-1px_1px_rgba(0,0,0,0.05),0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-2xl backdrop-saturate-[180%]${className ? ` ${className}` : ""}`}>
        {children}
    </div>
);
