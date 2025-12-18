export const roomTtl = 60 * 10;
export const convertErrors = (error: string) => {
    const errors = {
        "Network error or server is unreachable.": "NetworkError",
        "You are not authenticated": "NotAuth",
    };
    console.log(error, errors[error as keyof typeof errors]);
    return errors[error as keyof typeof errors] || "UnknownError";
};

export const fetchAbsolute = (url: string, init?: RequestInit) => {
    if (url.startsWith("/"))
        return fetch(process.env.NEXT_PUBLIC_BASE_URL + url, init);
    else return fetch(url, init);
};

export const fetchWithErrorHandling = async (
    url: string,
    init?: RequestInit
) => {
    try {
        const response = await fetchAbsolute(url, init);

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }
        return await response.json();
    } catch (error: any) {
        if (error.name === "TypeError") {
            error.msg = "Network error or server is unreachable.";
        } else {
            error.msg = error.msg;
        }
        throw error;
    }
};

export const getTTL = (createdAt: string) => {
    const now = new Date();
    const ttlMillis =
        new Date(createdAt).getTime() + roomTtl * 1000 - now.getTime();
    const ttlSeconds = Math.max(0, Math.floor(ttlMillis / 1000));
    return ttlSeconds;
};

export function formatTimeRemaining(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}
