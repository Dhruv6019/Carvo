import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import customerRoutes from "./routes/customer.routes";
import sellerRoutes from "./routes/seller.routes";
import providerRoutes from "./routes/provider.routes";
import deliveryRoutes from "./routes/delivery.routes";
import supportRoutes from "./routes/support.routes";
import orderRoutes from "./routes/order.routes";
import paymentRoutes from "./routes/payment.routes";
import couponRoutes from "./routes/coupon.routes";
import notificationRoutes from "./routes/notification.routes";
import categoryRoutes from "./routes/category.routes";
import uploadRoutes from "./routes/upload.routes";
import { connectDatabase } from "./config/database";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(express.json());

// Connect to Database
connectDatabase();

// Routes
import userRoutes from "./routes/user.routes";

// ... existing code ...

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
app.use("/customer", customerRoutes);
app.use("/seller", sellerRoutes);
app.use("/provider", providerRoutes);
app.use("/delivery", deliveryRoutes);
app.use("/support", supportRoutes);
app.use("/orders", orderRoutes);
app.use("/payments", paymentRoutes);
app.use("/coupons", couponRoutes);
app.use("/notifications", notificationRoutes);
app.use("/categories", categoryRoutes);
app.use("/upload", uploadRoutes);
import invoiceRoutes from "./routes/invoice.routes";
app.use("/invoices", invoiceRoutes);
import seedRoutes from "./routes/seed.routes";
app.use("/seed", seedRoutes);
import databaseRoutes from "./routes/database.routes";
app.use("/database", databaseRoutes);

app.get("/", (req, res) => {
    res.send("Carvo API is running");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
