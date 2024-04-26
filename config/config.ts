import dotenv from 'dotenv';
dotenv.config();

const databaseConfig = {
    connectionString: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST,
    databaseName: process.env.DATABASE_NAME,
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
};

console.log(databaseConfig);

if (!(databaseConfig.connectionString ||
     (databaseConfig.host &&
      databaseConfig.databaseName &&
      databaseConfig.port &&
      databaseConfig.username &&
      databaseConfig.password))) {
    throw new Error('Must define either DATABASE_URL or all of DATABASE_HOST, DATABASE_NAME, DATABASE_PORT, DATABASE_USERNAME, DATABASE_PASSSWORD in the environment');
}

const jwtConfig = {
    secret: process.env.JWT_SECRET as string,
    expiration: process.env.JWT_EXPIRATION as string,
};

if (!jwtConfig.secret || !jwtConfig.expiration) {
    throw new Error('JWT_SECRET and JWT_EXPIRATION environment variables not set');
}

export {
    databaseConfig,
    jwtConfig
};