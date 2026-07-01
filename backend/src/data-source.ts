import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config(); // load .env before reading process.env
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: ['dist/**/*.entity.js'],    // ← compiled output
    migrations: ['dist/migrations/*.js'],   // ← compiled output
});