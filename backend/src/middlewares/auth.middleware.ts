import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../config/jwt";
import { isBlacklisted } from "../utils/blacklist.token";

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if(!token || isBlacklisted(token)) {
            return res.status(401).json({
                success: false,
                msg: "Unauthorized user"
            })
        }

        const decoded = verifyAccessToken(token);
        req.user = decoded;

        next();

    } catch {
        return res.status(403).json({
            success: false,
            msg: "Invalid token"
        })
    }
}