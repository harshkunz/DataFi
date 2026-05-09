import { Role } from "./admin.users.types";

declare module "express-serve-static-core" {
    interface Request {
        user?: {
            id: number;
            role: Role;
        }
    }
}

export {};