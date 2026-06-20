export interface CreateProductFormValues {
    name: string;
    description: string;
    price: string;
    categories: string[];
    image: File[];
}

export interface CreateProductInput {
    name: string;
    description: string;
    price: number;
    categories: string[];
    images?: File[];
}

export interface CreateProductResult {
    id: string;
    assetIds?: string[];
}

export interface CreateProductApiResponse {
    product: CreateProductResult;
}

export interface ProductCreatorProps {
    categoryOptions: string[];
    onProductCreated: () => void;
}

export interface ProductCreateModalProps extends ProductCreatorProps {
    isOpen: boolean;
    onClose: () => void;
}

export type CreateProductTextField = Exclude<keyof CreateProductFormValues, "categories" | "image">;
