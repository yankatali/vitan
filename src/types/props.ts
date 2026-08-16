import type {ReactNode, RefObject} from "react";
import type {CatalogConfig, CatalogSortOption} from "@/types/catalog";
import type {CartProductItem} from "@/types/cart";
import type {HeaderButton, HeaderConfig, IconName} from "@/types/header";
import type {ItemConfig} from "@/types/item";
import type {MainPageConfig} from "@/types/main";
import type {PricingConfig} from "@/types/pricingConfig";
import type {ProductsResult} from "@/types/product";
import type {ProductImagePreview} from "@/types/productImagePreview";
import type {
    RelatedProductActionButtonVariant,
    RelatedProductPrices,
    RelatedProductsScrollDirection,
} from "@/types/relatedProducts";
import type {SiteContent} from "@/types/siteContent";

export interface AdminAccessProps {
    initialIsAdmin: boolean;
}

export interface AdminSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface CartBottomCtaProps {
    bottom: number;
    totalQuantity: number;
    totalPrice: number;
    copy: SiteContent["cart"];
}

export interface CartClientProps {
    products: ItemConfig[];
    pricingConfig?: PricingConfig | null;
}

export interface CartProductImageProps {
    product: ItemConfig;
}

export interface CartProductPriceProps {
    product: ItemConfig;
    pricingConfig?: PricingConfig | null;
    isWholesaleActive: boolean;
    wholesaleTooltipText: string;
    copy: SiteContent["cart"];
}

export interface CartProductRowProps {
    product: ItemConfig;
    quantity: number;
    pricingConfig?: PricingConfig | null;
    isWholesaleActive: boolean;
    wholesaleTooltipText: string;
    onQuantityChange: (productId: string, quantity: number) => void;
    onRequestRemove: (productId: string) => void;
}

export interface CartQuantityControlsProps {
    product: ItemConfig;
    quantity: number;
    copy: SiteContent["cart"];
    onQuantityChange: (productId: string, quantity: number) => void;
    onRequestRemove: (productId: string) => void;
}

export interface CatalogProps {
    config: CatalogConfig;
    initialProducts: ProductsResult;
    usdToUahRate: number | null;
}

export interface CategoryMultiSelectProps {
    options: string[];
    selectedCategories: string[];
    onToggle: (category: string) => void;
}

export interface CheckoutClientProps {
    products: ItemConfig[];
    pricingConfig?: PricingConfig | null;
}

export interface CheckoutItemThumbnailProps {
    product: ItemConfig;
}

export interface CheckoutOrderItemProps {
    product: ItemConfig;
    quantity: number;
    price: number | null;
    copy: SiteContent["checkout"];
}

export interface CheckoutOrderSummaryProps {
    cartProducts: CartProductItem[];
    isWholesaleActive: boolean;
    pricingConfig?: PricingConfig | null;
    totalQuantity: number;
    totalPrice: number;
    copy: SiteContent["checkout"];
}

export interface CheckoutQuantityControlsProps {
    productId: string;
    quantity: number;
    copy: SiteContent["checkout"];
}

export interface CheckoutSuccessViewProps {
    copy: SiteContent["checkout"];
}

export interface ConfirmModalProps {
    isOpen: boolean;
    text: string;
    onCancel: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export interface ExistingProductImageItemProps {
    imageUrl: string;
    index: number;
    isSubmitting: boolean;
    onRemove: (imageUrl: string) => void;
}

export interface FavoriteButtonProps {
    isFavorite: boolean;
    onToggle: () => void;
    variant: "overlay" | "detail";
    className?: string;
}

export interface FilterChipProps {
    selected: boolean;
    onClick: () => void;
    children: ReactNode;
}

export interface FiltersSheetProps {
    open: boolean;
    categories: string[];
    selectedCategories: string[];
    onCategoriesChange: (cats: string[]) => void;
    priceMin: number;
    priceMax: number;
    absoluteMin: number;
    absoluteMax: number;
    onPriceChange: (min: number, max: number) => void;
    activeFilterCount: number;
    onClear: () => void;
    onClose: () => void;
}

export interface FooterProps {
    isAdmin?: boolean;
}

export interface HeaderBrandLinkProps {
    label?: string;
    className?: string;
}

export interface HeaderNavItemProps {
    url: string;
    label: string;
    iconName: IconName;
    iconSize: number;
    count: number;
    isActive: boolean;
    onClick: () => void;
}

export interface HeaderProps {
    config: HeaderConfig;
}

export interface ImagePlaceholderProps {
    className?: string;
    iconSize?: number;
}

export interface ItemCategoryPillsProps {
    category?: string;
}

export interface ItemComponentProps {
    categoryOptions?: string[];
    image: string;
    images?: string[];
    item?: ItemConfig;
    title: string;
    description?: string;
    purchasePriceUah?: number;
    priceUsd?: number;
    priceUah?: number | null;
    priceUahWholesale?: number | null;
    wholesaleDescription?: string;
    wholesaleActiveDescription?: string;
    wholesaleAsPrimary?: boolean;
    category?: string;
    showProductActions?: boolean;
    showAdminActions?: boolean;
    pricingConfig?: PricingConfig | null;
    onProductDeleted?: () => void;
}

export interface ItemDetailImageDotProps {
    active: boolean;
}

export interface ItemDetailImagesProps {
    productImages: string[];
    title: string;
    showFavorite: boolean;
    isFavorite: boolean;
    onFavoriteToggle: () => void;
}

export interface ItemDetailImageSlideProps {
    imageUrl: string;
    index: number;
    title: string;
}

export interface ItemImageCarouselProps {
    productImages: string[];
    alt: string;
    activeImageIndex: number;
    imageScrollerRef: RefObject<HTMLDivElement | null>;
    onImageScroll: () => void;
    onDotClick: (index: number) => void;
    commonCopy: SiteContent["common"];
}

export interface ItemImageDotsProps {
    productImages: string[];
    activeImageIndex: number;
    onDotClick: (index: number) => void;
    commonCopy: SiteContent["common"];
}

export interface ItemImageSlideProps {
    imageUrl: string;
    alt: string;
}

export interface MainPageProps {
    config: MainPageConfig;
    headerConfig?: HeaderConfig;
    initialProducts: ProductsResult;
    isAdmin?: boolean;
    pricingConfig?: PricingConfig | null;
}

export interface OrderClientProps {
    products: ItemConfig[];
}

export interface OrderProductRowProps {
    product: ItemConfig;
    quantity: number;
}

export interface OrderProductThumbnailProps {
    product: ItemConfig;
}

export interface OriginalProductPriceFieldProps {
    priceUah?: number;
    pricingConfig?: PricingConfig | null;
}

export interface PageHeaderProps {
    children: ReactNode;
    className?: string;
    isProductList?: boolean;
}

export interface PriceRangeSliderProps {
    min: number;
    max: number;
    absoluteMin: number;
    absoluteMax: number;
    onChange: (min: number, max: number) => void;
}

export interface PriceTooltipProps {
    text?: string;
}

export interface ProductPriceBlockProps {
    priceUah?: number | null;
    priceUahWholesale?: number | null;
    priceUsd?: number;
    wholesaleActiveDescription?: string;
    wholesaleAsPrimary?: boolean;
    wholesaleDescription?: string;
}

export interface ProductCardActionsProps {
    categoryOptions: string[];
    pricingConfig?: PricingConfig | null;
    showAdminActions?: boolean;
    showCartButton?: boolean;
    product: ItemConfig;
    onProductChanged: () => void;
}

export interface ProductCardSimpleProps {
    item: ItemConfig;
    priceUah: number | null;
    priceUahWholesale: number | null;
    wholesaleDescription?: string;
    wholesaleActiveDescription?: string;
    wholesaleAsPrimary?: boolean;
    overlayButton?: ReactNode;
    cartAction?: ReactNode;
    bottomActions?: ReactNode;
    modalAction?: ReactNode;
    className?: string;
}

export interface ProductCategoryPillsProps {
    categories: string[];
}

export interface ProductCreatorProps {
    categoryOptions: string[];
    onProductCreated: () => void;
    pricingConfig?: PricingConfig | null;
}

export interface ProductCreateModalProps extends ProductCreatorProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface ProductDetailImageDotProps {
    active: boolean;
}

export interface ProductDetailImagesProps {
    productImages: string[];
    title: string;
}

export interface ProductDetailImageSlideProps {
    imageUrl: string;
    index: number;
    title: string;
}

export interface ProductEditModalProps {
    categoryOptions: string[];
    isOpen: boolean;
    onClose: () => void;
    onProductUpdated: () => void;
    pricingConfig?: PricingConfig | null;
    product: ItemConfig;
}

export interface ProductImageCarouselProps {
    productImages: string[];
    alt: string;
    activeImageIndex: number;
    imageScrollerRef: RefObject<HTMLDivElement | null>;
    onImageScroll: () => void;
    onDotClick: (index: number) => void;
    commonCopy: SiteContent["common"];
}

export interface ProductImageDotsProps {
    count: number;
    activeImageIndex: number;
    onDotClick: (index: number) => void;
    commonCopy: SiteContent["common"];
}

export interface ProductImagePreviewItemProps {
    preview: ProductImagePreview;
    isDisabled: boolean;
    onRemove: (image: File) => void;
    copy: SiteContent["productForm"];
}

export interface ProductImagePreviewsProps {
    images: File[];
    isDisabled?: boolean;
    onRemove: (image: File) => void;
}

export interface ProductImageSlideProps {
    imageUrl: string;
    alt: string;
}

export interface ProductImageUploadProgressProps {
    progress: number;
}

export interface ProductListFilterDropdownProps {
    open: boolean;
    categories: string[];
    selectedCategories: string[];
    priceMin: number;
    priceMax: number;
    absoluteMin: number;
    absoluteMax: number;
    activeFilterCount: number;
    onToggle: () => void;
    onCategoriesChange: (categories: string[]) => void;
    onPriceChange: (min: number, max: number) => void;
    onClear: () => void;
    onClose: () => void;
}

export interface ProductListProps {
    initialProducts: ProductsResult;
    defaultSort?: CatalogSortOption;
    searchPlaceholder?: string;
    categories?: string[];
    sortOptions?: CatalogSortOption[];
    showCategories?: boolean;
    showSort?: boolean;
    showCategoryOnCard?: boolean;
    showCreateProductButton?: boolean;
    showDeleteProductButton?: boolean;
    usdToUahRate?: number | null;
    pricingConfig?: PricingConfig | null;
    rootClassName?: string;
    productCreatorWrapperClassName?: string;
    toolbarButtons?: HeaderButton[];
    toolbarClassName?: string;
    toolbarTitle?: string;
    searchWrapperClassName?: string;
    filterWrapperClassName?: string;
    sortWrapperClassName?: string;
    gridClassName: string;
    messageClassName: string;
}

export interface ProductListResultsProps {
    categoryOptions: string[];
    error: string | null;
    gridRef: RefObject<HTMLDivElement | null>;
    gridClassName: string;
    hasMore: boolean;
    isLoading: boolean;
    items: ItemConfig[];
    cartPricingProducts: ItemConfig[];
    loadMoreRef: RefObject<HTMLDivElement | null>;
    messageClassName: string;
    onProductDeleted: () => void;
    showCategoryOnCard: boolean;
    showAdminActions: boolean;
    usdToUahRate: number | null;
    pricingConfig?: PricingConfig | null;
}

export interface ProductListSortDropdownProps {
    open: boolean;
    active: boolean;
    sortBy: CatalogSortOption;
    sortOptions: CatalogSortOption[];
    sortLabels: Record<CatalogSortOption, string>;
    sortAriaPrefix: string;
    onToggle: () => void;
    onSelect: (sortOption: CatalogSortOption) => void;
}

export interface ProductListSortOptionButtonProps {
    option: CatalogSortOption;
    label: string;
    active: boolean;
    onSelect: (sortOption: CatalogSortOption) => void;
}

export interface ProductPricingPreviewProps {
    priceUah: string;
    pricingConfig?: PricingConfig | null;
}

export interface RelatedProductActionButtonProps {
    active: boolean;
    activeIcon: ReactNode;
    icon: ReactNode;
    onAction: () => void;
    variant: RelatedProductActionButtonVariant;
    copy: SiteContent["relatedProducts"];
}

export interface RelatedProductCardProps {
    product: ItemConfig;
    prices?: RelatedProductPrices;
    active: boolean;
    actionIcon: ReactNode;
    activeActionIcon: ReactNode;
    onAction: (productId: string) => void;
    copy: SiteContent["relatedProducts"];
}

export interface RelatedProductsRowProps {
    title?: string;
    products: ItemConfig[];
    onAction: (productId: string) => void;
    isActive: (productId: string) => boolean;
    actionIcon: ReactNode;
    activeActionIcon: ReactNode;
}

export interface RelatedProductsScrollButtonProps {
    direction: RelatedProductsScrollDirection;
    onClick: () => void;
    copy: SiteContent["relatedProducts"];
}

export interface SearchComponentProps {
    id?: string;
    name?: string;
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
}

export interface SettingsIconProps {
    size?: number;
}

export interface SiteContentProviderProps {
    children: ReactNode;
    content: SiteContent;
}

export interface SlugPageProps {
    params: Promise<{ slug: string }>;
}

export interface WishlistBottomCtaProps {
    bottom: number;
    productCount: number;
    totalPrice: number;
    buttonText: string;
}

export interface WishlistCartActionButtonProps {
    productId: string;
    isInCart: boolean;
    onAddToCart: (productId: string) => void;
    onRequestCartRemove: (productId: string) => void;
}

export interface WishlistClientProps {
    products: ItemConfig[];
    pricingConfig?: PricingConfig | null;
}

export interface WishlistProductCardProps {
    item: ItemConfig;
    isInCart: boolean;
    isWholesaleActive: boolean;
    wholesaleTooltipText: string;
    onAddToCart: (productId: string) => void;
    onRequestCartRemove: (productId: string) => void;
}
