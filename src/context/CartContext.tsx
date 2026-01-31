import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

export interface CartItem {
    partId: number;
    quantity: number;
    part: {
        id: number;
        name: string;
        price: string;
        image_url: string;
        stock_quantity: number;
    };
}

interface CartContextType {
    items: CartItem[];
    addToCart: (part: any) => void;
    removeFromCart: (partId: number) => void;
    updateQuantity: (partId: number, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);

    // Get current user's cart key
    const cartKey = user ? `cart_${user.id}` : "cart_guest";

    // Load from local storage on mount or when user changes
    useEffect(() => {
        const storedCart = localStorage.getItem(cartKey);
        if (storedCart) {
            setItems(JSON.parse(storedCart));
        } else {
            setItems([]);
        }
    }, [cartKey]);

    // Save to local storage whenever items change
    useEffect(() => {
        if (items.length > 0 || localStorage.getItem(cartKey)) {
            localStorage.setItem(cartKey, JSON.stringify(items));
        }
    }, [items, cartKey]);

    const addToCart = (part: any) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.partId === part.id);
            if (existingItem) {
                if (existingItem.quantity >= part.stock_quantity) {
                    toast.error("Cannot add more of this item (Out of Stock limit reached)");
                    return prevItems;
                }
                toast.success("Updated quantity in cart");
                return prevItems.map((item) =>
                    item.partId === part.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                toast.success("Added to cart");
                return [...prevItems, { partId: part.id, quantity: 1, part }];
            }
        });
    };

    const removeFromCart = (partId: number) => {
        setItems((prevItems) => prevItems.filter((item) => item.partId !== partId));
        toast.success("Removed from cart");
    };

    const updateQuantity = (partId: number, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(partId);
            return;
        }

        setItems((prevItems) =>
            prevItems.map((item) => {
                if (item.partId === partId) {
                    // Check stock limit
                    if (quantity > item.part.stock_quantity) {
                        toast.error(`Only ${item.part.stock_quantity} available in stock`);
                        return item;
                    }
                    return { ...item, quantity };
                }
                return item;
            })
        );
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem(cartKey);
    };

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = items.reduce((acc, item) => acc + (Number(item.part.price) * item.quantity), 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
