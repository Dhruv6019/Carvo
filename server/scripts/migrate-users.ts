import { AppDataSource } from "../src/config/data-source";
import { User } from "../src/entities/User";

async function migrate() {
    try {
        console.log("Initializing DataSource...");
        await AppDataSource.initialize();
        console.log("DataSource initialized.");

        const userRepository = AppDataSource.getRepository(User);

        console.log("Updating existing users to be verified...");

        // Update all users where isVerified is null or false (assuming legacy users are valid)
        // Adjust the query if you only want to targeting NULLs specifically, but safest is to verify all current ones
        // since we just introduced this feature.

        const result = await userRepository.createQueryBuilder()
            .update(User)
            .set({ isVerified: true })
            .where("isVerified IS NULL OR isVerified = :falseVal", { falseVal: false })
            .execute();

        console.log(`Migration complete. Affected rows: ${result.affected}`);

        process.exit(0);
    } catch (error) {
        console.error("Error migrating users:", error);
        process.exit(1);
    }
}

migrate();
