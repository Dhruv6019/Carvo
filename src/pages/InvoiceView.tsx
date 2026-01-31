import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

const InvoiceView = () => {
    const { id } = useParams();
    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await api.get(`/invoices/${id}`);
                setInvoice(res.data);
            } catch (error: any) {
                // If 404, try generating (assuming id is OrderID)
                if (error.response && error.response.status === 404) {
                    try {
                        const genRes = await api.post(`/invoices/${id}/generate`);
                        setInvoice(genRes.data);
                    } catch (genError) {
                        console.error("Failed to generate invoice", genError);
                    }
                } else {
                    console.error("Failed to fetch invoice", error);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchInvoice();
    }, [id]);

    if (loading) return <div className="p-8 text-center">Loading Invoice...</div>;
    if (!invoice) return <div className="p-8 text-center text-red-500">Invoice not found</div>;

    return (
        <div className="min-h-screen bg-white text-black p-8 font-serif">
            <div className="max-w-4xl mx-auto bg-white p-12 shadow-none print:shadow-none print:p-0">
                {/* Header Actions */}
                <div className="flex justify-end mb-8 print:hidden">
                    <Button onClick={() => window.print()} variant="outline" className="flex items-center gap-2">
                        <Printer size={16} />
                        Print Invoice
                    </Button>
                </div>

                {/* Title & Header */}
                <div className="flex justify-between items-start mb-16">
                    <div className="border-t border-black w-32 pt-4">
                        {/* Start Line Decoration */}
                    </div>
                    <h1 className="text-5xl tracking-widest uppercase font-light">INVOICE</h1>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-12 mb-16">
                    {/* Left Column: Issued To & Pay To */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xs font-bold tracking-widest uppercase mb-4 text-gray-500">ISSUED TO:</h3>
                            <div className="text-sm space-y-1">
                                <p className="font-semibold">{invoice.issued_to_name}</p>
                                <p>{invoice.issued_to_email}</p>
                                <p className="whitespace-pre-line text-gray-600">{invoice.issued_to_address}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold tracking-widest uppercase mb-4 text-gray-500">PAY TO:</h3>
                            <div className="text-sm space-y-1">
                                <p className="font-semibold">Carvo Inc.</p>
                                <p>Carvo Bank</p>
                                <p>Account Name: Carvo Admin</p>
                                <p>Account No.: 0123 4567 8901</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Invoice Details */}
                    <div className="text-right">
                        <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2 text-sm justify-end">
                            <span className="font-bold tracking-widest uppercase text-gray-500 text-xs self-center">INVOICE NO:</span>
                            <span className="font-mono">{invoice.invoice_number}</span>

                            <span className="font-bold tracking-widest uppercase text-gray-500 text-xs self-center">DATE:</span>
                            <span>{new Date(invoice.issue_date).toLocaleDateString()}</span>

                            <span className="font-bold tracking-widest uppercase text-gray-500 text-xs self-center">DUE DATE:</span>
                            <span>{new Date(invoice.due_date).toLocaleDateString()}</span>

                            <span className="font-bold tracking-widest uppercase text-gray-500 text-xs self-center">STATUS:</span>
                            <span className="uppercase">{invoice.status}</span>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b-2 border-black">
                                <th className="text-left py-4 font-bold tracking-widest uppercase text-gray-500 w-1/2">DESCRIPTION</th>
                                <th className="text-right py-4 font-bold tracking-widest uppercase text-gray-500">UNIT PRICE</th>
                                <th className="text-center py-4 font-bold tracking-widest uppercase text-gray-500">QTY</th>
                                <th className="text-right py-4 font-bold tracking-widest uppercase text-gray-500">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.order.items.map((item: any, idx: number) => (
                                <tr key={idx} className="border-b border-gray-100">
                                    <td className="py-4 text-gray-700">{item.part?.name || "Product"}</td>
                                    <td className="text-right py-4 text-gray-700">₹{Number(item.price).toFixed(2)}</td>
                                    <td className="text-center py-4 text-gray-700">{item.quantity}</td>
                                    <td className="text-right py-4 text-gray-700">₹{(Number(item.price) * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-24">
                    <div className="w-64 space-y-3">
                        <div className="flex justify-between text-sm font-bold tracking-widest uppercase text-gray-500">
                            <span>SUBTOTAL</span>
                            <span className="text-black font-semibold">₹{invoice.subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold tracking-widest uppercase text-gray-500">
                            <span>Tax ({invoice.tax_rate}%)</span>
                            <span className="text-black font-semibold">₹{invoice.tax_amount}</span>
                        </div>
                        <div className="border-t border-black pt-3 flex justify-between text-lg font-bold">
                            <span>TOTAL</span>
                            <span>₹{invoice.total}</span>
                        </div>
                    </div>
                </div>

                {/* Footer / Signature */}
                <div className="flex justify-end">
                    <div className="text-center">
                        <img src="/admin-signature.jpg" alt="Signature" className="h-16 mb-2 grayscale contrast-125 mix-blend-multiply" />
                        <div className="border-t border-gray-300 w-48 pt-2 text-xs uppercase tracking-widest text-gray-500">Authorized Signature</div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InvoiceView;
