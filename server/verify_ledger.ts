import { AppDataSource } from "./src/config/data-source";
import { Transaction } from "./src/entities/Transaction";

async function verifyLedger() {
    try {
        await AppDataSource.initialize();
        console.log("Database connected.");

        const repo = AppDataSource.getRepository(Transaction);
        const transactions = await repo.find({
            order: { created_at: "DESC" },
            take: 10,
            relations: ["user"] // Assuming user relation exists
        });

        console.log("\n--- RECENT TRANSACTIONS (LEDGER) ---");
        if (transactions.length === 0) {
            console.log("No transactions found yet.");
        } else {
            transactions.forEach(t => {
                console.log(`[${t.id}] ${t.created_at.toLocaleString()} | Type: ${t.type} | Amount: ${t.amount} | User: ${t.user?.name || t.userId}`);
                console.log(`     Desc: ${t.description}`);
            });
        }

        console.log("\n------------------------------------\n");
        process.exit(0);
    } catch (error) {
        console.error("Error reading ledger:", error);
        process.exit(1);
    }
}

verifyLedger();
