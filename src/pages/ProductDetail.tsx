
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, ArrowLeft, Truck, ShieldCheck, Share2 } from "lucide-react";
import api from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface Part {
    id: number;
    name: string;
    description: string;
    price: string;
    image_url: string;
    stock_quantity: number;
    category: { id: number; name: string };
    seller: { id: number; name: string };
}

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [part, setPart] = useState<Part | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchPart = async () => {
            try {
                const response = await api.get(`/customer/parts/${id}`);
                setPart(response.data);

                // Check wishlist
                const savedWishlist = localStorage.getItem('wishlist');
                if (savedWishlist) {
                    const favorites = new Set(JSON.parse(savedWishlist));
                    if (favorites.has(Number(id))) setIsFavorite(true);
                }
            } catch (error) {
                console.error("Error fetching part details", error);
                toast.error("Could not load product details");
                navigate("/shop");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPart();
    }, [id, navigate]);

    const handleAddToCart = () => {
        if (part) {
            addToCart(part);
            toast.success("Added to cart");
        }
    };

    const toggleFavorite = () => {
        if (!part) return;

        const savedWishlist = localStorage.getItem('wishlist');
        const favorites = new Set(savedWishlist ? JSON.parse(savedWishlist) : []);

        if (isFavorite) {
            favorites.delete(part.id);
            setIsFavorite(false);
            toast.info("Removed from wishlist");
        } else {
            favorites.add(part.id);
            setIsFavorite(true);
            toast.success("Added to wishlist");
        }

        localStorage.setItem('wishlist', JSON.stringify(Array.from(favorites)));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-electric-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!part) return null;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-electric-blue selection:text-white">
            <Navigation />

            <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Breadcrumb / Back */}
                <button
                    onClick={() => navigate("/shop")}
                    className="flex items-center text-gray-500 hover:text-electric-blue transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Shop
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Left: Image */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-100 via-white to-white opacity-50" />

                        {part.image_url ? (
                            <img
                                src={part.image_url}
                                alt={part.name}
                                className="w-full h-auto object-contain max-h-[500px] z-10 mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-96 bg-gray-100 rounded-xl flex items-center justify-center text-gray-300">
                                No Image
                            </div>
                        )}

                        <button
                            onClick={toggleFavorite}
                            className="absolute top-6 right-6 z-20 p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all text-gray-400 hover:text-red-500 border border-gray-100"
                        >
                            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                    </div>

                    {/* Right: Details */}
                    <div className="flex flex-col justify-center space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Badge variant="secondary" className="bg-electric-blue/10 text-electric-blue hover:bg-electric-blue/20">
                                    {part.category?.name || "Part"}
                                </Badge>
                                {part.stock_quantity < 5 && part.stock_quantity > 0 && (
                                    <span className="text-amber-500 text-sm font-medium animate-pulse">
                                        Only {part.stock_quantity} left!
                                    </span>
                                )}
                            </div>

                            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tighter leading-tight">
                                {part.name}
                            </h1>

                            <p className="text-lg text-gray-500 leading-relaxed">
                                {part.description || "Premium quality vehicle component designed for performance and durability. Tested for rigorous standards."}
                            </p>
                        </div>

                        <div className="border-t border-b border-gray-100 py-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Price</p>
                                    <div className="text-4xl font-bold text-gray-900 mt-1">
                                        ₹{Number(part.price).toLocaleString()}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Stock Status</p>
                                    <div className={`text-lg font-medium mt-1 flex items-center justify-end gap-2 ${part.stock_quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {part.stock_quantity > 0 ? (
                                            <>In Stock <ShieldCheck className="w-4 h-4" /></>
                                        ) : 'Out of Stock'}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    onClick={handleAddToCart}
                                    disabled={part.stock_quantity <= 0}
                                    className="h-14 text-lg bg-gray-900 hover:bg-black text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                                >
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    Add to Cart
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-14 text-lg border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
                                >
                                    Share <Share2 className="w-5 h-5 ml-2" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                    <Truck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Fast Delivery</h4>
                                    <p className="text-sm text-gray-500">2-4 business days</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Warranty</h4>
                                    <p className="text-sm text-gray-500">1 year manufacturer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProductDetail;
