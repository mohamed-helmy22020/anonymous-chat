import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "types";
import { UnauthenticatedError } from "../errors";

const authenticateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const isHandshake = req._query?.sid === undefined;
    if (!isHandshake) {
        return next();
    }
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthenticatedError("not-authenticated");
        }
        const token = authHeader.split(" ")[1];

        const payload = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        ) as CustomJwtPayload;

        req.username = payload.username;
        next();
    } catch (error) {
        return next(new UnauthenticatedError("not-authenticated"));
    }
};

export default authenticateUser;
