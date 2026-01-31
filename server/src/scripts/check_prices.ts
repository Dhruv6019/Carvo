
import { AppDataSource } from "../config/data-source";
import { Part } from "../entities/Part";

async function checkParts() {
    try {
        await AppDataSource.initialize();
        console.log("Database connected");

        const partRepo = AppDataSource.getRepository(Part);
        const allParts = await partRepo.find();

        console.log(`Total Parts in DB: ${allParts.length}`);

        const prices = allParts.map(p => Number(p.price));
        const maxPrice = Math.max(...prices);
        const minPrice = Math.min(...prices);

        console.log(`Min Price: ${minPrice}`);
        console.log(`Max Price: ${maxPrice}`);

        const expensiveParts = allParts.filter(p => Number(p.price) > 4000);
        console.log(`Parts cheaper than 4000: ${allParts.length - expensiveParts.length}`);
        console.log(`Parts more expensive than 4000: ${expensiveParts.length}`);

        if (expensiveParts.length > 0) {
            console.log("Expensive parts:", expensiveParts.map(p => ({
                id: p.id,
                name: p.name,
                price: p.price
            })));
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await AppDataSource.destroy();
    }
}

checkParts();
