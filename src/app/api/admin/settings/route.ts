import {NextRequest, NextResponse} from "next/server";
import {revalidatePath} from "next/cache";
import {
    ADMIN_SETTINGS_INVALID_MESSAGE,
    ADMIN_SETTINGS_NOT_FOUND_MESSAGE,
    ADMIN_SETTINGS_UPDATE_ERROR_MESSAGE,
    ADMIN_UNAUTHORIZED_MESSAGE,
} from "@/constants/admin";
import {getApiErrorMessage} from "@/lib/apiErrorMessage";
import {isAdminSession} from "@/lib/adminAuth";
import {updateContentfulPricingConfig} from "@/lib/contentfulManagement";
import {getPricingConfig} from "@/lib/pricingConfig";
import type {UpdatePricingConfigInput} from "@/types/pricingConfig";

export const runtime = "nodejs";

const getNumberValue = (value: unknown) => {
    if (typeof value === "number") return value;
    if (typeof value === "string") return Number(value.replace(",", "."));

    return NaN;
};

const getSettingsInput = async (request: NextRequest): Promise<UpdatePricingConfigInput> => {
    const payload = await request.json() as Record<string, unknown>;
    const usdToUahRate = getNumberValue(payload.usdToUahRate);
    const retailMarkup = getNumberValue(payload.retailMarkup);
    const wholesaleMarkup = getNumberValue(payload.wholesaleMarkup);
    const optPrice = getNumberValue(payload.optPrice);
    const wholesaleDescription = typeof payload.wholesaleDescription === "string"
        ? payload.wholesaleDescription.trim()
        : "";
    const descriptionAfterOptValid = typeof payload.descriptionAfterOptValid === "string"
        ? payload.descriptionAfterOptValid.trim()
        : "";

    if (
        !Number.isFinite(usdToUahRate)
        || usdToUahRate <= 0
        || !Number.isFinite(retailMarkup)
        || retailMarkup < 0
        || !Number.isFinite(wholesaleMarkup)
        || wholesaleMarkup < 0
        || !Number.isFinite(optPrice)
        || optPrice < 0
        || wholesaleDescription.length > 256
        || descriptionAfterOptValid.length > 256
    ) {
        throw new Error(ADMIN_SETTINGS_INVALID_MESSAGE);
    }

    return {
        usdToUahRate,
        retailMarkup,
        wholesaleMarkup,
        wholesaleDescription,
        optPrice,
        descriptionAfterOptValid,
    };
};

export async function GET() {
    if (!await isAdminSession()) {
        return NextResponse.json({message: ADMIN_UNAUTHORIZED_MESSAGE}, {status: 401});
    }

    const settings = await getPricingConfig(0);
    if (!settings) {
        return NextResponse.json({message: ADMIN_SETTINGS_NOT_FOUND_MESSAGE}, {status: 404});
    }

    return NextResponse.json({settings});
}

export async function PUT(request: NextRequest) {
    if (!await isAdminSession()) {
        return NextResponse.json({message: ADMIN_UNAUTHORIZED_MESSAGE}, {status: 401});
    }

    try {
        const settings = await updateContentfulPricingConfig(await getSettingsInput(request));

        revalidatePath("/", "layout");

        return NextResponse.json({settings});
    } catch (error) {
        const message = getApiErrorMessage(error, ADMIN_SETTINGS_UPDATE_ERROR_MESSAGE);

        return NextResponse.json({message}, {status: 400});
    }
}
