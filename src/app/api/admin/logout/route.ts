import {NextResponse} from "next/server";
import {ADMIN_COOKIE_NAME} from "@/constants/admin";

export async function POST() {
    const response = NextResponse.json({isAdmin: false});

    response.cookies.delete(ADMIN_COOKIE_NAME);

    return response;
}
