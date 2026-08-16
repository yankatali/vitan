import {NextRequest, NextResponse} from "next/server";
import {revalidatePath, revalidateTag} from "next/cache";
import {CONTENTFUL_PRODUCTS_CACHE_TAG} from "@/constants/cache";
import {getApiErrorMessage} from "@/lib/apiErrorMessage";
import {isAdminSession} from "@/lib/adminAuth";
import {isAdminRequestSecurityValid} from "@/lib/adminRequestSecurity";
import {createContentfulProduct} from "@/lib/contentfulManagement";
import {getCreateProductInput} from "@/lib/productMutationRequest";
import {getSiteContent} from "@/lib/siteContent";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    const siteContent = await getSiteContent();
    const copy = siteContent.createProduct.errors;

    try {
        if (!isAdminRequestSecurityValid(request)) {
            return NextResponse.json({message: siteContent.admin.unauthorized}, {status: 403});
        }

        if (!await isAdminSession()) {
            return NextResponse.json({message: siteContent.admin.unauthorized}, {status: 401});
        }

        const formData = await request.formData();
        const product = await createContentfulProduct(getCreateProductInput(formData, copy));

        revalidatePath("/", "layout");
        revalidateTag(CONTENTFUL_PRODUCTS_CACHE_TAG);

        return NextResponse.json({product}, {status: 201});
    } catch (error) {
        const message = getApiErrorMessage(error, copy.unableToCreate, siteContent.contentful);
        return NextResponse.json({message}, {status: 400});
    }
}
