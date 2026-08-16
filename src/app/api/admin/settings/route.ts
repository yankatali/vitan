import {NextRequest, NextResponse} from "next/server";
import {revalidatePath} from "next/cache";
import {getApiErrorMessage} from "@/lib/apiErrorMessage";
import {isAdminSession} from "@/lib/adminAuth";
import {isAdminRequestSecurityValid} from "@/lib/adminRequestSecurity";
import {getSettingsInput} from "@/lib/adminSettingsRequest";
import {updateContentfulPricingConfig} from "@/lib/contentfulManagement";
import {getPricingConfig} from "@/lib/pricingConfig";
import {getSiteContent} from "@/lib/siteContent";

export const runtime = "nodejs";

export async function GET() {
    const copy = (await getSiteContent()).admin;

    if (!await isAdminSession()) {
        return NextResponse.json({message: copy.unauthorized}, {status: 401});
    }

    const settings = await getPricingConfig(0);
    if (!settings) {
        return NextResponse.json({message: copy.settingsNotFound}, {status: 404});
    }

    return NextResponse.json({settings});
}

export async function PUT(request: NextRequest) {
    const siteContent = await getSiteContent();
    const copy = siteContent.admin;

    if (!isAdminRequestSecurityValid(request)) {
        return NextResponse.json({message: copy.unauthorized}, {status: 403});
    }

    if (!await isAdminSession()) {
        return NextResponse.json({message: copy.unauthorized}, {status: 401});
    }

    try {
        const settings = await updateContentfulPricingConfig(await getSettingsInput(request, copy));

        revalidatePath("/", "layout");

        return NextResponse.json({settings});
    } catch (error) {
        const message = getApiErrorMessage(error, copy.settingsUpdateError, siteContent.contentful);

        return NextResponse.json({message}, {status: 400});
    }
}
