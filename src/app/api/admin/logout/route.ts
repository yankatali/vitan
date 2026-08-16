import {NextRequest, NextResponse} from "next/server";
import {ADMIN_COOKIE_NAME} from "@/constants/admin";
import {isAdminRequestSecurityValid} from "@/lib/adminRequestSecurity";
import {getSiteContent} from "@/lib/siteContent";

export async function POST(request: NextRequest) {
    if (!isAdminRequestSecurityValid(request)) {
        return NextResponse.json({message: (await getSiteContent()).admin.unauthorized}, {status: 403});
    }

    const response = NextResponse.json({isAdmin: false});

    response.cookies.delete(ADMIN_COOKIE_NAME);

    return response;
}
