import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CrosshairCard } from "@/components/ui/crosshair-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Search, ShoppingCart, Filter, Heart, SlidersHorizontal, X } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useCart } from "@/context/CartContext";

interface Part {
    id: number;
    name: string;
    description: string;
    price: string;
    image_url: string;
    stock_quantity: number;
    category: { id: number; name: string };
}

const Shop = () => {
    const [parts, setParts] = useState<Part[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [priceRange, setPriceRange] = useState([0, 45000]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [favorites, setFavorites] = useState<Set<number>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9;

    const navigate = useNavigate();
    const { addToCart } = useCart();

    useEffect(() => {
        fetchParts();
        fetchCategories();
    }, []);

    const fetchParts = async () => {
        try {
            const response = await api.get("/customer/parts");
            setParts(response.data);
        } catch (error) {
            console.error("Error fetching parts", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get("/categories");
            const fetchedCategories = response.data;

            // Filter to only active categories with products
            const activeCategories = fetchedCategories.filter(
                (cat: any) => cat.isActive !== false && (cat.partCount || 0) > 0
            );

            console.log(`📦 Loaded ${activeCategories.length} active categories (${fetchedCategories.length} total)`);
            setCategories(activeCategories);
        } catch (error) {
            console.error("Error fetching categories", error);
            setCategories([]);
        }
    };

    const handleAddToCart = (part: Part) => {
        addToCart(part);
        toast.success("Added to cart");
    };

    useEffect(() => {
        // Load wishlist from localStorage
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            setFavorites(new Set(JSON.parse(savedWishlist)));
        }
    }, []);

    const toggleFavorite = (id: number) => {
        const newFavs = new Set(favorites);
        if (newFavs.has(id)) newFavs.delete(id);
        else newFavs.add(id);
        setFavorites(newFavs);

        // Save to localStorage
        localStorage.setItem('wishlist', JSON.stringify(Array.from(newFavs)));
    };

    const toggleCategory = (categoryName: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryName)
                ? prev.filter(c => c !== categoryName)
                : [...prev, categoryName]
        );
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setPriceRange([0, 5000]);
        setSearchQuery("");
    };

    // Filter Logic
    const filteredParts = parts.filter(part => {
        const matchesSearch = part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            part.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const price = Number(part.price);
        const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

        // Ensure we check against the category object properly (API returns relations)
        const partCategoryName = part.category?.name;

        // Debug if needed: console.log(`Checking Part: ${part.name}, Cat: ${partCategoryName}`);

        const matchesCategory = selectedCategories.length === 0 ||
            (partCategoryName && selectedCategories.includes(partCategoryName));

        return matchesSearch && matchesPrice && matchesCategory;
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredParts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = filteredParts.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, priceRange, selectedCategories]);

    const tags = ["Forged", "Carbon", "Matte", "Chrome", "OEM", "Aftermarket"];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-electric-blue selection:text-white">
            <Navigation />

            <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* SIDEBAR FILTERS */}
                    <div className="lg:col-span-3 space-y-8 bg-white border border-gray-200 p-6 rounded-2xl sticky top-24 shadow-sm max-h-[calc(100vh-7rem)] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-900">
                                <SlidersHorizontal className="w-5 h-5" />
                                <span className="font-bold text-lg tracking-wide">Filters</span>
                            </div>
                            {(selectedCategories.length > 0 || searchQuery) && (
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                                >
                                    <X className="w-4 h-4" />
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* Search */}
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-electric-blue transition-colors" />
                            <Input
                                placeholder="Search parts..."
                                className="pl-11 bg-gray-100 border-gray-300 text-gray-900 rounded-xl h-12 text-sm focus:ring-1 focus:ring-electric-blue/50 placeholder:text-gray-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Categories */}
                        <div>
                            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Categories</h3>
                            <ul className="space-y-0.5">
                                {categories
                                    .filter(cat => cat.isActive !== false && (cat.partCount || 0) > 0) // Only show active categories with products
                                    .map((cat) => (
                                        <li
                                            key={cat.name}
                                            onClick={() => toggleCategory(cat.name)}
                                            className={`minimal-category-item flex items-center justify-between cursor-pointer px-3 py-2 rounded-md transition-all ${selectedCategories.includes(cat.name) ? 'active' : ''}`}
                                        >
                                            <span className="text-sm">
                                                {cat.name}
                                            </span>
                                            <span className="text-xs text-gray-400 font-medium">
                                                {cat.partCount || 0}
                                            </span>
                                        </li>
                                    ))}
                            </ul>
                            {categories.filter(cat => cat.isActive !== false && (cat.partCount || 0) > 0).length === 0 && (
                                <p className="text-sm text-gray-400 italic">No categories available</p>
                            )}
                        </div>


                        {/* Price Range */}
                        <div>
                            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4">Price</h3>

                            {/* Histogram */}
                            <div className="mb-6 px-2">
                                <div className="flex items-end justify-between h-24 gap-1">
                                    {(() => {
                                        // Create 24 price buckets for better resolution
                                        const buckets = Array(24).fill(0);
                                        const maxPrice = 45000;
                                        const bucketSize = maxPrice / 24;

                                        // Count parts in each bucket
                                        parts.forEach(part => {
                                            const price = Number(part.price);
                                            const bucketIndex = Math.min(Math.floor(price / bucketSize), 23);
                                            buckets[bucketIndex]++;
                                        });

                                        const maxCount = Math.max(...buckets, 1);

                                        return buckets.map((count, i) => {
                                            const height = (count / maxCount) * 100;
                                            const isInRange = (i * bucketSize) >= priceRange[0] && (i * bucketSize) <= priceRange[1];

                                            // Calculate gradient opacity based on height
                                            const opacity = Math.max(0.3, Math.min(1, height / 50));

                                            return (
                                                <div
                                                    key={i}
                                                    className={`flex-1 rounded-t-sm transition-all duration-300 relative group ${isInRange ? 'bg-electric-blue' : 'bg-gray-100'}`}
                                                    style={{
                                                        height: `${Math.max(height, 5)}%`,
                                                        background: isInRange
                                                            ? `linear-gradient(to top, rgba(59, 130, 246, ${opacity}), rgba(59, 130, 246, 1))`
                                                            : undefined
                                                    }}
                                                >
                                                    {/* Tooltip on hover */}
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                                        {count} items
                                                        <br />
                                                        ₹{Math.floor(i * bucketSize / 1000)}k
                                                    </div>
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                            </div>

                            {/* Slider */}
                            <div className="px-2 mb-4">
                                <Slider
                                    defaultValue={[0, 4000]}
                                    max={45000}
                                    step={100}
                                    value={priceRange}
                                    onValueChange={setPriceRange}
                                />
                            </div>

                            {/* Price Display */}
                            <div className="flex items-center justify-center gap-3">
                                <div className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 min-w-[90px] text-center">
                                    ₹ {priceRange[0]}
                                </div>
                                <span className="text-gray-400 font-medium">-</span>
                                <div className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 min-w-[90px] text-center">
                                    ₹ {priceRange[1]}
                                </div>
                            </div>
                        </div>

                    </div>


                    {/* MAIN GRID */}
                    <div className="lg:col-span-9">

                        {/* Title & Info */}
                        <div className="mb-10">
                            <h1 className="text-5xl font-bold text-gray-900 mb-3">
                                Premium Auto Parts
                            </h1>
                            <p className="text-gray-600 text-lg">Discover high-performance components for your vehicle</p>
                            <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                                <span>{filteredParts.length} Products</span>
                                {selectedCategories.length > 0 && (
                                    <span>• Filtered by {selectedCategories.length} categor{selectedCategories.length === 1 ? 'y' : 'ies'}</span>
                                )}
                            </div>
                        </div>

                        {/* Products */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="h-[420px] bg-[#1e1e1e] rounded-2xl animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {currentProducts.map((part) => (
                                    <CrosshairCard
                                        key={part.id}
                                        className="h-full flex flex-col items-center text-center p-8 bg-white border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                                        onClick={() => navigate(`/part/${part.id}`)}
                                    >

                                        {/* Heart Icon */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(part.id);
                                            }}
                                            className={`absolute top-4 right-4 z-20 heart-wishlist ${favorites.has(part.id) ? 'active' : 'text-gray-300 hover:text-gray-900'}`}
                                        >
                                            <Heart className={`w-5 h-5 ${favorites.has(part.id) ? 'fill-current' : ''}`} />
                                        </button>

                                        {/* Image Container */}
                                        <div className="w-full aspect-square mb-6 flex items-center justify-center">
                                            <div className="relative aspect-square">
                                                <ImageWithFallback
                                                    src={part.image_url}
                                                    alt={part.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2"></div>
                                            </div>
                                            {/* The original fallback for Filter is removed as per the instruction's snippet. */}
                                        </div>

                                        {/* Info */}
                                        <div className="mt-auto w-full space-y-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                    {part.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 line-clamp-2 px-2">
                                                    {part.description || "Premium Component"}
                                                </p>
                                            </div>

                                            <div className="pt-2">
                                                <div className="text-lg font-bold text-gray-900 mb-3">
                                                    ₹{Number(part.price).toLocaleString()}
                                                </div>
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddToCart(part);
                                                    }}
                                                    className="w-full bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300 rounded-full font-medium transition-all shadow-sm"
                                                >
                                                    Add to Cart
                                                </Button>
                                            </div>
                                        </div>

                                    </CrosshairCard>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && filteredParts.length > 0 && totalPages > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-2">
                                <Button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    variant="outline"
                                    className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </Button>

                                <div className="flex items-center gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <Button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            variant={currentPage === page ? "default" : "outline"}
                                            className={`w-10 h-10 p-0 ${currentPage === page
                                                ? 'bg-electric-blue text-white hover:bg-electric-blue/90'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                </div>

                                <Button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    variant="outline"
                                    className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </Button>
                            </div>
                        )}

                        {!loading && filteredParts.length === 0 && (
                            <div className="py-20 text-center">
                                <Filter className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400 text-lg">No products match your filters</p>
                                <Button
                                    onClick={clearFilters}
                                    variant="outline"
                                    className="mt-4 border-gray-700 text-white hover:bg-[#2a2a2a]"
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Shop;
