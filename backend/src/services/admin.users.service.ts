import { db } from "../config/db";
import { CreateUserBody, Role, Status } from "../types/admin.users.types";
import bcrypt from "bcrypt";


export const createUserService = async (data: CreateUserBody) => {
    const { name, email, password, role } = data;

    // Password Security
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role
        }
    });

    return user;
}

export const updateUserRoleService = async (id: number, role: Role) => {
    const user = await db.user.update({
        where: { id },
        data: { role }
    });

    return user;
}

export const updateUserStatusService = async (id: number, status: Status) => {
    const user = await db.user.update({
        where: { id },
        data: { status }
    });

    return user;
}

export const deleteUserService = async (id: number) => {
    await db.user.delete({
        where: { id }
    });

    return;
};

