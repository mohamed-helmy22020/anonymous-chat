"use client";
import { io } from "socket.io-client";
const URL = process.env.NEXT_PUBLIC_BASE_URL as string;
export const socket = io(URL, {
  autoConnect: false,
});
const chatURL = `${URL}/chat`;

export const chatSocket = io(chatURL, {
  autoConnect: false,
});
