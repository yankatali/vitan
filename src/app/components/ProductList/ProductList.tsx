"use client";

import {useState} from "react";
import {SearchComponent} from "@/app/components/Search/SearchComponent";
import {PRODUCT_CREATOR_WRAPPER_CLASS_NAME, PRODUCT_SORT_LABELS, PRODUCT_SORT_OPTIONS} from "@/constants/products";
import {PRODUCT_CATEGORY_LABELS, PRODUCT_LIST_CLASS_NAMES} from "@/constants/productListLayout";
import {HEADER_HOME_ICON_NAME} from "@/constants/header";
import {getHeaderNavItems} from "@/app/components/Header/Header";
import {useSavedProductCounts} from "@/app/components/Header/useSavedProductCounts";
import {useProductList} from "@/app/components/ProductList/useProductList";
import {ProductListResults} from "@/app/components/ProductList/ProductListResults";
import {ProductCreator} from "@/app/components/ProductCreator/ProductCreator";
import type {CatalogSortOption} from "@/types/catalog";
import type {ProductListProps} from "@/types/productList";

const getCategoryButtonClassName = (isSelected: boolean) => {
    const baseClassName = "inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-capsule)] px-4 text-[15px] font-semibold leading-none tracking-[-0.1px] transition-all duration-200 active:scale-[0.94]";
    if (isSelected) return `${baseClassName} vitan-accent-button text-white`;

    return `${baseClassName} bg-[var(--fill)] text-[var(--text-primary)] hover:bg-[var(--fill-secondary)]`;
};

const getSortOptionButtonClassName = (isSelected: boolean) => {
    const baseClassName = "inline-flex min-h-11 w-full items-center justify-between gap-3 rounded-[var(--radius-sm)] px-3 text-left text-[15px] leading-none tracking-[-0.1px] transition-all duration-200 active:scale-[0.98]";
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
    rootClassName,
    productCreatorWrapperClassName = PRODUCT_CREATOR_WRAPPER_CLASS_NAME,
    toolbarButtons = [],
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
    const savedProductCounts = useSavedProductCounts();
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
        selectedCategory,
        setQuery,
        setSelectedCategory,
        setSortBy,
        sortBy,
    } = useProductList({
        initialProducts,
        defaultSort,
        categories,
    });
    const shouldShowToolbarCategories = showCategories && Boolean(toolbarClassName);
    const shouldShowInlineCategories = showCategories && !toolbarClassName;
    const shouldShowToolbarTitleGroup = Boolean(toolbarTitle) || shouldShowToolbarCategories;
    const shouldShowToolbarSort = showSort && Boolean(toolbarClassName);
    const shouldShowInlineSort = showSort && !toolbarClassName;
    const isFilterActive = selectedCategory !== "all";
    const isSortActive = sortBy !== (defaultSort ?? sortOptions[0]);
    const desktopToolbarButtons = toolbarButtons.filter(({iconName}) => iconName !== HEADER_HOME_ICON_NAME);
    const desktopToolbarNavItems = getHeaderNavItems(desktopToolbarButtons, 20, savedProductCounts);
    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        setIsCategoryDropdownOpen(false);
    };
    const toggleCategoryDropdown = () => {
        setIsCategoryDropdownOpen(currentValue => !currentValue);
        setIsSortDropdownOpen(false);
    };
    const handleSortSelect = (sortOption: CatalogSortOption) => {
        setSortBy(sortOption);
        setIsSortDropdownOpen(false);
    };
    const toggleSortDropdown = () => {
        setIsSortDropdownOpen(currentValue => !currentValue);
        setIsCategoryDropdownOpen(false);
    };
    const categoryButtons = (
        <>
            <button
                type="button"
                onClick={() => handleCategorySelect("all")}
                className={getCategoryButtonClassName(selectedCategory === "all")}
                aria-pressed={selectedCategory === "all"}
            >
                {selectedCategory === "all" && <CheckIcon />}
                {PRODUCT_CATEGORY_LABELS.allOption}
            </button>
            {availableCategories.map(category => (
                <button
                    key={category}
                    type="button"
                    onClick={() => handleCategorySelect(category)}
                    className={getCategoryButtonClassName(selectedCategory === category)}
                    aria-pressed={selectedCategory === category}
                >
                    {selectedCategory === category && <CheckIcon />}
                    {category}
                </button>
            ))}
        </>
    );
    const filterDropdown = (
        <div className={PRODUCT_LIST_CLASS_NAMES.categoryDropdownWrapper}>
            <button
                type="button"
                onClick={toggleCategoryDropdown}
                className={isCategoryDropdownOpen ? `${PRODUCT_LIST_CLASS_NAMES.filterButton} liquid-button-selected` : PRODUCT_LIST_CLASS_NAMES.filterButton}
                aria-expanded={isCategoryDropdownOpen}
            >
                <FilterIcon />
                {PRODUCT_CATEGORY_LABELS.filters}
                {isFilterActive && (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#1c1c1e] px-1.5 text-xs font-bold leading-5 text-white">
                        1
                    </span>
                )}
            </button>

            {isCategoryDropdownOpen && (
                <div className={PRODUCT_LIST_CLASS_NAMES.categoryDropdownMenu}>
                    {categoryButtons}
                </div>
            )}
        </div>
    );
    const sortDropdown = (
        <div className={PRODUCT_LIST_CLASS_NAMES.sortDropdownWrapper}>
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
            <div className={toolbarClassName}>
                <div className={PRODUCT_LIST_CLASS_NAMES.mainPageToolbarInner}>
                    {shouldShowToolbarTitleGroup && (
                        <div className={PRODUCT_LIST_CLASS_NAMES.mainPageToolbarTitleGroup}>
                            {toolbarTitle && <h2 className={PRODUCT_LIST_CLASS_NAMES.mainPageToolbarTitle}>{toolbarTitle}</h2>}
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
                        {Boolean(desktopToolbarNavItems.length) && (
                            <nav className={PRODUCT_LIST_CLASS_NAMES.mainPageToolbarNav}>
                                {desktopToolbarNavItems}
                            </nav>
                        )}

                        {showCreateProductButton && (
                            <div className={productCreatorWrapperClassName}>
                                <ProductCreator
                                    categoryOptions={availableCategories}
                                    onProductCreated={refreshProducts}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {(shouldShowToolbarCategories || shouldShowToolbarSort) && (
                    <div className={PRODUCT_LIST_CLASS_NAMES.categoryInlineRow}>
                        <div>{shouldShowToolbarCategories && filterDropdown}</div>
                        <div>{shouldShowToolbarSort && sortDropdown}</div>
                    </div>
                )}
            </div>

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
                items={items}
                loadMoreRef={loadMoreRef}
                messageClassName={messageClassName}
                onProductDeleted={refreshProducts}
                showCategoryOnCard={showCategoryOnCard}
                showAdminActions={showDeleteProductButton}
                usdToUahRate={usdToUahRate}
            />
        </div>
    );
};
