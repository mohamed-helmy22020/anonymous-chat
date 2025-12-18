import express from "express";
import { createRoom, deleteRoom, getRoomMessages } from "../controllers/chat";
const chatRouter = express.Router();

chatRouter.route("/room").post(createRoom);
chatRouter.route("/room/:roomId/messages").get(getRoomMessages);

chatRouter.route("/room/:roomId").delete(deleteRoom);

export default chatRouter;
