import { AppDataSource } from "../config/data-source";
import { Invoice, InvoiceStatus } from "../entities/Invoice";
import { Order } from "../entities/Order";

export class InvoiceService {
    static async generateInvoiceForOrder(orderId: number): Promise<Invoice> {
        const orderRepository = AppDataSource.getRepository(Order);
        const invoiceRepository = AppDataSource.getRepository(Invoice);

        // Check if order exists
        const order = await orderRepository.findOne({
            where: { id: orderId },
            relations: ["customer"]
        });

        if (!order) {
            throw new Error("Order not found");
        }

        // Check if invoice already exists
        const existingInvoice = await invoiceRepository.findOne({
            where: { relationId: order.id }
        });

        if (existingInvoice) {
            return existingInvoice;
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
        // Assuming order.final_amount is the grand total the user paid.
        // We will back-calculate tax if we want, or just assume add-on tax.
        // For consistency with InvoiceController logic: 
        // Logic was: subtotal = order.total, tax = 10%, total = subtotal + tax.
        // BUT Order.final_amount usually implies the final thing the user paid.
        // If the Order flow doesn't add tax, then the Invoice shouldn't magically add it *on top* if it wasn't charged.
        // However, sticking to previous logic for now to ensure consistency, but if Order.final_amount is what was charged, 
        // then the invoice total must match Order.final_amount.
        // Let's assume Order includes tax or is tax-inclusive.
        // Simple approach: Invoice matches Order.

        invoice.subtotal = order.total_amount;
        // If we want to show tax, we should calculate it from the total or add it if it wasn't already.
        // The previous controller logic ADDED tax. So I will keep that behavior for now to avoid breaking changes, 
        // although it implies the user pays MORE than the order final_amount? 
        // Wait, if OrderController takes payment for `final_amount`, then Invoice cannot be higher.
        // Let's look at OrderController: `order.final_amount = final_amount || totalAmount;`.
        // If I add tax in Invoice, it will differ.
        // CORRECT LOGIC: Invoice Total === Order Final Amount.
        // I will calculate tax *component* from the total.
        // Tax Rate = 10%. Total = Subtotal * 1.10. -> Subtotal = Total / 1.10.

        invoice.total = order.final_amount;
        invoice.tax_rate = 10.00;
        invoice.subtotal = Number((invoice.total / 1.10).toFixed(2));
        invoice.tax_amount = Number((invoice.total - invoice.subtotal).toFixed(2));

        invoice.status = this.mapOrderStatusToInvoiceStatus(order.status as any);

        // Snapshot details
        invoice.issued_to_name = order.customer.name;
        invoice.issued_to_email = order.customer.email;
        invoice.issued_to_address = order.shipping_address;

        await invoiceRepository.save(invoice);

        return invoice;
    }

    private static mapOrderStatusToInvoiceStatus(orderStatus: string): InvoiceStatus {
        if (orderStatus === 'delivered' || orderStatus === 'shipped' || orderStatus === 'completed') return InvoiceStatus.PAID;
        if (orderStatus === 'cancelled') return InvoiceStatus.CANCELLED;
        return InvoiceStatus.PENDING;
    }
}
