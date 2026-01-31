import request from "supertest";
import express from "express";
import authRoutes from "../routes/auth.routes";
import { AppDataSource } from "../config/data-source";

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

beforeAll(async () => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
    } catch (error) {
        console.error("Error initializing data source:", error);
    }
});

afterAll(async () => {
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }
});

describe("Auth Integration", () => {
    const testEmail = `test-${Date.now()}@test.com`;

    it("should signup a new user", async () => {
        try {
            const res = await request(app).post("/auth/signup").send({
                email: testEmail,
                password: "password",
                name: "Test User",
                role: "customer"
            });
            if (res.status !== 201) {
                console.error("Signup failed:", res.body);
            }
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("accessToken");
        } catch (error) {
            console.error("Signup test error:", error);
            throw error;
        }
    });

    it("should login the user", async () => {
        const res = await request(app).post("/auth/login").send({
            email: testEmail,
            password: "password"
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
    });
});
