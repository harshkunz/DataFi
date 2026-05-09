import { Request, Response, NextFunction } from "express";
import { Role } from "../types/admin.users.types";

export const roleAuthorize = (...roles: Role[]) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ): Response | void => {
        const userRole = req.user?.role;

        if(!userRole || !roles.includes(userRole)){
            return res.status(403).json({
                success: false,
                msg: "Forbidden"
            });
        }
        
        next();
    }
}