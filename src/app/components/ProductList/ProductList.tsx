import {useEffect, useMemo, useRef, useState} from "react";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {PRODUCT_CREATOR_WRAPPER_CLASS_NAME, PRODUCT_SORT_OPTIONS} from "@/constants/products";
import {PRODUCT_LIST_CLASS_NAMES} from "@/constants/productListLayout";
import {useProductList} from "@/hooks/useProductList";
import {ProductListResults} from "@/app/components/ProductList/ProductListResults";
import {ProductListFilterDropdown} from "@/app/components/ProductList/ProductListFilterDropdown";
import {ProductListSortDropdown} from "@/app/components/ProductList/ProductListSortDropdown";
import {AdminSettingsButton, ProductCreator, SearchComponent} from "@/app/components/ProductList/ProductListParts";
import {getProductListUahPrice} from "@/lib/productListPricing";
import {PageHeader} from "@/app/components/PageHeader/PageHeader";
import {HeaderBrandLink} from "@/app/components/HeaderBrandLink/HeaderBrandLink";
import type {CatalogSortOption} from "@/types/catalog";
import type {ProductListProps} from "@/types/productList";

export const ProductList = ({
    initialProducts,
    defaultSort,
    searchPlaceholder,
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
    filterWrapperClassName = PRODUCT_LIST_CLASS_NAMES.defaultFilterWrapper,
    sortWrapperClassName = PRODUCT_LIST_CLASS_NAMES.defaultSortWrapper,
    gridClassName,
    messageClassName,
}: ProductListProps) => {
    const siteContent = useSiteContent();
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [priceMin, setPriceMin] = useState(0);
    const [priceMax, setPriceMax] = useState(0);
    const [isPriceFilterDirty, setIsPriceFilterDirty] = useState(false);
    const priceInitialized = useRef(false);
    const sortRef = useRef<HTMLDivElement>(null);
    const filtersRef = useRef<HTMLDivElement>(null);

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

    const {absoluteMin, absoluteMax} = useMemo(() => {
        const prices = items
            .map(i => getProductListUahPrice(i, pricingConfig))
            .filter((p): p is number => p !== null);
        if (!prices.length) return {absoluteMin: 0, absoluteMax: 0};
        return {absoluteMin: Math.floor(Math.min(...prices)), absoluteMax: Math.ceil(Math.max(...prices))};
    }, [items, pricingConfig]);

    const isPriceFilterActive = isPriceFilterDirty
        && absoluteMax > absoluteMin
        && (priceMin > absoluteMin || priceMax < absoluteMax);
    const activeFilterCount = selectedCategories.length + (isPriceFilterActive ? 1 : 0);

    const filteredItems = useMemo(() => {
        if (!isPriceFilterActive) return items;
        return items.filter(item => {
            const price = getProductListUahPrice(item, pricingConfig);
            if (price === null) return true;
            return price >= priceMin && price <= priceMax;
        });
    }, [items, isPriceFilterActive, priceMin, priceMax, pricingConfig]);

    const shouldShowToolbarCategories = showCategories && Boolean(toolbarClassName);
    const shouldShowInlineCategories = showCategories && !toolbarClassName;
    const shouldShowToolbarTitleGroup = Boolean(toolbarTitle) || shouldShowToolbarCategories;
    const shouldShowToolbarSort = showSort && Boolean(toolbarClassName);
    const shouldShowInlineSort = showSort && !toolbarClassName;
    const isSortActive = sortBy !== (defaultSort ?? sortOptions[0]);

    useEffect(() => {
        if (absoluteMax <= absoluteMin) {
            setPriceMin(0);
            setPriceMax(0);
            setIsPriceFilterDirty(false);
            priceInitialized.current = false;
            return;
        }

        if (!priceInitialized.current || !isPriceFilterDirty) {
            setPriceMin(absoluteMin);
            setPriceMax(absoluteMax);
            priceInitialized.current = true;
            return;
        }

        setPriceMin(currentValue => Math.max(absoluteMin, Math.min(currentValue, absoluteMax)));
        setPriceMax(currentValue => Math.max(absoluteMin, Math.min(currentValue, absoluteMax)));
    }, [absoluteMin, absoluteMax, isPriceFilterDirty]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
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

    const handleClear = () => {
        setSelectedCategories([]);
        setIsPriceFilterDirty(false);
        setPriceMin(absoluteMin);
        setPriceMax(absoluteMax);
    };

    const handlePriceChange = (min: number, max: number) => {
        setIsPriceFilterDirty(true);
        setPriceMin(min);
        setPriceMax(max);
    };

    const handleSortSelect = (sortOption: CatalogSortOption) => {
        setSortBy(sortOption);
        setIsSortDropdownOpen(false);
    };
    const toggleSortDropdown = () => {
        setIsSortDropdownOpen(currentValue => !currentValue);
    };
    const filterDropdown = (
        <ProductListFilterDropdown
            ref={filtersRef}
            open={isFiltersOpen}
            categories={availableCategories}
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
            priceMin={priceMin}
            priceMax={priceMax}
            absoluteMin={absoluteMin}
            absoluteMax={absoluteMax}
            onPriceChange={handlePriceChange}
            activeFilterCount={activeFilterCount}
            onClear={handleClear}
            onClose={() => setIsFiltersOpen(false)}
            onToggle={() => setIsFiltersOpen(currentValue => !currentValue)}
        />
    );
    const sortDropdown = (
        <ProductListSortDropdown
            ref={sortRef}
            open={isSortDropdownOpen}
            active={isSortActive}
            sortBy={sortBy}
            sortOptions={sortOptions}
            sortLabels={siteContent.catalog.sortLabels}
            sortAriaPrefix={siteContent.catalog.sortAriaPrefix}
            onToggle={toggleSortDropdown}
            onSelect={handleSortSelect}
        />
    );

    return (
        <div className={rootClassName}>
            {toolbarClassName && (
                <div className={PRODUCT_LIST_CLASS_NAMES.mainPageToolbarSticky}>
                    <div className={PRODUCT_LIST_CLASS_NAMES.mainPageToolbarOuter}>
                        <PageHeader className={PRODUCT_LIST_CLASS_NAMES.mainPageHeader} isProductList>
                            {shouldShowToolbarTitleGroup && (
                                <div className={PRODUCT_LIST_CLASS_NAMES.mainPageToolbarTitleGroup}>
                                    {toolbarTitle && <HeaderBrandLink label={toolbarTitle} />}
                                </div>
                            )}

                            <div className={searchWrapperClassName}>
                                <SearchComponent
                                    value={query}
                                    onChange={setQuery}
                                    placeholder={searchPlaceholder ?? siteContent.catalog.searchPlaceholder}
                                />
                            </div>

                            <div className={PRODUCT_LIST_CLASS_NAMES.mainPageActions}>
                                {showCreateProductButton && (
                                    <>
                                        <AdminSettingsButton />
                                        <div className={productCreatorWrapperClassName}>
                                            <ProductCreator
                                                categoryOptions={availableCategories}
                                                onProductCreated={refreshProducts}
                                                pricingConfig={pricingConfig}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </PageHeader>
                    </div>

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
                cartPricingProducts={items}
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
