import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, CheckCircle2, Smartphone } from "lucide-react";
import { toast } from "sonner";

interface UpiPaymentDialogProps {
    open: boolean;
    onClose: () => void;
    upiDetails: {
        upiId: string;
        merchantName: string;
        amount: number;
        orderId: number;
        upiString: string;
    };
    paymentId?: number; // Optional now since order is created after payment
    onPaymentConfirmed: (transactionRef: string, upiTxnId: string) => void;
}

export const UpiPaymentDialog = ({
    open,
    onClose,
    upiDetails,
    paymentId,
    onPaymentConfirmed
}: UpiPaymentDialogProps) => {
    const [transactionReference, setTransactionReference] = useState("");
    const [upiTransactionId, setUpiTransactionId] = useState("");
    const [confirming, setConfirming] = useState(false);

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard!`);
    };

    const handleConfirmPayment = async () => {
        if (!transactionReference.trim()) {
            toast.error("Please enter a transaction reference");
            return;
        }

        setConfirming(true);
        try {
            await onPaymentConfirmed(transactionReference, upiTransactionId);
        } finally {
            setConfirming(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Complete UPI Payment</DialogTitle>
                    <DialogDescription>
                        Scan the QR code or use the UPI ID to make payment
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-4 custom-scrollbar">
                    {/* QR Code */}
                    <div className="flex flex-col items-center space-y-3 bg-white p-6 rounded-lg border-2 border-electric-blue">
                        <QRCodeSVG
                            value={upiDetails.upiString}
                            size={200}
                            level="H"
                            includeMargin={true}
                        />
                        <div className="flex items-center text-sm text-gray-600">
                            <Smartphone className="w-4 h-4 mr-2" />
                            Scan with any UPI app
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="space-y-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Pay To:</span>
                            <span className="font-medium">{upiDetails.merchantName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Amount:</span>
                            <span className="font-bold text-lg text-electric-blue">₹{upiDetails.amount.toLocaleString()}</span>
                        </div>
                        {upiDetails.orderId > 0 && (
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Order ID:</span>
                                <span className="font-medium">#{upiDetails.orderId}</span>
                            </div>
                        )}
                    </div>

                    {/* UPI ID */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">UPI ID</Label>
                        <div className="flex gap-2">
                            <Input
                                value={upiDetails.upiId}
                                readOnly
                                className="flex-1 font-mono text-sm"
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => copyToClipboard(upiDetails.upiId, "UPI ID")}
                            >
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h4 className="font-semibold text-sm mb-2 flex items-center">
                            <CheckCircle2 className="w-4 h-4 mr-2 text-blue-600" />
                            Payment Instructions
                        </h4>
                        <ol className="text-xs space-y-1 text-gray-700 dark:text-gray-300 list-decimal list-inside">
                            <li>Scan QR code or copy UPI ID</li>
                            <li>Open your UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                            <li>Complete the payment of ₹{upiDetails.amount}</li>
                            <li>Enter the transaction reference below</li>
                        </ol>
                    </div>

                    {/* Transaction Reference Input */}
                    <div className="space-y-2">
                        <Label htmlFor="txnRef">Transaction Reference Number *</Label>
                        <Input
                            id="txnRef"
                            placeholder="e.g., 123456789012"
                            value={transactionReference}
                            onChange={(e) => setTransactionReference(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Enter the 12-digit reference number from your payment app
                        </p>
                    </div>

                    {/* Optional UPI Transaction ID */}
                    <div className="space-y-2">
                        <Label htmlFor="upiTxnId">UPI Transaction ID (Optional)</Label>
                        <Input
                            id="upiTxnId"
                            placeholder="e.g., 402993715896"
                            value={upiTransactionId}
                            onChange={(e) => setUpiTransactionId(e.target.value)}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={onClose}
                            disabled={confirming}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-electric-blue hover:bg-electric-blue-dark"
                            onClick={handleConfirmPayment}
                            disabled={confirming}
                        >
                            {confirming ? "Confirming..." : "I've Paid"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
