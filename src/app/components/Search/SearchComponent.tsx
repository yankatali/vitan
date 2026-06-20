"use client";

import SearchIcon from "@/app/components/icon/SearchIcon";

interface SearchComponentProps {
    id?: string;
    name?: string;
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
}

export const SearchComponent = ({
    id = "product-search",
    name = "product-search",
    value,
    onChange,
    placeholder = "Пошук товару",
}: SearchComponentProps)=> {

    return (
        <div className="vitan-glass-chip flex h-10 min-w-0 items-center gap-2 rounded-[var(--radius-capsule)] px-4 text-[var(--text-secondary)]">
            <SearchIcon />
            <input type="text"
                   id={id}
                   name={name}
                   value={value}
                   onChange={(event) => onChange?.(event.target.value)}
                   placeholder={placeholder}
                   className="w-full min-w-0 bg-transparent text-[15px] leading-5 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"/>
            </div>
    )
}
