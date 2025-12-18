import { nanoid } from "nanoid";
import { roomTtl } from "../models/Room";

const ANIMALS = ["wolf", "hawk", "bear", "shark"];
export const generateUsername = () => {
    const word = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    return `anonymous-${word}-${nanoid(5)}`;
};

export const getTTL = (createdAt: string) => {
    const now = new Date();
    const ttlMillis =
        new Date(createdAt).getTime() + roomTtl * 1000 - now.getTime();
    const ttlSeconds = Math.max(0, Math.floor(ttlMillis / 1000));
    return ttlSeconds;
};
