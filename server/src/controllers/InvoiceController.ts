import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Invoice, InvoiceStatus } from "../entities/Invoice";
import { Order } from "../entities/Order";

export class InvoiceController {
    static async generateInvoice(req: Request, res: Response) {
        try {
            const { orderId } = req.params;
            const orderRepository = AppDataSource.getRepository(Order);
            const invoiceRepository = AppDataSource.getRepository(Invoice);

            // Check if order exists
            const order = await orderRepository.findOne({
                where: { id: parseInt(orderId) },
                relations: ["customer"]
            });

            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            // Security Check: Allow Admin OR Order Owner
            const user = (req as any).user;
            if (user.role !== 'admin' && order.customer.id !== user.userId) {
                return res.status(403).json({ message: "Access denied" });
            }

            // Check if invoice already exists
            const existingInvoice = await invoiceRepository.findOne({
                where: { relationId: order.id }
            });

            if (existingInvoice) {
                return res.status(200).json(existingInvoice);
            }

            // Generate Invoice Data
            const invoice = new Invoice();
            invoice.order = order;
            invoice.relationId = order.id;

            // Generate Invoice Number (Simple format: INV-{YYYYMMDD}-{ORDERID})
            const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
            invoice.invoice_number = `INV-${dateStr}-${order.id.toString().padStart(4, '0')}`;

            invoice.issue_date = new Date();
            // Due date 14 days from now
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 14);
            invoice.due_date = dueDate;

            // Financials
            invoice.subtotal = order.total_amount; // Assuming order total is subtotal for simplicity, or calculation could be refined
            invoice.tax_rate = 10.00; // 10% Tax
            invoice.tax_amount = parseFloat((Number(invoice.subtotal) * (invoice.tax_rate / 100)).toFixed(2));
            invoice.total = Number((Number(invoice.subtotal) + invoice.tax_amount).toFixed(2));

            invoice.status = OrderStatusToInvoiceStatus(order.status as any); // Map order status to invoice status

            // Snapshot details
            invoice.issued_to_name = order.customer.name;
            invoice.issued_to_email = order.customer.email;
            invoice.issued_to_address = order.shipping_address;

            await invoiceRepository.save(invoice);

            return res.status(201).json(invoice);

        } catch (error) {
            console.error("Generate Invoice Error:", error);
            return res.status(500).json({ message: "Failed to generate invoice" });
        }
    }

    static async getInvoice(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const invoiceRepository = AppDataSource.getRepository(Invoice);

            // Try finding by ID first, then by Order ID
            let invoice = await invoiceRepository.findOne({
                where: { id: parseInt(id) },
                relations: ["order", "order.items", "order.items.part", "order.customer"]
            });

            if (!invoice) {
                // Try as Order ID
                invoice = await invoiceRepository.findOne({
                    where: { relationId: parseInt(id) },
                    relations: ["order", "order.items", "order.items.part", "order.customer"]
                });
            }

            if (!invoice) {
                return res.status(404).json({ message: "Invoice not found" });
            }

            // Security Check: Allow Admin OR Order Owner
            const user = (req as any).user;
            if (user.role !== 'admin' && invoice.order.customer.id !== user.userId) {
                return res.status(403).json({ message: "Access denied" });
            }

            return res.json(invoice);
        } catch (error) {
            console.error("Get Invoice Error:", error);
            return res.status(500).json({ message: "Failed to fetch invoice" });
        }
    }
}

function OrderStatusToInvoiceStatus(orderStatus: string): InvoiceStatus {
    if (orderStatus === 'delivered' || orderStatus === 'shipped') return InvoiceStatus.PAID;
    if (orderStatus === 'cancelled') return InvoiceStatus.CANCELLED;
    return InvoiceStatus.PENDING;
}
