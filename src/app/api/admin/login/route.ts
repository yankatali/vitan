import {NextRequest, NextResponse} from "next/server";
import {ADMIN_COOKIE_NAME} from "@/constants/admin";
import {adminCookieOptions, createAdminSessionToken, verifyAdminPassword} from "@/lib/adminAuth";
import {
    clearAdminLoginRateLimit,
    getAdminLoginRateLimitKey,
    isAdminLoginRateLimited,
    recordFailedAdminLogin,
} from "@/lib/adminLoginRateLimit";
import {getAdminLoginPassword} from "@/lib/adminLoginRequest";
import {isAdminRequestSecurityValid} from "@/lib/adminRequestSecurity";
import {getSiteContent} from "@/lib/siteContent";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    const copy = (await getSiteContent()).admin;
    const rateLimitKey = getAdminLoginRateLimitKey(request);

    if (!isAdminRequestSecurityValid(request)) {
        return NextResponse.json({message: copy.unauthorized}, {status: 403});
    }

    if (isAdminLoginRateLimited(rateLimitKey)) {
        return NextResponse.json({message: copy.loginError}, {status: 429});
    }

    const password = await getAdminLoginPassword(request);
    const isPasswordValid = await verifyAdminPassword(password);

    if (isPasswordValid === null) {
        return NextResponse.json({message: copy.loginConfigError}, {status: 500});
    }

    if (!isPasswordValid) {
        recordFailedAdminLogin(rateLimitKey);

        return NextResponse.json({message: copy.loginError}, {status: 401});
    }

    const sessionToken = await createAdminSessionToken();

    if (!sessionToken) {
        return NextResponse.json({message: copy.loginConfigError}, {status: 500});
    }

    const response = NextResponse.json({isAdmin: true});

    clearAdminLoginRateLimit(rateLimitKey);
    response.cookies.set(ADMIN_COOKIE_NAME, sessionToken, adminCookieOptions);

    return response;
}
