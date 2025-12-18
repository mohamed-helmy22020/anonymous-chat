import { type Request } from "express";
import { Server } from "socket.io";
import { joinRoom, sendMessage } from "../controllers/chat";

export const onlineUsers = new Map<string, boolean>();

const registerChatNamespace = (io: Server) => {
    const chatNamespace = io.of("/api/chat");
    chatNamespace.on("connection", (socket) => {
        console.log("A user connected to chat namespace");

        const req = socket.request as Request;
        const username = req.username;

        if (!username) {
            socket.disconnect();
        }

        socket.join(`user:${username}`);

        socket.on("sendPrivateMessage", async ({ roomId, text }, ack) => {
            try {
                if (!text) {
                    throw new Error("Message text is required.");
                }
                await sendMessage(socket, { roomId, text }, ack);
            } catch (error) {
                if (ack) ack({ success: false, error: error.message });
                chatNamespace
                    .to(`user:${username}`)
                    .emit("errors", error.message);
            }
        });

        socket.on("joinRoom", async (roomId) => {
            try {
                if (!roomId) {
                    throw new Error("roomId is required.");
                }
                await joinRoom(socket, roomId);
            } catch (error) {
                chatNamespace
                    .to(`user:${username}`)
                    .emit("errors", error.message);
            }
        });

        socket.on("disconnect", () => {
            console.log("A user disconnected from chat namespace");
        });
    });
};

export default registerChatNamespace;
