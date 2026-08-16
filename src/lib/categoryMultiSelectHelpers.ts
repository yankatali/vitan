import type {SiteContent} from "@/constants/siteContent";

export const getSelectionLabel = (selectedCategories: string[], copy: SiteContent["categoryMultiSelect"]) => {
    if (!selectedCategories.length) return copy.placeholder;
    if (selectedCategories.length <= 2) return selectedCategories.join(", ");

    return `${copy.selectedCountPrefix} ${selectedCategories.length}`;
};

const getCategoryKey = (category: string) => category.trim().toLowerCase();

export const getOptionsWithSelectedCategories = (options: string[], selectedCategories: string[]) => {
    const seenCategories = new Set<string>();

    return [...options, ...selectedCategories]
        .map(category => category.trim())
        .filter(category => {
            if (!category) return false;

            const key = getCategoryKey(category);
            if (seenCategories.has(key)) return false;

            seenCategories.add(key);
            return true;
        });
};
