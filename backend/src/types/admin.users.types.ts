
export type Role = "ADMIN" | "ANALYST" | "VIEWER";
export type Status = "ACTIVE" | "INACTIVE";

// Request<Params, ResBody, ReqBody, Query>

export interface CreateUserBody {
  name: string;
  email: string;
  password: string;
  role: Role;
  status: Status
}

export type CreateUserResponse = {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: Status
}

export type UserResponse = {
  id: number;
  name?: string;
  email?: string;
  role?: Role;
  status?: Status,
  msg?: String
}

export type ErrorResponse = {
  success: false;
  msg?: string;
  errors?: {
    field: string;
    message: string;
  }[];
};