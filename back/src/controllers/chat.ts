import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose, { isValidObjectId } from "mongoose";
import { DefaultEventsMap, Socket } from "socket.io";

import { BadRequestError, UnauthenticatedError } from "../errors";

import { getIO } from "../middleware/socketMiddleware";
import Message from "../models/Message";
import Room, { roomTtl } from "../models/Room";

export const createRoom = async (req: Request, res: Response) => {
    const username = req.username;
    const room = await Room.create({
        participants: [username],
        expiresAt: new Date(Date.now() + roomTtl * 1000),
    });
    res.status(StatusCodes.CREATED).json({
        success: true,
        room: room.getData(),
    });
};

export const sendMessage = async (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    {
        roomId,
        text,
    }: {
        roomId: mongoose.Types.ObjectId;
        text: string;
    },
    ack?: (response: any) => void
) => {
    const io = getIO();
    const chatNamespace = io.of("/api/chat");

    const username = (socket.request as Request).username;

    const room = await Room.findById(roomId);
    if (!room) {
        throw new BadRequestError("No room with this id");
    }
    const _id = new mongoose.Types.ObjectId();
    const messageData = {
        _id,
        roomId: room._id,
        sender: username,
        text,
        expiresAt: room.expiresAt,
    };

    const message = await Message.create(messageData);
    console.log("message");

    const response = {
        success: true,
        message: message.getData(),
        room: room.getData(),
    };

    if (ack) {
        ack(response);
    }

    chatNamespace.to(`room:${roomId}`).emit("receiveMessage", response);
};

export const getRoomMessages = async (req: Request, res: Response) => {
    const username = req.username;
    const { roomId } = req.params;
    if (!roomId || !isValidObjectId(roomId)) {
        throw new BadRequestError("room-not-found");
    }

    const room = await Room.findById(roomId);
    if (!room) {
        throw new BadRequestError("room-not-found");
    }

    if (
        room.participants.length >= 2 &&
        !room.participants.includes(username)
    ) {
        throw new UnauthenticatedError("room-full");
    } else if (
        room.participants.length < 2 &&
        !room.participants.includes(username)
    ) {
        room.participants.push(username);
        await room.save();
    }

    const messages = await Message.find({
        roomId,
    })
        .sort({ createdAt: -1 })
        .then((docs) => docs.map((doc) => doc.getData()));
    console.log({ roomId });
    console.log({ messages });
    res.status(StatusCodes.OK).json({
        success: true,
        messages,
        room: room.getData(),
    });
};

export const deleteRoom = async (req: Request, res: Response) => {
    const chatSocket = getIO().of("/api/chat");
    const username = req.username;
    const { roomId } = req.params;
    const room = await Room.findById(roomId);
    if (!room) {
        throw new BadRequestError("No room with this id");
    }
    if (!room.participants.includes(username)) {
        throw new UnauthenticatedError("Can't delete this room");
    }

    await Promise.all([
        room.deleteOne(),
        Message.deleteMany({
            roomId,
        }),
    ]);

    chatSocket.to(`room:${roomId}`).emit("roomDestroyed");
    res.status(200).json({
        success: true,
        msg: "Room deleted successfully",
    });
};

export const joinRoom = async (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    roomId: string
) => {
    console.log({ roomId });
    socket.join(`room:${roomId}`);
};
