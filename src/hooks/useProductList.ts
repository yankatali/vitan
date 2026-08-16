"use client";

import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {PRODUCT_REFRESH_DELAYS_MS} from "@/constants/productList";
import {DEFAULT_PRODUCT_SORT} from "@/constants/products";
import {DEFAULT_PRODUCT_CATEGORY_OPTIONS} from "@/constants/productCategories";
import {fetchProductList} from "@/lib/productListApi";
import {useSiteContent} from "@/app/components/SiteContentProvider/SiteContentProvider";
import {getProductCategories} from "@/lib/productCategories";
import type {CatalogSortOption} from "@/types/catalog";
import type {ItemConfig} from "@/types/item";
import type {LoadProductsParams, UseProductListParams} from "@/types/productList";

export const useProductList = ({
    initialProducts,
    defaultSort = DEFAULT_PRODUCT_SORT,
    categories = [],
}: UseProductListParams) => {
    const [query, setQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<CatalogSortOption>(defaultSort);
    const [items, setItems] = useState<ItemConfig[]>(initialProducts.items);
    const [hasMore, setHasMore] = useState(initialProducts.hasMore);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const skipInitialFetch = useRef(true);
    const gridRef = useRef<HTMLDivElement | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const refreshTimeoutsRef = useRef<number[]>([]);
    const copy = useSiteContent().productList;

    const availableCategories = useMemo(() => {
        return getProductCategories(
            [...initialProducts.items, ...items],
            [...DEFAULT_PRODUCT_CATEGORY_OPTIONS, ...categories],
        );
    }, [categories, initialProducts.items, items]);

    const loadProducts = useCallback(async ({
        nextSkip,
        append,
        signal,
    }: LoadProductsParams) => {
        if (append) {
            setIsLoadingMore(true);
        } else {
            setIsLoading(true);
        }
        setError(null);

        try {
            const data = await fetchProductList({
                query,
                categories: selectedCategories,
                sortBy,
                skip: nextSkip,
                signal,
            }, copy);

            if (append) {
                setItems(currentItems => [...currentItems, ...data.items]);
            } else {
                setItems(data.items);
            }
            setHasMore(data.hasMore);
        } catch (requestError) {
            if (requestError instanceof DOMException && requestError.name === "AbortError") {
                return;
            }

            if (requestError instanceof Error) {
                setError(requestError.message);
            } else {
                setError(copy.loadError);
            }
        } finally {
            if (append) {
                setIsLoadingMore(false);
            } else {
                setIsLoading(false);
            }
        }
    }, [copy, query, selectedCategories, sortBy]);

    useEffect(() => {
        if (skipInitialFetch.current) {
            skipInitialFetch.current = false;
            if (initialProducts.items.length) return;
        }

        const abortController = new AbortController();
        const timeout = window.setTimeout(() => {
            void loadProducts({
                nextSkip: 0,
                append: false,
                signal: abortController.signal,
            });
        }, 300);

        return () => {
            window.clearTimeout(timeout);
            abortController.abort();
        };
    }, [initialProducts.items.length, loadProducts]);

    useEffect(() => {
        if (!initialProducts.items.length) return;

        setItems(initialProducts.items);
        setHasMore(initialProducts.hasMore);
    }, [initialProducts.hasMore, initialProducts.items]);

    useEffect(() => {
        const handlePageShow = (event: PageTransitionEvent) => {
            if (!event.persisted) return;

            void loadProducts({
                nextSkip: 0,
                append: false,
            });
        };

        window.addEventListener("pageshow", handlePageShow);

        return () => window.removeEventListener("pageshow", handlePageShow);
    }, [loadProducts]);

    const loadMore = useCallback(() => {
        if (!hasMore || isLoading || isLoadingMore) return;

        void loadProducts({
            nextSkip: items.length,
            append: true,
        });
    }, [hasMore, isLoading, isLoadingMore, items.length, loadProducts]);

    const clearRefreshTimeouts = useCallback(() => {
        refreshTimeoutsRef.current.forEach(timeout => window.clearTimeout(timeout));
        refreshTimeoutsRef.current = [];
    }, []);

    const refreshProducts = useCallback(() => {
        clearRefreshTimeouts();

        refreshTimeoutsRef.current = PRODUCT_REFRESH_DELAYS_MS.map(delay => window.setTimeout(() => {
            void loadProducts({
                nextSkip: 0,
                append: false,
            });
        }, delay));
    }, [clearRefreshTimeouts, loadProducts]);

    useEffect(() => {
        return () => clearRefreshTimeouts();
    }, [clearRefreshTimeouts]);

    useEffect(() => {
        clearRefreshTimeouts();
    }, [clearRefreshTimeouts, loadProducts]);

    useEffect(() => {
        const node = loadMoreRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                loadMore();
            }
        }, {
            rootMargin: "400px",
        });

        observer.observe(node);

        return () => observer.disconnect();
    }, [loadMore]);

    return {
        availableCategories,
        error,
        hasMore,
        gridRef,
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
    };
};
