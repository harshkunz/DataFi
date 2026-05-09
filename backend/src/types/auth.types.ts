import { Role } from "./admin.users.types"

export interface TokenPayload {
    id: number;
    role: Role
}

export interface LoginBody {
    email: string,
    password: string
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    role: Role;
  };
}

export type ErrorResponse = {
  success: false;
  msg: string;
};