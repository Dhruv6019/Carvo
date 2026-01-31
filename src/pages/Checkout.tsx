import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Smartphone, Truck, Banknote, ShieldCheck, MapPin, Sparkles, Tag, CheckCircle2 } from "lucide-react";
import { UpiPaymentDialog } from "@/components/UpiPaymentDialog";

interface CheckoutState {
    items: {
        part: {
            id: number;
            name: string;
            price: string;
            image_url?: string;
        };
        quantity: number;
    }[];
    appliedCoupon?: any;
}

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { items: cartItems, cartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [shippingAddress, setShippingAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("upi");
    const [showUpiDialog, setShowUpiDialog] = useState(false);
    const [upiDetails, setUpiDetails] = useState<any>(null);

    // Get items and coupon passed from Cart
    const stateItems = (location.state as CheckoutState)?.items;
    const appliedCoupon = (location.state as CheckoutState)?.appliedCoupon;

    const checkoutItems = stateItems || cartItems;

    useEffect(() => {
        if (!checkoutItems || checkoutItems.length === 0) {
            navigate("/shop");
            return;
        }
        if (user && (user as any).address) {
            setShippingAddress((user as any).address);
        }
    }, [user, checkoutItems, navigate]);

    if (!checkoutItems || checkoutItems.length === 0) return null;

    const subtotal = stateItems
        ? checkoutItems.reduce((acc, item) => acc + Number(item.part.price) * item.quantity, 0)
        : cartTotal;

    const discount = appliedCoupon ? appliedCoupon.discount_amount : 0;
    const totalAmount = subtotal - discount;

    const handlePlaceOrder = async () => {
        if (!shippingAddress) {
            toast.error("Please enter a shipping address");
            return;
        }

        if (paymentMethod === "upi") {
            setLoading(true);
            try {
                const configRes = await api.get("/payments/upi-config");
                const { upiId, merchantName } = configRes.data;

                const params = new URLSearchParams({
                    pa: upiId,
                    pn: merchantName,
                    am: totalAmount.toString(),
                    cu: "INR",
                    tn: `Carvo Order - ₹${totalAmount}`
                });
                const upiString = `upi://pay?${params.toString()}`;

                setUpiDetails({
                    upiId,
                    merchantName,
                    amount: totalAmount,
                    orderId: 0,
                    upiString
                });
                setShowUpiDialog(true);
            } catch (error) {
                console.error("Error generating UPI details:", error);
                toast.error("Failed to generate UPI payment details");
            } finally {
                setLoading(false);
            }
        } else if (paymentMethod === "cod") {
            setLoading(true);
            try {
                const orderRes = await api.post("/orders", {
                    items: checkoutItems.map(item => ({
                        partId: item.part.id,
                        quantity: item.quantity
                    })),
                    shipping_address: shippingAddress,
                    coupon_code: appliedCoupon?.code,
                    discount_amount: discount,
                    final_amount: totalAmount
                });

                const orderId = orderRes.data.id;

                await api.post("/payments/create", {
                    orderId: orderId,
                    amount: totalAmount,
                    method: "cod"
                });

                toast.success("Order placed successfully! Pay on delivery.");

                if (!stateItems) {
                    clearCart();
                }

                navigate("/dashboard");
            } catch (error: any) {
                console.error("Checkout error:", error);
                const message = error.response?.data?.message || "Failed to place order. Please try again.";
                toast.error(message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handlePaymentConfirmed = async (transactionRef: string, upiTxnId: string) => {
        try {
            const orderRes = await api.post("/orders", {
                items: checkoutItems.map(item => ({
                    partId: item.part.id,
                    quantity: item.quantity
                })),
                shipping_address: shippingAddress,
                coupon_code: appliedCoupon?.code,
                discount_amount: discount,
                final_amount: totalAmount
            });

            const orderId = orderRes.data.id;

            const paymentRes = await api.post("/payments/create", {
                orderId: orderId,
                amount: totalAmount,
                method: "upi"
            });

            await api.post("/payments/confirm", {
                paymentId: paymentRes.data.payment.id,
                transactionReference: transactionRef,
                upiTransactionId: upiTxnId
            });

            toast.success("Payment confirmed! Your order is being processed.");

            if (!stateItems) {
                clearCart();
            }

            setShowUpiDialog(false);
            navigate("/dashboard");
        } catch (error: any) {
            console.error("Payment confirmation error:", error);
            const message = error.response?.data?.message || "Failed to confirm payment. Please try again.";
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <Navigation />

            <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="mb-8 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-display font-black text-foreground mb-2">
                        Secure <span className="text-gradient">Checkout</span>
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        Your payment information is secure
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Address */}
                        <Card className="p-6 liquid-glass dark:liquid-glass-dark animate-slide-in-left">
                            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-electric-blue" />
                                Shipping Address
                            </h2>
                            <div className="space-y-2">
                                <Label htmlFor="address">Full Address</Label>
                                <Input
                                    id="address"
                                    placeholder="Enter your complete shipping address"
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-electric-blue transition-all"
                                />
                            </div>
                        </Card>

                        {/* Payment Method */}
                        <Card className="p-6 liquid-glass dark:liquid-glass-dark animate-slide-in-left animate-delay-100">
                            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                                <Banknote className="w-5 h-5 text-electric-blue" />
                                Payment Method
                            </h2>
                            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                                {/* UPI Payment */}
                                <div className={`flex items-center space-x-3 border-2 p-5 rounded-xl cursor-pointer transition-all duration-300 ${paymentMethod === "upi"
                                    ? "border-electric-blue bg-blue-50 dark:bg-blue-900/20 shadow-lg"
                                    : "border-gray-200 dark:border-gray-700 hover:border-electric-blue/50 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    }`}>
                                    <RadioGroupItem value="upi" id="upi" />
                                    <Label htmlFor="upi" className="flex-1 flex items-center cursor-pointer">
                                        <Smartphone className="w-6 h-6 mr-3 text-electric-blue" />
                                        <div>
                                            <p className="font-bold text-lg">UPI Payment</p>
                                            <p className="text-sm text-muted-foreground">Pay via Google Pay, PhonePe, Paytm, etc.</p>
                                        </div>
                                    </Label>
                                    {paymentMethod === "upi" && <CheckCircle2 className="w-6 h-6 text-electric-blue" />}
                                </div>

                                {/* Cash on Delivery */}
                                <div className={`flex items-center space-x-3 border-2 p-5 rounded-xl cursor-pointer transition-all duration-300 ${paymentMethod === "cod"
                                    ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg"
                                    : "border-gray-200 dark:border-gray-700 hover:border-green-500/50 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    }`}>
                                    <RadioGroupItem value="cod" id="cod" />
                                    <Label htmlFor="cod" className="flex-1 flex items-center cursor-pointer">
                                        <Truck className="w-6 h-6 mr-3 text-green-500" />
                                        <div>
                                            <p className="font-bold text-lg">Cash on Delivery</p>
                                            <p className="text-sm text-muted-foreground">Pay when you receive</p>
                                        </div>
                                    </Label>
                                    {paymentMethod === "cod" && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                                </div>
                            </RadioGroup>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        {/* Applied Coupon */}
                        {appliedCoupon && (
                            <Card className="p-6 liquid-glass dark:liquid-glass-dark animate-slide-in-right border-2 border-green-500/30">
                                <div className="flex items-center gap-2 mb-2">
                                    <Tag className="w-5 h-5 text-green-500" />
                                    <h3 className="text-lg font-bold text-green-600 dark:text-green-400">Coupon Applied!</h3>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                                    <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        {appliedCoupon.code}
                                    </p>
                                    <p className="text-sm text-green-600 dark:text-green-500">
                                        You're saving ₹{discount.toFixed(2)}!
                                    </p>
                                </div>
                            </Card>
                        )}

                        {/* Summary Card */}
                        <Card className="p-6 liquid-glass dark:liquid-glass-dark animate-slide-in-right animate-delay-100 sticky top-24">
                            <h3 className="text-xl font-bold text-foreground mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-6">
                                {checkoutItems.map((item) => (
                                    <div key={item.part.id} className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {item.part.name} x {item.quantity}
                                        </span>
                                        <span className="font-semibold">₹{(Number(item.part.price) * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-600 dark:text-green-400 font-medium">Discount</span>
                                        <span className="font-bold text-green-600 dark:text-green-400">-₹{discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="font-semibold text-green-600">Free</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-2xl font-bold mb-6 pt-4 border-t-2 border-gray-300 dark:border-gray-600">
                                <span>Total</span>
                                <span className="text-gradient">₹{totalAmount.toLocaleString()}</span>
                            </div>

                            <Button
                                className="w-full btn-liquid btn-shimmer text-white py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                                onClick={handlePlaceOrder}
                                disabled={loading}
                            >
                                {loading ? (
                                    "Processing..."
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Place Order
                                    </>
                                )}
                            </Button>

                            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                Secure Checkout
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* UPI Payment Dialog */}
            {showUpiDialog && upiDetails && (
                <UpiPaymentDialog
                    open={showUpiDialog}
                    onClose={() => setShowUpiDialog(false)}
                    upiDetails={upiDetails}
                    onPaymentConfirmed={handlePaymentConfirmed}
                />
            )}
        </div>
    );
};

export default Checkout;
