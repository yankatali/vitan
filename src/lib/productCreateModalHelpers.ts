import type {SiteContent} from "@/constants/siteContent";

export const getCreateProductSubmitButtonLabel = (
    isSubmitting: boolean,
    copy: SiteContent["createProduct"]["buttons"],
) => {
    if (isSubmitting) return copy.submitting;

    return copy.idle;
};
