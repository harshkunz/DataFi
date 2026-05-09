import dotenv from "dotenv";
import path from 'path';

dotenv.config({
    path: path.resolve(process.cwd(), ".env")
})

/*
if (!process.env.DATABASE_URL) {
    throw new Error();
}
*/

const ENV = {
    PORT: process.env.PORT || 7000,
    NODE_ENV: process.env.NODE_ENV || "development",

    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,

    ACCESS_SECRET: process.env.ACCESS_SECRET || "",
    REFRESH_SECRET: process.env.REFRESH_SECRET || "",
    
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000"
}

export default ENV;