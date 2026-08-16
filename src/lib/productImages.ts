export const getProductImageUrls = (imageUrl?: string, imageUrls?: string[]) => {
    if (imageUrls?.length) return imageUrls;
    if (imageUrl) return [imageUrl];

    return [];
};
