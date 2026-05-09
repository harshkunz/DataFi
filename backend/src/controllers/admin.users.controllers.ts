import { Request, Response } from "express";
import { 
    createUserService,
    updateUserRoleService,
    updateUserStatusService,
    deleteUserService
} from "../services/admin.users.service";

import { 
    CreateUserBody, 
    CreateUserResponse,
    UserResponse,
    Role,
    Status,
    ErrorResponse
} from "../types/admin.users.types";
import { handlePrismaError } from "../utils/prisma.error"


type ApiResponse<T> = 
    | { success: true; data: T } 
    | ErrorResponse


export const createUser = async (
    req: Request<{}, {}, CreateUserBody>,
    res: Response<ApiResponse<CreateUserResponse>>
): Promise<Response> => {
    try {
        const user = await createUserService(req.body);

        const response: CreateUserResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
        };

        return res.status(201).json({
            success: true,
            data: response
        });

    } catch (error: unknown) {
        const handle = handlePrismaError(error, "users", res);
        if(handle) return handle;

        return res.status(500).json({
            success: false,
            msg: "Internal server error"
        });
    }
}


export const updateUserRole = async (
  req: Request<{ id: string }, {}, { role: Role }>,
  res: Response<ApiResponse<UserResponse>>
): Promise<Response> => {
    try {
        const id = Number(req.params.id);
        const { role } = req.body;

        const user = await updateUserRoleService(id, role);

        return res.status(200).json({
            success: true,
            data: {
                id: user.id,
                role: user.role,
            }
        })

    } catch(error: unknown) {
        const handle = handlePrismaError(error, "users", res);
        if (handle) return handle;

        return res.status(500).json({
            success: false,
            msg: "Failed to update role"
        });
    }
}


export const updateUserStatus = async (
  req: Request<{ id: string }, {}, { status: Status }>,
  res: Response<ApiResponse<UserResponse>>
): Promise<Response> => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        const user = await updateUserStatusService(id, status);

        return res.status(200).json({
            success: true,
            data: {
                id: user.id,
                status: user.status
            }
        })

    } catch (error: unknown) {
        const handle = handlePrismaError(error, "users", res);
        if (handle) return handle;

        return res.status(500).json({
            success: false,
            msg: "Failed to update status"
        });
    }
}


export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<UserResponse>>
): Promise<Response> => {
    try {
        const id = Number(req.params.id);
        await deleteUserService(id);

        return res.status(200).json({
            success: true,
            data: {
                id: id,
                msg: `${id} user deleted`
            }
        })

    } catch (error: unknown) {
        const handle = handlePrismaError(error, "users", res);
        if (handle) return handle;

        return res.status(500).json({
            success: false,
            msg: "Failed to delete user"
        });
    }
}


