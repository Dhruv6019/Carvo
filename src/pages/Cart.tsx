import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, ShoppingBag, Tag, Sparkles, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import api from "@/lib/api";

const Cart = () => {
    const { items, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
    const navigate = useNavigate();
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [validatingCoupon, setValidatingCoupon] = useState(false);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error("Please enter a coupon code");
            return;
        }

        setValidatingCoupon(true);
        try {
            const response = await api.post("/coupons/validate", {
                code: couponCode,
                orderAmount: cartTotal
            });

            if (response.data.valid) {
                setAppliedCoupon(response.data.coupon);
                toast.success(response.data.message);
            }
        } catch (error: any) {
            const message = error.response?.data?.message || "Invalid coupon code";
            toast.error(message);
        } finally {
            setValidatingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
        toast.info("Coupon removed");
    };

    const handleCheckout = () => {
        navigate("/checkout", {
            state: {
                appliedCoupon: appliedCoupon
            }
        });
    };

    const finalAmount = appliedCoupon ? appliedCoupon.final_amount : cartTotal;
    const discount = appliedCoupon ? appliedCoupon.discount_amount : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <Navigation />

            <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="mb-8 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-display font-black text-foreground mb-2">
                        Your <span className="text-gradient">Shopping Cart</span>
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" />
                        {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-24 liquid-glass dark:liquid-glass-dark rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 animate-scale-in">
                        <ShoppingBag className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-6 animate-float" />
                        <h2 className="text-3xl font-bold text-foreground mb-3">Your cart is empty</h2>
                        <p className="text-muted-foreground mb-8 text-lg">Looks like you haven't added any parts yet.</p>
                        <Button
                            onClick={() => navigate("/shop")}
                            className="btn-liquid bg-electric-blue hover:bg-electric-blue-dark text-white px-8 py-6 text-lg"
                        >
                            <Sparkles className="w-5 h-5 mr-2" />
                            Start Shopping
                        </Button>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item, index) => (
                                <Card
                                    key={item.partId}
                                    className="p-6 flex flex-col sm:flex-row items-center gap-6 liquid-glass dark:liquid-glass-dark liquid-glass-hover animate-fade-in-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl flex items-center justify-center p-3 shadow-lg">
                                        {item.part.image_url ? (
                                            <img src={item.part.image_url} alt={item.part.name} className="w-full h-full object-contain" />
                                        ) : (
                                            <ShoppingBag className="w-10 h-10 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="font-bold text-lg text-foreground mb-1">{item.part.name}</h3>
                                        <p className="text-electric-blue font-bold text-xl">₹{Number(item.part.price).toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-10 w-10 rounded-lg hover:bg-electric-blue hover:text-white transition-all"
                                            onClick={() => updateQuantity(item.partId, item.quantity - 1)}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </Button>
                                        <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-10 w-10 rounded-lg hover:bg-electric-blue hover:text-white transition-all"
                                            onClick={() => updateQuantity(item.partId, item.quantity + 1)}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg h-10 w-10"
                                        onClick={() => removeFromCart(item.partId)}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </Card>
                            ))}
                            <Button
                                variant="outline"
                                className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 w-full sm:w-auto rounded-lg"
                                onClick={clearCart}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Clear Cart
                            </Button>
                        </div>

                        {/* Summary */}
                        <div className="space-y-4">
                            {/* Coupon Section */}
                            <Card className="p-6 liquid-glass dark:liquid-glass-dark animate-slide-in-right">
                                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                    <Tag className="w-5 h-5 text-electric-blue" />
                                    Apply Coupon
                                </h3>

                                {!appliedCoupon ? (
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Enter coupon code"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                className="flex-1 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                                                onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                            />
                                            <Button
                                                onClick={handleApplyCoupon}
                                                disabled={validatingCoupon}
                                                className="btn-liquid bg-electric-blue hover:bg-electric-blue-dark text-white"
                                            >
                                                {validatingCoupon ? "..." : "Apply"}
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Have a discount code? Enter it above!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4" />
                                                    {appliedCoupon.code}
                                                </p>
                                                <p className="text-sm text-green-600 dark:text-green-500">
                                                    You saved ₹{discount.toFixed(2)}!
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-green-700 hover:text-green-800 hover:bg-green-100 dark:hover:bg-green-900/40"
                                                onClick={handleRemoveCoupon}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Card>

                            {/* Order Summary */}
                            <Card className="p-6 liquid-glass dark:liquid-glass-dark animate-slide-in-right animate-delay-100">
                                <h3 className="text-lg font-bold text-foreground mb-4">Order Summary</h3>
                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-semibold text-foreground">₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-green-600 dark:text-green-400">Discount</span>
                                            <span className="font-semibold text-green-600 dark:text-green-400">-₹{discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span className="font-semibold text-foreground">Calculated at checkout</span>
                                    </div>
                                </div>
                                <Separator className="my-4" />
                                <div className="flex justify-between text-xl font-bold mb-6">
                                    <span>Total</span>
                                    <span className="text-gradient">₹{finalAmount.toLocaleString()}</span>
                                </div>
                                <Button
                                    className="w-full btn-liquid btn-shimmer text-white py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                                    onClick={handleCheckout}
                                >
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Proceed to Checkout
                                </Button>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
