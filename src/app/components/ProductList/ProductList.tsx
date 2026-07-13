"use client";

import Link from "next/link";
import {useEffect, useMemo, useRef, useState} from "react";
import {SearchComponent} from "@/app/components/Search/SearchComponent";
import {PRODUCT_CREATOR_WRAPPER_CLASS_NAME, PRODUCT_SORT_LABELS, PRODUCT_SORT_OPTIONS} from "@/constants/products";
import {PRODUCT_CATEGORY_LABELS, PRODUCT_LIST_CLASS_NAMES} from "@/constants/productListLayout";
import {useProductList} from "@/app/components/ProductList/useProductList";
import {ProductListResults} from "@/app/components/ProductList/ProductListResults";
import {ProductCreator} from "@/app/components/ProductCreator/ProductCreator";
import {FiltersSheet} from "@/app/components/FiltersSheet/FiltersSheet";
import {PageHeader} from "@/app/components/PageHeader/PageHeader";
import type {CatalogSortOption} from "@/types/catalog";
import type {ProductListProps} from "@/types/productList";
import type {PricingConfig} from "@/types/pricingConfig";

const getUahPrice = (priceUsd: number | undefined, config: PricingConfig | null | undefined): number | null => {
    if (!priceUsd || !config?.usdToUahRate) return null;
    const markup = config.retailMarkup ?? 30;
    return Math.round(priceUsd * (1 + markup / 100) * config.usdToUahRate);
};

const getCategoryButtonClassName = (isSelected: boolean) => {
    const baseClassName = "inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-lg)] px-4 text-[15px] font-semibold leading-none tracking-[-0.1px] transition-all duration-200 active:scale-[0.94]";
    if (isSelected) return `${baseClassName} vitan-accent-button text-white`;

    return `${baseClassName} bg-[var(--fill)] text-[var(--text-primary)] hover:bg-[var(--fill-secondary)]`;
};

const getSortOptionButtonClassName = (isSelected: boolean) => {
    const baseClassName = "inline-flex min-h-11 w-full items-center justify-between gap-3 rounded-[var(--radius-lg)] px-4 text-left text-[15px] leading-none tracking-[-0.1px] transition-all duration-200 active:scale-[0.98]";
    if (isSelected) return `${baseClassName} bg-black/8 font-semibold text-[var(--text-primary)]`;

    return `${baseClassName} font-medium text-[var(--text-primary)] hover:bg-[var(--fill)]`;
};

const SortIcon = () => {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M6 3.75v10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M3.25 6.5 6 3.75 8.75 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 14.25V3.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M9.25 11.5 12 14.25l2.75-2.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

const FilterIcon = () => {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M3 5.25h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M5.25 9h7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M7.5 12.75h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
};

const CheckIcon = () => {
    return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <path d="M3.25 7.8 6.15 10.5 11.75 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export const ProductList = ({
    initialProducts,
    defaultSort,
    searchPlaceholder = "Пошук товару",
    categories = [],
    sortOptions = PRODUCT_SORT_OPTIONS,
    showCategories = false,
    showSort = false,
    showCategoryOnCard = false,
    showCreateProductButton = false,
    showDeleteProductButton = false,
    usdToUahRate = null,
    pricingConfig,
    rootClassName,
    productCreatorWrapperClassName = PRODUCT_CREATOR_WRAPPER_CLASS_NAME,
    toolbarClassName,
    toolbarTitle,
    searchWrapperClassName,
    filterWrapperClassName = "flex flex-wrap gap-2 px-3",
    sortWrapperClassName = "px-3",
    gridClassName,
    messageClassName,
}: ProductListProps) => {
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [priceMin, setPriceMin] = useState(0);
    const [priceMax, setPriceMax] = useState(0);
    const priceInitialized = useRef(false);
    const {
        availableCategories,
        error,
        gridRef,
        hasMore,
        isLoading,
        items,
        loadMoreRef,
        query,
        refreshProducts,
        selectedCategories,
        setQuery,
        setSelectedCategories,
        setSortBy,
        sortBy,
    } = useProductList({
        initialProducts,
        defaultSort,
        categories,
    });
    // Price range
    const {absoluteMin, absoluteMax} = useMemo(() => {
        const prices = items
            .map(i => getUahPrice(i.priceUsd, pricingConfig))
            .filter((p): p is number => p !== null);
        if (!prices.length) return {absoluteMin: 0, absoluteMax: 0};
        return {absoluteMin: Math.floor(Math.min(...prices)), absoluteMax: Math.ceil(Math.max(...prices))};
    }, [items, pricingConfig]);

    useEffect(() => {
        if (absoluteMax > absoluteMin && !priceInitialized.current) {
            setPriceMin(absoluteMin);
            setPriceMax(absoluteMax);
            priceInitialized.current = true;
        }
    }, [absoluteMin, absoluteMax]);

    const isPriceFilterActive = absoluteMax > absoluteMin && (priceMin > absoluteMin || priceMax < absoluteMax);
    const activeFilterCount = selectedCategories.length + (isPriceFilterActive ? 1 : 0);

    const filteredItems = useMemo(() => {
        if (!isPriceFilterActive) return items;
        return items.filter(item => {
            const price = getUahPrice(item.priceUsd, pricingConfig);
            if (price === null) return true;
            return price >= priceMin && price <= priceMax;
        });
    }, [items, isPriceFilterActive, priceMin, priceMax, pricingConfig]);

    const handleClear = () => {
        setSelectedCategories([]);
        setPriceMin(absoluteMin);
        setPriceMax(absoluteMax);
    };

    const shouldShowToolbarCategories = showCategories && Boolean(toolbarClassName);
    const shouldShowInlineCategories = showCategories && !toolbarClassName;
    const shouldShowToolbarTitleGroup = Boolean(toolbarTitle) || shouldShowToolbarCategories;
    const shouldShowToolbarSort = showSort && Boolean(toolbarClassName);
    const shouldShowInlineSort = showSort && !toolbarClassName;
    const categoryRef = useRef<HTMLDivElement>(null);
    const sortRef = useRef<HTMLDivElement>(null);
    const filtersRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
                setIsCategoryDropdownOpen(false);
            }
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
                setIsSortDropdownOpen(false);
            }
            if (filtersRef.current && !filtersRef.current.contains(e.target as Node)) {
                setIsFiltersOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isSortActive = sortBy !== (defaultSort ?? sortOptions[0]);
    const handleSortSelect = (sortOption: CatalogSortOption) => {
        setSortBy(sortOption);
        setIsSortDropdownOpen(false);
    };
    const toggleSortDropdown = () => {
        setIsSortDropdownOpen(currentValue => !currentValue);
    };
    const filterDropdown = (
        <div ref={filtersRef} className={PRODUCT_LIST_CLASS_NAMES.categoryDropdownWrapper}>
            <button
                type="button"
                onClick={() => setIsFiltersOpen(v => !v)}
                className={isFiltersOpen || activeFilterCount > 0 ? `${PRODUCT_LIST_CLASS_NAMES.filterButton} liquid-button-selected` : PRODUCT_LIST_CLASS_NAMES.filterButton}
                aria-haspopup="dialog"
                aria-expanded={isFiltersOpen}
            >
                <FilterIcon />
                {PRODUCT_CATEGORY_LABELS.filters}
                {activeFilterCount > 0 && (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#1c1c1e] px-1.5 text-xs font-bold leading-5 text-white">
                        {activeFilterCount}
                    </span>
                )}
            </button>
            <FiltersSheet
                open={isFiltersOpen}
                categories={availableCategories}
                selectedCategories={selectedCategories}
                onCategoriesChange={setSelectedCategories}
                priceMin={priceMin}
                priceMax={priceMax}
                absoluteMin={absoluteMin}
                absoluteMax={absoluteMax}
                onPriceChange={(mn, mx) => { setPriceMin(mn); setPriceMax(mx); }}
                activeFilterCount={activeFilterCount}
                onClear={handleClear}
                onClose={() => setIsFiltersOpen(false)}
            />
        </div>
    );
    const sortDropdown = (
        <div ref={sortRef} className={PRODUCT_LIST_CLASS_NAMES.sortDropdownWrapper}>
            <button
                type="button"
                onClick={toggleSortDropdown}
                className={isSortDropdownOpen ? `${PRODUCT_LIST_CLASS_NAMES.sortButton} liquid-button-selected` : PRODUCT_LIST_CLASS_NAMES.sortButton}
                aria-label={`Сортування: ${PRODUCT_SORT_LABELS[sortBy]}`}
                aria-expanded={isSortDropdownOpen}
            >
                <SortIcon />
                {isSortActive && (
                    <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-[#1c1c1e] ring-2 ring-white" />
                )}
            </button>

            {isSortDropdownOpen && (
                <div className={PRODUCT_LIST_CLASS_NAMES.sortDropdownMenu}>
                    {sortOptions.map(option => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => handleSortSelect(option)}
                            className={getSortOptionButtonClassName(sortBy === option)}
                            aria-pressed={sortBy === option}
                        >
                            <span>{PRODUCT_SORT_LABELS[option]}</span>
                            {sortBy === option && <CheckIcon />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className={rootClassName}>
            {toolbarClassName && (
                <div className="sticky top-0 z-20 flex flex-col">
                    <PageHeader className="flex items-center justify-between gap-4">
                        {shouldShowToolbarTitleGroup && (
                            <div className={PRODUCT_LIST_CLASS_NAMES.mainPageToolbarTitleGroup}>
                                {toolbarTitle && <Link href="/" className={PRODUCT_LIST_CLASS_NAMES.mainPageToolbarTitle}>{toolbarTitle}</Link>}
                            </div>
                        )}

                        <div className={searchWrapperClassName}>
                            <SearchComponent
                                value={query}
                                onChange={setQuery}
                                placeholder={searchPlaceholder}
                            />
                        </div>

                        <div className={PRODUCT_LIST_CLASS_NAMES.mainPageActions}>
                            {showCreateProductButton && (
                                <div className={productCreatorWrapperClassName}>
                                    <ProductCreator
                                        categoryOptions={availableCategories}
                                        onProductCreated={refreshProducts}
                                    />
                                </div>
                            )}
                        </div>
                    </PageHeader>

                    {(shouldShowToolbarCategories || shouldShowToolbarSort) && (
                        <div className={PRODUCT_LIST_CLASS_NAMES.categoryInlineRow}>
                            <div>{shouldShowToolbarCategories && filterDropdown}</div>
                            <div>{shouldShowToolbarSort && sortDropdown}</div>
                        </div>
                    )}
                </div>
            )}

            {shouldShowInlineCategories && (
                <div className={filterWrapperClassName}>
                    {filterDropdown}
                </div>
            )}

            {shouldShowInlineSort && (
                <div className={sortWrapperClassName}>
                    {sortDropdown}
                </div>
            )}

            <ProductListResults
                categoryOptions={availableCategories}
                error={error}
                gridRef={gridRef}
                gridClassName={gridClassName}
                hasMore={hasMore}
                isLoading={isLoading}
                items={filteredItems}
                loadMoreRef={loadMoreRef}
                messageClassName={messageClassName}
                onProductDeleted={refreshProducts}
                showCategoryOnCard={showCategoryOnCard}
                showAdminActions={showDeleteProductButton}
                usdToUahRate={usdToUahRate}
                pricingConfig={pricingConfig}
            />

        </div>
    );
};
