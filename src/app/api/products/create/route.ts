import {NextRequest, NextResponse} from "next/server";
import {revalidatePath, revalidateTag} from "next/cache";
import {
    CREATE_PRODUCT_ALLOWED_IMAGE_TYPES,
    CREATE_PRODUCT_ERROR_MESSAGES,
    CREATE_PRODUCT_FIELD_NAMES,
    CREATE_PRODUCT_MAX_IMAGE_SIZE,
} from "@/constants/createProduct";
import {CONTENTFUL_PRODUCTS_CACHE_TAG} from "@/constants/cache";
import {createContentfulProduct} from "@/lib/contentfulManagement";
import type {CreateProductInput} from "@/types/createProduct";

export const runtime = "nodejs";

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

const getPrice = (value: string) => {
    const price = Number(value);

    if (!Number.isFinite(price) || price < 0) return null;

    return price;
};

const getCreateProductInput = (formData: FormData): CreateProductInput => {
    const name = getStringFormValue(formData, CREATE_PRODUCT_FIELD_NAMES.name);
    const description = getStringFormValue(formData, CREATE_PRODUCT_FIELD_NAMES.description);
    const priceValue = getStringFormValue(formData, CREATE_PRODUCT_FIELD_NAMES.price);
    const price = getPrice(priceValue);
    const images = getImages(formData);

    if (!name) {
        throw new Error(CREATE_PRODUCT_ERROR_MESSAGES.missingName);
    }

    if (price === null) {
        throw new Error(CREATE_PRODUCT_ERROR_MESSAGES.invalidPrice);
    }

    if (images.some(image => !CREATE_PRODUCT_ALLOWED_IMAGE_TYPES.includes(image.type))) {
        throw new Error(CREATE_PRODUCT_ERROR_MESSAGES.invalidImageType);
    }

    if (images.some(image => image.size > CREATE_PRODUCT_MAX_IMAGE_SIZE)) {
        throw new Error(CREATE_PRODUCT_ERROR_MESSAGES.oversizedImage);
    }

    return {
        name,
        description,
        price,
        categories: getCategories(formData),
        images,
    };
};

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const product = await createContentfulProduct(getCreateProductInput(formData));

        revalidatePath("/", "layout");
        revalidateTag(CONTENTFUL_PRODUCTS_CACHE_TAG);

        return NextResponse.json({product}, {status: 201});
    } catch (error) {
        let message = CREATE_PRODUCT_ERROR_MESSAGES.unableToCreate;

        if (error instanceof Error) {
            message = error.message;
        }

        return NextResponse.json({message}, {status: 400});
    }
}
