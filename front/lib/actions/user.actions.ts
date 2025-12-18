"use server";

import { cookies } from "next/headers";
import { fetchWithErrorHandling } from "../utils";

export const register = async () => {
    const cookieStore = await cookies();
    if (cookieStore.get("accessToken")) {
        return {
            success: true,
            username: cookieStore.get("username")?.value,
        };
    }

    try {
        const response = await fetchWithErrorHandling("/auth/register", {
            method: "POST",
        });
        cookieStore.set("accessToken", response.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // 1 days
        });
        cookieStore.set("username", response.username, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // 1 days
        });

        return {
            success: true,
            username: response.username,
        };
    } catch (error: any) {
        cookieStore.set("accessToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return {
            success: false,
            error: {
                msg: error.message || error.msg,
            },
        };
    }
};

export const getUserData = async () => {
    const cookieStore = await cookies();
    return {
        username: cookieStore.get("username")?.value,
        accessToken: cookieStore.get("accessToken")?.value,
    };
};

export const createRoomAction = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    try {
        const res = await fetchWithErrorHandling(`/chat/room`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return res;
    } catch (error: any) {
        return { success: false, ...error };
    }
};
export const getRoomMessages = async (roomId: string) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    try {
        const res = await fetchWithErrorHandling(
            `/chat/room/${roomId}/messages`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return res;
    } catch (error: any) {
        return { success: false, ...error };
    }
};

export const destroyRoomAction = async (roomId: string) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    try {
        const res = await fetchWithErrorHandling(`/chat/room/${roomId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return res;
    } catch (error: any) {
        return { success: false, ...error };
    }
};
