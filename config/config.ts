import dotenv from 'dotenv';
dotenv.config();

const database = {
    connectionString: process.env.DATABASE_URL
};

if (!database.connectionString) {
    throw new Error('DATABASE_URL environment variable not defined');
}

const jwt = {
    secret: process.env.JWT_SECRET as string,
    expiration: process.env.JWT_EXPIRATION as string,
};

if (!jwt.secret || !jwt.expiration) {
    throw new Error('JWT_SECRET and JWT_EXPIRATION environment variables not set');
}

export default {
    database,
    jwt,
};