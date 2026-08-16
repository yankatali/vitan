import type {CatalogSortOption} from "@/types/catalog";
import type {PricingConfig} from "@/types/pricingConfig";

export const SITE_CONTENT_ENTRY_NAME = "Site content";

export interface SiteContent {
    metadata: {
        title: string;
        description: string;
    };
    brand: {
        name: string;
        contentfulTitle: string;
        tagline: string;
        logo: {
            src: string;
            alt: string;
        };
    };
    navigation: {
        homeAriaLabel: string;
        backAriaLabel: string;
        headerButtons: {
            shop: string;
            wishlist: string;
            cart: string;
        };
    };
    footer: {
        locationTitle: string;
        contactsTitle: string;
        address: {
            label: string;
            mapUrl: string;
            ariaLabel: string;
        };
        phone: {
            label: string;
            normalized: string;
            ariaLabel: string;
        };
        telegram: {
            label: string;
            ariaLabel: string;
        };
        viber: {
            label: string;
            ariaLabel: string;
        };
    };
    catalog: {
        searchPlaceholder: string;
        sortLabels: Record<CatalogSortOption, string>;
        sortAriaPrefix: string;
        categoryLabels: {
            all: string;
            allOption: string;
            filters: string;
        };
        results: {
            loading: string;
            empty: string;
        };
        filtersSheet: {
            categoryTitle: string;
            priceTitle: string;
            resetButton: string;
            showResultsButton: string;
            rangeFrom: string;
            rangeTo: string;
            currency: string;
        };
    };
    currency: {
        uahSymbol: string;
        uahShort: string;
    };
    common: {
        homeButton: string;
        productCountSuffix: string;
        piecesShort: string;
        photoGalleryAriaLabel: string;
        showPhotoAriaPrefix: string;
        confirmCancelButton: string;
        confirmDeleteButton: string;
    };
    telegramOrder: {
        title: string;
        productsTitle: string;
        totalPrefix: string;
    };
    cart: {
        title: string;
        empty: string;
        checkoutButton: string;
        wholesaleBadge: string;
        totalSuffix: string;
        summarySuffix: string;
        quantityDecreaseAria: string;
        quantityIncreaseAria: string;
        removeAria: string;
        confirmRemove: string;
        wholesaleHint: {
            addMorePrefix: string;
            minimumPrefix: string;
            suffix: string;
        };
    };
    wishlist: {
        title: string;
        empty: string;
        goToCartButton: string;
    };
    checkout: {
        title: string;
        submitButton: string;
        submitError: string;
        successTitle: string;
        successDescription: string;
        orderSummaryTitle: string;
        itemTotalJoin: string;
        totalSuffix: string;
        customerDetailsTitle: string;
        fields: {
            fullName: string;
            phone: string;
            comment: string;
        };
        placeholders: {
            fullName: string;
            phone: string;
            comment: string;
        };
        controls: {
            decrease: string;
            increase: string;
            remove: string;
        };
    };
    order: {
        title: string;
        notFound: string;
        customerTitle: string;
        productsTitle: string;
        totalSuffix: string;
    };
    categoryMultiSelect: {
        label: string;
        placeholder: string;
        selectedCountPrefix: string;
        empty: string;
    };
    productForm: {
        createTitle: string;
        editTitle: string;
        fields: {
            name: string;
            purchasePriceUah: string;
            purchasePriceUsd: string;
            adminPurchasePriceUah: string;
            adminPurchasePriceUsd: string;
            originalPurchasePrice: string;
            description: string;
            photo: string;
        };
        unavailableUsdRatePlaceholder: string;
        addProductAriaLabel: string;
        addPhotoAriaLabel: string;
        closeAriaLabel: string;
        cancelButton: string;
        newImageBadge: string;
        selectedImagesPrefix: string;
        selectedNewImagesPrefix: string;
        newImagesHint: string;
        removeImageAriaLabel: string;
        removeExistingImageAriaLabel: string;
        existingProductImageAlt: string;
        uploadComplete: string;
        uploadProgressPrefix: string;
        pricingPreview: {
            title: string;
            retail: string;
            wholesale: string;
        };
    };
    adminAccess: {
        triggerAriaLabel: string;
        title: string;
        closeAriaLabel: string;
        activeMessage: string;
        passwordLabel: string;
        loginButton: string;
        logoutButton: string;
        loginRequestError: string;
        logoutRequestError: string;
    };
    adminSettings: {
        triggerAriaLabel: string;
        title: string;
        closeAriaLabel: string;
        submitButton: string;
        loadError: string;
        saveError: string;
        fields: Record<keyof PricingConfig, string>;
    };
    productActions: {
        addToCart: string;
        inCart: string;
        delete: string;
        favorite: string;
        favoriteActive: string;
        edit: string;
        deleting: string;
        confirmDelete: string;
        confirmDeleteFromCart: string;
    };
    productList: {
        loadError: string;
        invalidResponseError: string;
    };
    relatedProducts: {
        title: string;
        activeActionAriaLabel: string;
        actionAriaLabel: string;
        scrollLeftAriaLabel: string;
        scrollRightAriaLabel: string;
    };
    admin: {
        unauthorized: string;
        loginError: string;
        loginConfigError: string;
        settingsNotFound: string;
        settingsInvalid: string;
        settingsUpdateError: string;
    };
    createProduct: {
        errors: {
            missingName: string;
            invalidPrice: string;
            invalidImageType: string;
            oversizedImage: string;
            unableToCreate: string;
            unexpectedResponse: string;
        };
        buttons: {
            idle: string;
            submitting: string;
        };
    };
    updateProduct: {
        errors: {
            missingId: string;
            missingName: string;
            invalidPrice: string;
            invalidImageType: string;
            oversizedImage: string;
            unableToUpdate: string;
            unexpectedResponse: string;
        };
        buttons: {
            idle: string;
            submitting: string;
        };
    };
    deleteProduct: {
        errors: {
            missingId: string;
            unableToDelete: string;
            unexpectedResponse: string;
        };
    };
    contentful: {
        missingManagementToken: string;
        missingSpaceId: string;
        categoryUnavailableWithExpected: string;
        categoryUnavailable: string;
    };
    wholesale: {
        defaultDescription: string;
        oldUnitTokenRegex: string;
        oldUnitTokenPattern: string;
    };
    categories: {
        defaultOptions: string[];
    };
}
