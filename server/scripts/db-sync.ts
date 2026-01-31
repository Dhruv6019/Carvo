import { AppDataSource } from "../src/config/data-source";

async function sync() {
    try {
        console.log("Initializing DataSource...");
        await AppDataSource.initialize();
        console.log("DataSource initialized.");

        console.log("Synchronizing database...");
        await AppDataSource.synchronize(false); // false means don't drop schema
        console.log("Database synchronized successfully.");

        process.exit(0);
    } catch (error) {
        console.error("Error synchronizing database:", error);
        process.exit(1);
    }
}

sync();
