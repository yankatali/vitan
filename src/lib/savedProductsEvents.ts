export const SAVED_PRODUCTS_CHANGE_EVENT = "vitan-saved-products-change";

export const notifySavedProductsChanged = () => {
    window.dispatchEvent(new Event(SAVED_PRODUCTS_CHANGE_EVENT));
};
