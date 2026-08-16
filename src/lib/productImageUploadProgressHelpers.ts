import type {SiteContent} from "@/constants/siteContent";

export const getUploadProgressLabel = (progress: number, copy: SiteContent["productForm"]) => {
    if (progress >= 100) return copy.uploadComplete;

    return `${copy.uploadProgressPrefix} ${progress}%`;
};
