"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { createRoomAction, register } from "@/lib/actions/user.actions";
import { convertErrors } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Lobby({
    username: usernameProp,
}: {
    username?: string;
}) {
    const tErrors = useTranslations("Errors");
    const t = useTranslations("Lobby");
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(!!!usernameProp);
    const [username, setUsername] = useState(usernameProp);

    const searchParams = useSearchParams();
    const wasDestroyed = searchParams.get("destroyed") === "true";
    const error = searchParams.get("error");
    const redirect = searchParams.get("redirect");
    const { locales } = routing;
    const locale = useLocale();
    const LocalesElements = locales.map((l) => {
        return locale === l ? null : (
            <Link
                href="/"
                locale={l}
                key={l}
                className={`hover:underline cursor-pointer text-green-500`}
            >
                {t(`Lang.${l}`)}
            </Link>
        );
    });
    const createRoom = async () => {
        setIsCreating(true);
        try {
            const res = await createRoomAction();
            if (!res.success) {
                throw res.msg;
            }
            router.push(`/room/${res.room.id}`);
        } catch (error: any) {
            toast.error(tErrors(convertErrors(error)));
        }
        setIsCreating(false);
    };
    useEffect(() => {
        if (username) {
            if (redirect) {
                console.log(redirect);
                router.push(redirect);
            }
            return;
        }
        const createAccount = async () => {
            setIsCreating(true);
            try {
                const response: any = await register();
                if (!response.success) {
                    throw new Error(response.error.msg);
                }
                setUsername(response.username);
            } catch (error: any) {
                toast.error(tErrors(convertErrors(error)));
            }

            setIsCreating(false);
        };
        createAccount();
    }, [username, redirect, router, tErrors]);

    return (
        <>
            <div className="flex w-full justify-end text-xl">
                <div className="flex px-2 gap-2">{LocalesElements}</div>
            </div>
            <main className="flex min-h-screen flex-col items-center justify-center p-4">
                <div className="w-full max-w-md space-y-8 m-4">
                    {wasDestroyed && (
                        <div className="bg-red-950/50 border border-red-900 p-4 text-center">
                            <p className="text-red-500 text-sm font-bold">
                                {tErrors("RoomDestroyed.Title")}
                            </p>
                            <p className="text-zinc-500 text-xs mt-1">
                                {tErrors("RoomDestroyed.Desc")}
                            </p>
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-950/50 border border-red-900 p-4 text-center">
                            <p className="text-red-500 text-sm font-bold">
                                {tErrors(`${convertErrors(error)}.Title`)}
                            </p>
                            <p className="text-zinc-500 text-xs mt-1">
                                {tErrors(`${convertErrors(error)}.Desc`)}
                            </p>
                        </div>
                    )}

                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight text-green-500">
                            {">"}
                            {t("PrivateChat")}
                        </h1>
                        <p className="text-zinc-500 text-sm">
                            {t("PrivateChatDesc")}
                        </p>
                    </div>

                    <div className="border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="flex items-center text-zinc-500">
                                    {t("YourIdentity")}
                                </label>

                                <div className="flex items-center gap-3">
                                    <div className="flex-1 bg-zinc-950 border border-zinc-800 p-3 text-sm text-zinc-400 font-mono">
                                        {isCreating ? t("Loading") : username}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={createRoom}
                                className="w-full bg-zinc-100 text-black p-3 text-sm font-bold hover:bg-zinc-50 hover:text-black transition-colors mt-2 cursor-pointer disabled:opacity-50"
                                disabled={isCreating}
                            >
                                {t("CreateSecureRoom")}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
