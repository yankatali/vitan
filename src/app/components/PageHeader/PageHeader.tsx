import type {ReactNode} from "react";

interface PageHeaderProps {
    children: ReactNode;
    className?: string;
    isProductList?: boolean;
}

const cx = (...classNames: Array<string | false | null | undefined>) => {
    return classNames.filter(Boolean).join(" ");
};

const defaultPaddingClassName = "pl-5 pr-3 pb-3 pt-3 md:pl-6 lg:pr-6 xl:pr-[36px]";
const otherPagesPaddingClassName = "pl-5 pr-5 pb-3 pt-3 md:pl-6 xl:pr-[36px]";

export const PageHeader = ({isProductList, children, className = ""}: PageHeaderProps) => (
    <div
        className={cx(
            "isolate flex min-h-[64px] items-center justify-between gap-4 rounded-full bg-white/80 shadow-[inset_0_-1px_1px_rgba(0,0,0,0.05),0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-md backdrop-saturate-[140%]",
            isProductList ? defaultPaddingClassName : otherPagesPaddingClassName,
            className,
        )}
    >
        {children}
    </div>
);
