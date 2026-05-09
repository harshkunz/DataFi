import swaggerJsdoc from "swagger-jsdoc";
import ENV from "./config/env";


const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Finance Backend API",
      version: "1.0.0",
      description: "Finance API Documentation",
    },

    servers: [
        {  url: ENV.NODE_ENV === "production" 
            ? "https://financedata-backend.onrender.com/api"
            : `http://localhost:${ENV.PORT}/api` 
        }
    ],

    tags: [
        { 
            name: "Auth", 
            description: "Authentication APIs" 
        },
        { 
            name: "Dashboard", 
            description: "Dashboard APIs" 
        },
        { 
            name: "Admin Users", 
            description: "User Management APIs" 
        },
        { 
            name: "Admin Transactions", 
            description: "Transaction Management APIs" 
        },
    ],

    components: {

      securitySchemes: {
        Bearer: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token: Bearer <token>",
        },
      },

        schemas: {

            // LOGIN

            LoginBody: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string", format: "email", example: "test@gmail.com" },
                    password: { type: "string", example: "12345" }
                }
            },

            LoginResponse: {
                type: "object",
                properties: {
                success: { type: "boolean", example: true },
                    data: {
                        type: "object",
                        properties: {
                            accessToken: { type: "string" },
                            refreshToken: { type: "string" },
                            user: {
                                type: "object",
                                properties: {
                                    id: { type: "number", example: 1 },
                                    role: {
                                        type: "string",
                                        enum: ["ADMIN", "ANALYST", "VIEWER"],
                                    },
                                },
                            },
                        },
                    },
                },
            },

            // USER

            CreateUserBody: {
                type: "object",
                required: ["name", "email", "password", "role", "status"],
                properties: {
                    name: { type: "string", example: "Harsh" },
                    email: { type: "string", format: "email", example: "harsh@gmail.com" },
                    password: { type: "string", example: "123456" },
                    role: {
                        type: "string",
                        enum: ["ADMIN", "ANALYST", "VIEWER"],
                    },
                    status: {
                        type: "string",
                        enum: ["ACTIVE", "INACTIVE"],
                    },
                },
            },

            UserResponse: {
                type: "object",
                properties: {
                    id: { type: "number", example: 1 },
                    name: { type: "string" },
                    email: { type: "string" },
                    role: {
                        type: "string",
                        enum: ["ADMIN", "ANALYST", "VIEWER"],
                    },
                    status: {
                        type: "string",
                        enum: ["ACTIVE", "INACTIVE"],
                    },
                    msg: { type: "string" },
                },
            },

            // TRANSACTION

            CreateTransactionBody: {
                type: "object",
                required: ["userId", "amount", "type", "categoryName", "date"],
                properties: {
                    userId: { type: "number", example: 1 },
                    amount: { type: "number", example: 5000 },
                    type: {
                        type: "string",
                        enum: ["INCOME", "EXPENSE"],
                    },
                    categoryName: { type: "string", example: "Food" },
                    date: {
                        type: "string",
                        format: "date-time",
                        example: "2025-04-01T00:00:00Z",
                    },
                    notes: { type: "string", example: "Monthly salary" },
                },
            },

            UpdateTransactionBody: {
                type: "object",
                properties: {
                    amount: { type: "number" },
                    type: {
                        type: "string",
                        enum: ["INCOME", "EXPENSE"],
                    },
                    categoryName: { type: "string" },
                    date: { type: "string", format: "date-time" },
                    notes: { type: "string" },
                },
            },

            TransactionResponse: {
                type: "object",
                properties: {
                    id: { type: "number", example: 1 },
                    userId: { type: "number" },
                    amount: { type: "number" },
                    type: {
                        type: "string",
                        enum: ["INCOME", "EXPENSE"],
                    },
                    categoryName: { type: "string" },
                    date: { type: "string", format: "date-time" },
                    notes: { type: "string" },
                    msg: { type: "string" },
                },
            },

            TotalByType: {
                type: "object",
                properties: {
                    type: {
                        type: "string",
                        enum: ["INCOME", "EXPENSE"],
                    },
                    amount: { type: "number" },
                },
            },

            BalanceResponse: {
                type: "object",
                properties: {
                    totalIncome: { type: "number", example: 10000 },
                    totalExpense: { type: "number", example: 4000 },
                    netBalance: { type: "number", example: 6000 },
                },
            },

            // PAGINATION

            PaginationMeta: {
                type: "object",
                properties: {
                    total: { type: "number", example: 100 },
                    page: { type: "number", example: 1 },
                    limit: { type: "number", example: 10 },
                    totalPages: { type: "number", example: 10 },
                },
            },

            PaginationResponse: {
                type: "object",
                properties: {
                    data: {
                        type: "array",
                        items: {
                            $ref: "#/components/schemas/TransactionResponse",
                        },
                    },
                    meta: {
                        $ref: "#/components/schemas/PaginationMeta",
                    },
                },
            },

            // ERROR

            ErrorResponse: {
                type: "object",
                properties: {
                success: { type: "boolean", example: false },
                msg: { type: "string", example: "Something went wrong" },
                    errors: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                field: { type: "string" },
                                message: { type: "string" },
                            },
                        },
                    },
                },
            },
        },

        responses: {
            LoginSuccess: {
                description: "Login successful",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/LoginResponse",
                        },
                    },
                },
            },

            BadRequest: {
                description: "Bad request",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/ErrorResponse",
                        },
                    },
                },
            },

            Unauthorized: {
                description: "Unauthorized",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/ErrorResponse",
                        },
                    },
                },
            },

            ServerError: {
                description: "Internal server error",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/ErrorResponse",
                        },
                    },
                },
            },
        },
        
    }
  },

  apis: ["./src/routes/*.ts"],

};

export const swaggerSpec = swaggerJsdoc(options);