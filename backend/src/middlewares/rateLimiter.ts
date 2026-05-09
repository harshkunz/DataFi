import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

export const loginLimiter = rateLimit({
    windowMs: 10*60*1000,
    max: 5,

    handler: (_req: Request, res: Response) => {
        return res.status(429).json({
            success: false,
            msg: "Limit Reached, Try after 10 minutes"
        })
    }
})

export const globalLimiter = rateLimit({
    windowMs: 30*60*1000,
    max: 100,

    standardHeaders: true,
    legacyHeaders: false,

    handler: (_req: Request, res: Response) => {
        return res.status(429).json({
            success: false,
            msg: "Too many requests, Try again later"
        })
    }
})
