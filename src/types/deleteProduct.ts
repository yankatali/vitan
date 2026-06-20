export interface DeleteProductResult {
    id: string;
}

export interface DeleteProductApiResponse {
    product: DeleteProductResult;
}

export interface DeleteProductButtonProps {
    productId: string;
    onDeleted: () => void;
}

export type UseDeleteProductParams = DeleteProductButtonProps;
