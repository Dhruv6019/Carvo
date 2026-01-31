import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Trash2, Package } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";

interface Part {
    id: number;
    name: string;
    description: string;
    price: string;
    stock_quantity: number;
    image_url: string;
    category?: {
        id: number;
        name: string;
    };
}

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState<Part[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { addToCart } = useCart();

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = () => {
        // Get wishlist from localStorage
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            const wishlistIds = JSON.parse(savedWishlist);
            fetchWishlistItems(wishlistIds);
        } else {
            setLoading(false);
        }
    };

    const fetchWishlistItems = async (ids: number[]) => {
        try {
            const response = await api.get("/customer/parts");
            const allParts = response.data;
            const wishlistParts = allParts.filter((part: Part) => ids.includes(part.id));
            setWishlistItems(wishlistParts);
        } catch (error) {
            console.error("Error fetching wishlist items", error);
            toast.error("Failed to load wishlist");
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = (id: number) => {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            const wishlistIds = JSON.parse(savedWishlist);
            const updatedIds = wishlistIds.filter((itemId: number) => itemId !== id);
            localStorage.setItem('wishlist', JSON.stringify(updatedIds));
            setWishlistItems(prev => prev.filter(item => item.id !== id));
            toast.success("Removed from wishlist");
        }
    };

    const handleAddToCart = (part: Part) => {
        addToCart({
            id: part.id,
            name: part.name,
            price: Number(part.price),
            quantity: 1,
            image_url: part.image_url
        });
        toast.success(`${part.name} added to cart!`);
    };

    const clearWishlist = () => {
        localStorage.removeItem('wishlist');
        setWishlistItems([]);
        toast.success("Wishlist cleared");
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Navigation />

            <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                                <Heart className="w-10 h-10 text-red-500 fill-current" />
                                My Wishlist
                            </h1>
                            <p className="text-gray-600">
                                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                            </p>
                        </div>
                        {wishlistItems.length > 0 && (
                            <Button
                                onClick={clearWishlist}
                                variant="outline"
                                className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Clear All
                            </Button>
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-[400px] bg-gray-200 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && wishlistItems.length === 0 && (
                    <div className="py-20 text-center">
                        <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Your wishlist is empty</h2>
                        <p className="text-gray-600 mb-6">Start adding products you love!</p>
                        <Button
                            onClick={() => navigate('/shop')}
                            className="bg-electric-blue hover:bg-electric-blue/90 text-white"
                        >
                            <Package className="w-4 h-4 mr-2" />
                            Browse Shop
                        </Button>
                    </div>
                )}

                {/* Wishlist Grid */}
                {!loading && wishlistItems.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlistItems.map((item) => (
                            <div key={item.id} className="light-shop-card group p-5 relative">
                                {/* Remove Button */}
                                <button
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="absolute top-5 right-5 z-20 text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>

                                {/* Image */}
                                <div className="light-image-container aspect-square mb-5 flex items-center justify-center p-6">
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <Package className="w-20 h-20 text-gray-400" />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-electric-blue transition-colors">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {item.description || "Premium Component"}
                                    </p>
                                    {item.category && (
                                        <p className="text-xs text-gray-500">
                                            Category: {item.category.name}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between pt-3">
                                        <span className="light-price-tag">
                                            ${Number(item.price).toLocaleString()}
                                        </span>
                                        <Button
                                            onClick={() => handleAddToCart(item)}
                                            size="sm"
                                            className="bg-electric-blue hover:bg-electric-blue/90 text-white"
                                        >
                                            <ShoppingCart className="w-4 h-4 mr-1" />
                                            Add to Cart
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Wishlist;
