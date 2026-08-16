export const getCardCategory = (showCategoryOnCard: boolean, category: string) => {
    if (showCategoryOnCard) return category;

    return undefined;
};
