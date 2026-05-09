import { Request, Response } from "express";
import { 
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} from "../config/jwt";

import { loginService } from "../services/auth.service";
import { addToBlacklist } from "../utils/blacklist.token";
import { 
    LoginBody,
    LoginResponse,
    ErrorResponse
} from "../types/auth.types";


type ApiResponse<T> = 
    | { success: true; data: T } 
    | ErrorResponse


export const login = async (
    req: Request<{}, {}, LoginBody>,
    res: Response<ApiResponse<LoginResponse>>
): Promise<Response> => {
    try {
        const { email, password } = req.body;
        const user = await loginService(email, password);

        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role
        })

        const refreshToken = generateRefreshToken({
            id: user.id,
            role: user.role
        });

        return res.status(200).json({
            success: true,
            data: {
                accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    role: user.role
                }
            }
        });
    } catch (error: unknown) {
        if(error instanceof Error && error.message === "IC"){
            return res.status(400).json({
                success: false,
                msg: "Invalid email or password"
            })
        }

        return res.status(500).json({
            success: false,
            msg: "Login failed"
        });
    }
}

export const refresh = async (
    req: Request,
    res: Response<ApiResponse<{ accessToken: string }>>
): Promise<Response> => {
    try {
        const { refreshToken } = req.body;
        const decoded = verifyRefreshToken( refreshToken );

        const accessToken = generateAccessToken({
            id: decoded.id,
            role: decoded.role
        })

        return res.status(200).json({
            success: true,
            data: { accessToken }
        });

    } catch (error: unknown) {
        // Error Handler

        return res.status(401).json({
            success: false,
            msg: "Invaild refresh token"
        })
    }
};

export const logout = async (
    req: Request,
    res: Response<ApiResponse<{ msg: string }>>
): Promise<Response> => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(token) addToBlacklist(token);
        
        return res.status(200).json({
            success: true,
            data: { msg: "Logout User" }
        });

    } catch (error: unknown) {
        // Error Handler

        return res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        });
    }
}

