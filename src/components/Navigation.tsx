import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart } from "lucide-react";
import { NotificationBell } from "@/components/NotificationBell";

export const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOverFooter, setIsOverFooter] = useState(false);
    const isHomePage = location.pathname === "/";
    // We only want the transparent/white look if we are on Home AND at the top, OR if we are over the dark footer section.
    const showTransparentNav = (isHomePage && !isScrolled) || isOverFooter;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            // Check overlap with dark footer
            const footerDark = document.getElementById('footer-dark-section');
            if (footerDark) {
                const rect = footerDark.getBoundingClientRect();
                // Overlap if top of footer is near top of viewport (nav height approx 80-100)
                // And bottom of footer is still on screen
                setIsOverFooter(rect.top <= 100 && rect.bottom >= 0);
            } else {
                setIsOverFooter(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        // Trigger once on mount to check initial position
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const allNavItems = [
        { name: "Home", path: "/", public: true },
        { name: "Customize", path: "/car-selection", roles: ['customer'] },
        { name: "Shop", path: "/shop", roles: ['customer'] },
        { name: "Services", path: "/services", roles: ['customer'] },
        { name: "Gallery", path: "/gallery", public: true },
        { name: "About", path: "/about", public: true },
        { name: "Contact", path: "/contact", public: true },
    ];

    const navItems = allNavItems.filter(item => {
        // Always show public items
        if (item.public) return true;

        // Only show customer-specific items if the user is logged in and is a customer
        if (user && user.role === 'customer' && item.roles?.includes('customer')) return true;

        return false;
    });

    // Dashboard link removed from center nav as per user request (access via Panel button)
    // if (user) { ... } block removed

    const isActive = (path: string) => location.pathname === path;

    const getDashboardLink = () => {
        if (!user) return "/login";
        switch (user.role) {
            case "admin": return "/admin";
            case "seller": return "/seller-dashboard";
            case "service_provider": return "/provider-dashboard";
            case "delivery_boy": return "/delivery-dashboard";
            case "support_agent": return "/support-dashboard";
            default: return "/dashboard"; // customer
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
        setIsOpen(false);
    };

    return (
        <nav className="fixed top-6 left-0 right-0 z-50 transition-all duration-300 pointer-events-none">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto flex justify-between items-center h-16 md:h-20">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-3 group relative z-10">
                    <div className="relative">
                        <img
                            src={logo}
                            alt="Carvo"
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-transparent group-hover:border-electric-blue transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-electric-blue/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <span className={`text-xl md:text-2xl font-display font-bold transition-colors duration-300 ${!showTransparentNav ? "text-foreground" : "text-white"} group-hover:text-electric-blue`}>

                    </span>
                </Link>

                {/* Center Nav Pill */}
                <div className={`hidden md:flex items-center water-effect backdrop-blur-md border rounded-full px-2 py-1 shadow-water absolute left-1/2 transform -translate-x-1/2 overflow-hidden transition-all duration-300 ${!showTransparentNav ? "bg-background/80 border-border/50" : "bg-white/5 border-white/20"}`}>
                    {/* Inner sheen */}
                    <div className={`absolute inset-0 bg-gradient-to-b to-transparent pointer-events-none transition-all duration-300 ${!showTransparentNav ? "from-foreground/5" : "from-white/10"}`}></div>
                    {navItems.map((item, index) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`relative text-sm font-medium transition-all duration-300 group px-5 py-2 rounded-full hover:bg-foreground/10 ${isActive(item.path)
                                ? "text-neon-blue shadow-neon-inner"
                                : (!showTransparentNav ? "text-muted-foreground hover:text-foreground" : "text-gray-300 hover:text-white")
                                }`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <span className="relative z-10">{item.name}</span>
                        </Link>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="hidden md:flex items-center space-x-4 relative z-10 ml-8">
                    {/* Only show Cart and Wishlist to customers or guests */}
                    {(!user || user.role === 'customer') && (
                        <>
                            <Link to="/cart">
                                <Button variant="ghost" size="icon" className={`relative hover:bg-foreground/10 transition-all duration-300 rounded-full w-10 h-10 ${!showTransparentNav ? "text-foreground" : "text-white"}`}>
                                    <ShoppingCart className="w-5 h-5" />
                                    {cartCount > 0 && (
                                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-electric-blue text-white">
                                            {cartCount}
                                        </Badge>
                                    )}
                                </Button>
                            </Link>
                            {/* Wishlist Icon */}
                            <Link to="/wishlist" className="relative">
                                <Button className="bg-pink-500/10 border border-pink-500/50 text-pink-400 hover:bg-pink-500/20 hover:shadow-neon transition-all duration-300 backdrop-blur-md rounded-full w-10 h-10 p-0">
                                    <Heart className="w-5 h-5" />
                                </Button>
                            </Link>
                        </>
                    )}
                    {user && <NotificationBell />}
                    {!user ? (
                        <>
                            <Link to="/login">
                                <Button variant="ghost" className={`transition-all duration-300 ${!showTransparentNav ? "hover:bg-foreground/10 text-muted-foreground hover:text-foreground" : "hover:bg-white/10 text-gray-300 hover:text-white"}`}>
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="bg-white text-black hover:bg-gray-200 transition-all duration-300 rounded-full px-6 font-semibold">
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to={getDashboardLink()}>
                                <Button className="bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 hover:shadow-neon transition-all duration-300 backdrop-blur-md rounded-full">
                                    <User className="w-4 h-4 mr-2" />
                                    Panel
                                </Button>
                            </Link>

                            <Button variant="ghost" size="icon" onClick={handleLogout} className={`hover:bg-destructive/10 hover:text-destructive transition-all duration-300 rounded-full ${!showTransparentNav ? "text-foreground" : "text-white"}`}>
                                <LogOut className="w-5 h-5" />
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <div className="flex flex-col space-y-4 mt-8">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`text-lg font-medium transition-colors hover:text-electric-blue ${isActive(item.path)
                                            ? "text-electric-blue"
                                            : "text-muted-foreground"
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                {(!user || user.role === 'customer') && (
                                    <Link
                                        to="/cart"
                                        onClick={() => setIsOpen(false)}
                                        className={`text-lg font-medium transition-colors hover:text-electric-blue ${isActive("/cart") ? "text-electric-blue" : "text-muted-foreground"}`}
                                    >
                                        Cart ({cartCount})
                                    </Link>
                                )}
                                <div className="pt-4 border-t border-border space-y-2">
                                    {!user ? (
                                        <Link to="/login" onClick={() => setIsOpen(false)}>
                                            <Button variant="ghost" className="w-full justify-start">
                                                Login
                                            </Button>
                                        </Link>
                                    ) : (
                                        <>
                                            <Link to={getDashboardLink()} onClick={() => setIsOpen(false)}>
                                                <Button className="w-full bg-gradient-to-r from-electric-blue to-electric-blue-dark mb-2">
                                                    {user.role === 'customer' ? 'Dashboard' : `${user.role} Panel`}
                                                </Button>
                                            </Link>
                                            <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                                                Logout
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
};
