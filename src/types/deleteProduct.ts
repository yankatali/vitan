export interface DeleteProductResult {
    id: string;
}

export interface DeleteProductApiResponse {
    product: DeleteProductResult;
}

export interface UseDeleteProductParams {
    productId: string;
    onDeleted: () => void;
}
