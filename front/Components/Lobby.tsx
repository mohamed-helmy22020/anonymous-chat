"use client";

import { useRouter } from "@/i18n/navigation";
import { createRoomAction, register } from "@/lib/actions/user.actions";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Lobby({
    username: usernameProp,
}: {
    username?: string;
}) {
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(!!!usernameProp);
    const [username, setUsername] = useState(usernameProp);

    const searchParams = useSearchParams();
    const wasDestroyed = searchParams.get("destroyed") === "true";
    const error = searchParams.get("error");
    const redirect = searchParams.get("redirect");

    const createRoom = async () => {
        setIsCreating(true);
        try {
            const res = await createRoomAction();
            if (!res.success) {
                throw res.msg;
            }
            router.push(`/room/${res.room.id}`);
        } catch (error) {
            console.log(error);
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
            } catch (error) {
                console.log(error);
            }

            setIsCreating(false);
        };
        createAccount();
    }, [username]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                {wasDestroyed && (
                    <div className="bg-red-950/50 border border-red-900 p-4 text-center">
                        <p className="text-red-500 text-sm font-bold">
                            ROOM DESTROYED
                        </p>
                        <p className="text-zinc-500 text-xs mt-1">
                            All messages were permanently deleted.
                        </p>
                    </div>
                )}
                {error === "room-not-found" && (
                    <div className="bg-red-950/50 border border-red-900 p-4 text-center">
                        <p className="text-red-500 text-sm font-bold">
                            ROOM NOT FOUND
                        </p>
                        <p className="text-zinc-500 text-xs mt-1">
                            This room may have expired or never existed.
                        </p>
                    </div>
                )}
                {error === "unknown-error" && (
                    <div className="bg-red-950/50 border border-red-900 p-4 text-center">
                        <p className="text-red-500 text-sm font-bold">
                            Unknown Error
                        </p>
                        <p className="text-zinc-500 text-xs mt-1">Error</p>
                    </div>
                )}
                {error === "room-full" && (
                    <div className="bg-red-950/50 border border-red-900 p-4 text-center">
                        <p className="text-red-500 text-sm font-bold">
                            ROOM FULL
                        </p>
                        <p className="text-zinc-500 text-xs mt-1">
                            This room is at maximum capacity.
                        </p>
                    </div>
                )}

                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight text-green-500">
                        {">"}private_chat
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        A private, self-destructing chat room.
                    </p>
                </div>

                <div className="border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md">
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="flex items-center text-zinc-500">
                                Your Identity
                            </label>

                            <div className="flex items-center gap-3">
                                <div className="flex-1 bg-zinc-950 border border-zinc-800 p-3 text-sm text-zinc-400 font-mono">
                                    {isCreating ? "Loading..." : username}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={createRoom}
                            className="w-full bg-zinc-100 text-black p-3 text-sm font-bold hover:bg-zinc-50 hover:text-black transition-colors mt-2 cursor-pointer disabled:opacity-50"
                            disabled={isCreating}
                        >
                            CREATE SECURE ROOM
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
