import { db } from "../config/db";
import bcrypt from "bcrypt";


export const loginService = async (
    email: string,
    password: string
) => {

    const user = await db.user.findUnique({
        where: { email }
    })

    if(!user || !await bcrypt.compare(password, user.password)){
        throw new Error("IC");
    }

    return user;
}

