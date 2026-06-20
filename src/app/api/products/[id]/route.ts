import {NextResponse} from "next/server";
import {revalidatePath, revalidateTag} from "next/cache";
import {CONTENTFUL_PRODUCTS_CACHE_TAG} from "@/constants/cache";
import {
    CREATE_PRODUCT_ALLOWED_IMAGE_TYPES,
    CREATE_PRODUCT_FIELD_NAMES,
    CREATE_PRODUCT_MAX_IMAGE_SIZE,
} from "@/constants/createProduct";
import {DELETE_PRODUCT_ERROR_MESSAGES} from "@/constants/deleteProduct";
import {UPDATE_PRODUCT_ERROR_MESSAGES} from "@/constants/updateProduct";
import {deleteContentfulProduct, updateContentfulProduct} from "@/lib/contentfulManagement";
import type {UpdateProductInput} from "@/types/updateProduct";

export const runtime = "nodejs";

interface DeleteProductRouteContext {
    params: Promise<{id: string}>;
}

const getStringFormValue = (formData: FormData, name: string) => {
    const value = formData.get(name);

    if (typeof value !== "string") return "";

    return value.trim();
};

const getCategories = (formData: FormData) => {
    return formData
        .getAll(CREATE_PRODUCT_FIELD_NAMES.categories)
        .filter(value => typeof value === "string")
        .map(category => category.trim())
        .filter(Boolean);
};

const getImages = (formData: FormData) => {
    return formData
        .getAll(CREATE_PRODUCT_FIELD_NAMES.image)
        .filter((value): value is File => value instanceof File && value.size > 0);
};

const getKeptImageUrls = (formData: FormData) => {
    return formData
        .getAll("keptImageUrls")
        .filter((value): value is string => typeof value === "string")
        .map(value => value.trim())
        .filter(Boolean);
};

const getUpdateProductInput = (formData: FormData, id: string): UpdateProductInput => {
    const name = getStringFormValue(formData, CREATE_PRODUCT_FIELD_NAMES.name);
    const description = getStringFormValue(formData, CREATE_PRODUCT_FIELD_NAMES.description);
    const priceValue = getStringFormValue(formData, CREATE_PRODUCT_FIELD_NAMES.price);
    const price = Number(priceValue);
    const images = getImages(formData);

    if (!id) {
        throw new Error(UPDATE_PRODUCT_ERROR_MESSAGES.missingId);
    }

    if (!name) {
        throw new Error(UPDATE_PRODUCT_ERROR_MESSAGES.missingName);
    }

    if (!Number.isFinite(price) || price < 0) {
        throw new Error(UPDATE_PRODUCT_ERROR_MESSAGES.invalidPrice);
    }

    if (images.some(image => !CREATE_PRODUCT_ALLOWED_IMAGE_TYPES.includes(image.type))) {
        throw new Error(UPDATE_PRODUCT_ERROR_MESSAGES.invalidImageType);
    }

    if (images.some(image => image.size > CREATE_PRODUCT_MAX_IMAGE_SIZE)) {
        throw new Error(UPDATE_PRODUCT_ERROR_MESSAGES.oversizedImage);
    }

    return {
        id,
        name,
        description,
        price,
        categories: getCategories(formData),
        images,
        keptImageUrls: getKeptImageUrls(formData),
    };
};

const revalidateProducts = () => {
    revalidatePath("/", "layout");
    revalidateTag(CONTENTFUL_PRODUCTS_CACHE_TAG);
};

export async function DELETE(_request: Request, context: DeleteProductRouteContext) {
    try {
        const {id} = await context.params;

        if (!id) {
            throw new Error(DELETE_PRODUCT_ERROR_MESSAGES.missingId);
        }

        const product = await deleteContentfulProduct(id);

        revalidateProducts();

        return NextResponse.json({product});
    } catch (error) {
        let message = DELETE_PRODUCT_ERROR_MESSAGES.unableToDelete;

        if (error instanceof Error) {
            message = error.message;
        }

        return NextResponse.json({message}, {status: 400});
    }
}

export async function PUT(request: Request, context: DeleteProductRouteContext) {
    try {
        const {id} = await context.params;
        const formData = await request.formData();
        const product = await updateContentfulProduct(getUpdateProductInput(formData, id));

        revalidateProducts();

        return NextResponse.json({product});
    } catch (error) {
        let message = UPDATE_PRODUCT_ERROR_MESSAGES.unableToUpdate;

        if (error instanceof Error) {
            message = error.message;
        }

        return NextResponse.json({message}, {status: 400});
    }
}
