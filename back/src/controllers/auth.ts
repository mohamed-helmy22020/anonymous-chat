import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { generateUsername } from "../utils";

export const register = async (req: Request, res: Response) => {
    const userData = {
        username: generateUsername(),
    };

    res.status(StatusCodes.CREATED).json({
        success: true,
        username: userData.username,
        accessToken: jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET),
    });
};
