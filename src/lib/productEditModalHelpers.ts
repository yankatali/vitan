import type {SiteContent} from "@/constants/siteContent";

export const getUpdateProductSubmitButtonLabel = (
    isSubmitting: boolean,
    copy: SiteContent["updateProduct"]["buttons"],
) => {
    if (isSubmitting) return copy.submitting;

    return copy.idle;
};
