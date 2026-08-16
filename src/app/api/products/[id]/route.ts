import {NextRequest, NextResponse} from "next/server";
import {getApiErrorMessage} from "@/lib/apiErrorMessage";
import {isAdminSession} from "@/lib/adminAuth";
import {isAdminRequestSecurityValid} from "@/lib/adminRequestSecurity";
import {deleteContentfulProduct, updateContentfulProduct} from "@/lib/contentfulManagement";
import {revalidateProducts} from "@/lib/productCacheRevalidation";
import {getUpdateProductInput} from "@/lib/productMutationRequest";
import {getSiteContent} from "@/lib/siteContent";
import type {ProductIdRouteContext} from "@/types/productRoute";

export const runtime = "nodejs";

export async function DELETE(request: NextRequest, context: ProductIdRouteContext) {
    const siteContent = await getSiteContent();
    const copy = siteContent.deleteProduct.errors;

    try {
        if (!isAdminRequestSecurityValid(request)) {
            return NextResponse.json({message: siteContent.admin.unauthorized}, {status: 403});
        }

        if (!await isAdminSession()) {
            return NextResponse.json({message: siteContent.admin.unauthorized}, {status: 401});
        }

        const {id} = await context.params;

        if (!id) {
            throw new Error(copy.missingId);
        }

        const product = await deleteContentfulProduct(id);

        revalidateProducts();

        return NextResponse.json({product});
    } catch (error) {
        const message = getApiErrorMessage(error, copy.unableToDelete, siteContent.contentful);
        return NextResponse.json({message}, {status: 400});
    }
}

export async function PUT(request: NextRequest, context: ProductIdRouteContext) {
    const siteContent = await getSiteContent();
    const copy = siteContent.updateProduct.errors;

    try {
        if (!isAdminRequestSecurityValid(request)) {
            return NextResponse.json({message: siteContent.admin.unauthorized}, {status: 403});
        }

        if (!await isAdminSession()) {
            return NextResponse.json({message: siteContent.admin.unauthorized}, {status: 401});
        }

        const {id} = await context.params;
        const formData = await request.formData();
        const product = await updateContentfulProduct(getUpdateProductInput(formData, id, copy));

        revalidateProducts();

        return NextResponse.json({product});
    } catch (error) {
        const message = getApiErrorMessage(error, copy.unableToUpdate, siteContent.contentful);
        return NextResponse.json({message}, {status: 400});
    }
}
