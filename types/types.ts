export interface User {
    id: number;
    email: string;
    password: string;
    role: string;
    createdAt: Date;
}

export interface Category {
    id: number;
    name: string;
}

export interface Book {
    id: number;
    categoryId: Category["id"];
    title: string;
    author: string;
    price: number;
    createdAt: Date;
}

export interface Payload {
    id: User["id"];
    email: User["email"];
    role: User["role"];
}

declare global {
    namespace Express {
        export interface Request {
            user: Payload;
        }
    }
}

export interface UserPayload {
    id: number;
    username: string;
    email: string;
}