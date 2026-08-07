import {NextRequest, NextResponse} from "next/server";
import {
    ADMIN_COOKIE_NAME,
    ADMIN_LOGIN_CONFIG_ERROR_MESSAGE,
    ADMIN_LOGIN_ERROR_MESSAGE,
} from "@/constants/admin";
import {adminCookieOptions, createAdminSessionToken, verifyAdminPassword} from "@/lib/adminAuth";

export const runtime = "nodejs";

const getPassword = async (request: NextRequest) => {
    try {
        const payload = await request.json() as {password?: unknown};

        return typeof payload.password === "string" ? payload.password : "";
    } catch {
        return "";
    }
};

export async function POST(request: NextRequest) {
    const password = await getPassword(request);
    const isPasswordValid = await verifyAdminPassword(password);

    if (isPasswordValid === null) {
        return NextResponse.json({message: ADMIN_LOGIN_CONFIG_ERROR_MESSAGE}, {status: 500});
    }

    if (!isPasswordValid) {
        return NextResponse.json({message: ADMIN_LOGIN_ERROR_MESSAGE}, {status: 401});
    }

    const sessionToken = await createAdminSessionToken();

    if (!sessionToken) {
        return NextResponse.json({message: ADMIN_LOGIN_CONFIG_ERROR_MESSAGE}, {status: 500});
    }

    const response = NextResponse.json({isAdmin: true});

    response.cookies.set(ADMIN_COOKIE_NAME, sessionToken, adminCookieOptions);

    return response;
}
