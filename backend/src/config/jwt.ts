import jwt from 'jsonwebtoken';
import { TokenPayload } from "../types/auth.types" 
import ENV from './env';


const ACCESS_SECRET = ENV.ACCESS_SECRET;
const REFRESH_SECRET = ENV.REFRESH_SECRET;


export const generateAccessToken = (payload: TokenPayload) => {
    return jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: "30m"
    })
}

export const generateRefreshToken = (payload: TokenPayload) => {
    return jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: "7d"
    })
}

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
    
}

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
}

