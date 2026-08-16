import dynamic from "next/dynamic";
import {useState} from "react";
import {useProductCreatorDisclosure} from "@/hooks/useProductCreatorDisclosure";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {CREATE_PRODUCT_MODAL_CLASS_NAMES} from "@/constants/createProduct";
import {PlusIcon} from "@/app/components/icon/PlusIcon";
import SearchIcon from "@/app/components/icon/SearchIcon";
import {SettingsIcon} from "@/app/components/icon/SettingsIcon";
import type {ProductCreatorProps} from "@/types/createProduct";

interface SearchComponentProps {
    id?: string;
    name?: string;
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
}

const DynamicAdminSettingsModal = dynamic(
    () => import("@/app/components/AdminSettings/AdminSettingsModal").then(module => module.AdminSettingsModal),
    {ssr: false},
);

const DynamicProductCreateModal = dynamic(
    () => import("@/app/components/ProductCreator/ProductCreateModal").then(module => module.ProductCreateModal),
    {ssr: false},
);

export const ProductCreator = ({categoryOptions, onProductCreated, pricingConfig}: ProductCreatorProps) => {
    const {close, isOpen, open} = useProductCreatorDisclosure();
    const copy = useSiteContent().productForm;

    return (
        <>
            <button type="button" onClick={open} className={CREATE_PRODUCT_MODAL_CLASS_NAMES.trigger} aria-label={copy.addProductAriaLabel}>
                <PlusIcon />
            </button>
            <DynamicProductCreateModal
                categoryOptions={categoryOptions}
                isOpen={isOpen}
                onClose={close}
                onProductCreated={onProductCreated}
                pricingConfig={pricingConfig}
            />
        </>
    );
};

export const AdminSettingsButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const copy = useSiteContent().adminSettings;

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="vitan-accent-button flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-[0.94]"
                aria-label={copy.triggerAriaLabel}
            >
                <SettingsIcon />
            </button>
            <DynamicAdminSettingsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export const SearchComponent = ({
    id = "product-search",
    name = "product-search",
    value,
    onChange,
    placeholder,
}: SearchComponentProps) => {
    const copy = useSiteContent().catalog;

    return (
        <div className="vitan-glass-chip flex h-10 min-w-0 items-center gap-2 rounded-[var(--radius-capsule)] px-4 text-[var(--text-secondary)]">
            <SearchIcon />
            <input
                type="text"
                id={id}
                name={name}
                value={value}
                onChange={(event) => onChange?.(event.target.value)}
                placeholder={placeholder ?? copy.searchPlaceholder}
                className="w-full min-w-0 bg-transparent text-[15px] leading-5 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
            />
        </div>
    );
};
