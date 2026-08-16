import {useEffect, useMemo, useRef, useState} from "react";
import {getOptionsWithSelectedCategories, getSelectionLabel} from "@/lib/categoryMultiSelectHelpers";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {CREATE_PRODUCT_FIELD_NAMES, CREATE_PRODUCT_MODAL_CLASS_NAMES} from "@/constants/createProduct";
import type {CategoryMultiSelectProps} from "@/types/props";


export const CategoryMultiSelect = ({
    onToggle,
    options,
    selectedCategories,
}: CategoryMultiSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const copy = useSiteContent().categoryMultiSelect;
    const categoryOptions = useMemo(
        () => getOptionsWithSelectedCategories(options, selectedCategories),
        [options, selectedCategories],
    );

    useEffect(() => {
        if (!isOpen) return;

        const closeIfOutside = (event: Event) => {
            const target = event.target;
            if (!(target instanceof Node)) return;
            if (rootRef.current?.contains(target)) return;

            setIsOpen(false);
        };

        document.addEventListener("pointerdown", closeIfOutside);
        document.addEventListener("focusin", closeIfOutside);

        return () => {
            document.removeEventListener("pointerdown", closeIfOutside);
            document.removeEventListener("focusin", closeIfOutside);
        };
    }, [isOpen]);

    return (
        <div ref={rootRef} className={CREATE_PRODUCT_MODAL_CLASS_NAMES.label}>
            <span>{copy.label}</span>
            <details
                className={CREATE_PRODUCT_MODAL_CLASS_NAMES.categorySelect}
                open={isOpen}
                onToggle={(event) => setIsOpen(event.currentTarget.open)}
            >
                <summary
                    className={CREATE_PRODUCT_MODAL_CLASS_NAMES.categorySelectTrigger}
                    onClick={(event) => {
                        event.preventDefault();
                        setIsOpen(currentValue => !currentValue);
                    }}
                >
                    <span className="min-w-0 truncate">{getSelectionLabel(selectedCategories, copy)}</span>
                    <svg
                        className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M5 7l5 5 5-5" />
                    </svg>
                </summary>

                <div className={CREATE_PRODUCT_MODAL_CLASS_NAMES.categorySelectMenu}>
                    {categoryOptions.map(category => (
                        <label key={category} className={CREATE_PRODUCT_MODAL_CLASS_NAMES.checkboxLabel}>
                            <input
                                name={CREATE_PRODUCT_FIELD_NAMES.categories}
                                value={category}
                                checked={selectedCategories.includes(category)}
                                onChange={() => onToggle(category)}
                                className={CREATE_PRODUCT_MODAL_CLASS_NAMES.checkbox}
                                type="checkbox"
                            />
                            <span className="min-w-0 break-words">{category}</span>
                        </label>
                    ))}

                    {!categoryOptions.length && (
                        <span className={CREATE_PRODUCT_MODAL_CLASS_NAMES.categorySelectEmpty}>
                            {copy.empty}
                        </span>
                    )}
                </div>
            </details>
        </div>
    );
};
