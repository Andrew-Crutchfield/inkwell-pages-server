//import mysql, { ResultSetHeader } from 'mysql2/promise';
import dotenv from 'dotenv';
import pg, { QueryResult } from 'pg';

dotenv.config();

const pgClient = new pg.Client({
  connectionString: process.env.DATABASE_URL
});

console.log(`connecting to database`);
pgClient.connect((error) => {
  if(error) {
    console.error(error, 'failed to connect to the database');
    throw error;
  }
});
console.log(`connected to database`);


export const query = async <T = QueryResult>(sql: string, params: any[] = []): Promise<T> => {
  const result = await pgClient.query(sql, params);
  return result as T;
};
