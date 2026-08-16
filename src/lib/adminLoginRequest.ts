import {NextRequest} from "next/server";
import {ADMIN_LOGIN_MAX_PASSWORD_LENGTH} from "@/constants/admin";

export const getAdminLoginPassword = async (request: NextRequest) => {
    try {
        const payload = await request.json() as {password?: unknown};
        const password = typeof payload.password === "string" ? payload.password : "";

        return password.slice(0, ADMIN_LOGIN_MAX_PASSWORD_LENGTH);
    } catch {
        return "";
    }
};
