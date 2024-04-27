//import mysql, { ResultSetHeader } from 'mysql2/promise';
import dotenv from 'dotenv';
import pg, { QueryResult } from 'pg';
import { databaseConfig } from '../config/config'

dotenv.config();

const pgClient = new pg.Client({
  host: databaseConfig.host,
  database: databaseConfig.databaseName,
  port: databaseConfig.port,
  user: databaseConfig.username,
  password: databaseConfig.password,
  ssl: true
});

console.log(`connecting to database ${databaseConfig.databaseName} at ${databaseConfig.host}`);
pgClient.connect((error) => {
  if(error) {
    console.error(error, 'failed to connect to database');
    throw error;
  }
});
console.log(`connected to database`);

type TypedQueryResult<T> = QueryResult & { rows: T[] };


export const query = async (sql: string, params: any[] = []): Promise<QueryResult> => {
  console.log(sql);
  console.log(params);
  const result = await pgClient.query(sql, params);
  return result;  // This will return a QueryResult with rows typed as T[]
};

