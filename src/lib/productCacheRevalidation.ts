import {revalidatePath, revalidateTag} from "next/cache";
import {CONTENTFUL_PRODUCTS_CACHE_TAG} from "@/constants/cache";

export const revalidateProducts = () => {
    revalidatePath("/", "layout");
    revalidateTag(CONTENTFUL_PRODUCTS_CACHE_TAG);
};
