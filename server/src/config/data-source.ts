import { DataSource } from "typeorm";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const AppDataSource = new DataSource({
    type: process.env.NODE_ENV === "test" ? "sqlite" : "mysql",
    database: process.env.NODE_ENV === "test" ? ":memory:" : (process.env.DB_NAME || "carvo_db"),
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    synchronize: true, // Always sync in dev/test for now
    logging: false,
    entities: [path.join(__dirname, "../entities/*.{ts,js}")],
    migrations: [path.join(__dirname, "../migrations/*.{ts,js}")],
    subscribers: [],
    dropSchema: process.env.NODE_ENV === "test" ? true : false,
});
