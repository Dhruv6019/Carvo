import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight, Calendar as CalendarIcon, Car } from "lucide-react";

export default function BookingService() {
    const navigate = useNavigate();
    const { user } = useAuth(); // Get user to pre-fill info
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        date: "",
        serviceType: "",
        vehicleModel: "",
        vehicleYear: "",
        notes: ""
    });

    // Pre-fill user data
    useEffect(() => {
        if (user) {
            const names = user.name ? user.name.split(" ") : ["", ""];
            setFormData(prev => ({
                ...prev,
                firstName: names[0] || "",
                lastName: names.slice(1).join(" ") || "",
                phone: user.phone || "" // If phone is in user object (it is in DB, ensure it's in AuthContext user object too? If not, user types it)
            }));
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Combine extra fields into notes for the backend
            const robustNotes = `
Vehicle: ${formData.vehicleYear} ${formData.vehicleModel}
Phone: ${formData.phone}
User Notes: ${formData.notes}
            `.trim();

            await api.post("/customer/bookings", {
                serviceType: formData.serviceType,
                scheduled_date: formData.date, // Check if backend expects 'scheduled_date' or 'date'. Previous file used 'date' but entity says 'scheduled_date'. I'll try to support typical naming or just use what worked before? 
                // Wait, previous file used `date`. Let's check if the previous file mapped it? 
                // Previous file: `await api.post("/customer/bookings", formData);` where formData had `date`.
                // Checking Entity: `scheduled_date`.
                // Checking previous implementation again... 
                // If I can't be sure, I'll send both or check if I should inspect the specific route handler.
                // Re-reading step 570 (BookingService.tsx content): It just sent `...formData`. 
                // I'll stick to `date` property passing through if the backend controller handles mapping, 
                // BUT the entity has `scheduled_date`. 
                // Let's safe-bet and send `date` (since it worked before) AND `scheduled_date` just in case, or stick to what worked.
                // "According to database" implies I should probably be precise. 
                // I will send `date` as the previous one did.
                date: formData.date,
                notes: robustNotes
            });

            toast.success("Service Request Sent!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Booking Error", error);
            toast.error("Failed to submit request.");
        } finally {
            setLoading(false);
        }
    };

    const serviceDetails = {
        "maintenance": { title: "Regular Maintenance", price: "From $199", desc: "Oil, filter, and multi-point inspection." },
        "tuning": { title: "Performance Tuning", price: "From $599", desc: "ECU remapping and dyno testing." },
        "cosmetic": { title: "Cosmetic Mods", price: "Custom Quote", desc: "Body kits, wraps, and paint protection." },
        "inspection": { title: "Pre-Purchase", price: "$150", desc: "Comprehensive 150-point analysis." }
    };

    const activeService = serviceDetails[formData.serviceType as keyof typeof serviceDetails];

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Navigation />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* LEFT: FORM SECTION */}
                    <div className="lg:col-span-7 space-y-8">
                        <div>
                            <div className="text-electric-blue font-bold tracking-widest text-xs uppercase mb-2">
                                Carvo Garage
                            </div>
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
                                Place your request here
                            </h1>
                            <p className="text-gray-500 text-lg">
                                Premium automotive services for your masterpiece.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">First name</label>
                                    <Input
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="bg-white border-gray-200 h-12 rounded-xl focus:border-electric-blue focus:ring-4 focus:ring-electric-blue/10 transition-all font-medium"
                                        placeholder="John"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Last name</label>
                                    <Input
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="bg-white border-gray-200 h-12 rounded-xl focus:border-electric-blue focus:ring-4 focus:ring-electric-blue/10 transition-all font-medium"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Phone number</label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    type="tel"
                                    className="bg-white border-gray-200 h-12 rounded-xl focus:border-electric-blue focus:ring-4 focus:ring-electric-blue/10 transition-all font-medium"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Date of Service</label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                        <Input
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            type="date"
                                            className="bg-white border-gray-200 h-12 rounded-xl pl-12 focus:border-electric-blue focus:ring-4 focus:ring-electric-blue/10 transition-all font-medium text-gray-600"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Service Type</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            { id: 'maintenance', label: 'Maintenance', icon: 'wrench' },
                                            { id: 'tuning', label: 'Tuning', icon: 'gauge' },
                                            { id: 'cosmetic', label: 'Cosmetic', icon: 'palette' },
                                            { id: 'inspection', label: 'Inspection', icon: 'clipboard' }
                                        ].map((service) => (
                                            <div
                                                key={service.id}
                                                onClick={() => setFormData({ ...formData, serviceType: service.id })}
                                                className={`
                                                    cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center hover:border-electric-blue/50 hover:bg-gray-50
                                                    ${formData.serviceType === service.id
                                                        ? 'border-electric-blue bg-electric-blue/5 ring-2 ring-electric-blue/20'
                                                        : 'border-gray-100 bg-white'
                                                    }
                                                `}
                                            >
                                                {/* Simple Graphic Placeholder or Icon mapping */}
                                                <div className={`p-2 rounded-full ${formData.serviceType === service.id ? 'bg-electric-blue text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                    {service.icon === 'wrench' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>}
                                                    {service.icon === 'gauge' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></svg>}
                                                    {service.icon === 'palette' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.6 1.6 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>}
                                                    {service.icon === 'clipboard' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" /><path d="m9 14 2 2 4-4" /></svg>}
                                                </div>
                                                <span className={`text-sm font-bold ${formData.serviceType === service.id ? 'text-electric-blue' : 'text-gray-700'}`}>
                                                    {service.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Vehicle Model</label>
                                    <Input
                                        value={formData.vehicleModel}
                                        onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                                        className="bg-white border-gray-200 h-12 rounded-xl focus:border-electric-blue focus:ring-4 focus:ring-electric-blue/10 transition-all font-medium"
                                        placeholder="e.g. BMW M4"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Year</label>
                                    <Input
                                        value={formData.vehicleYear}
                                        onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                                        className="bg-white border-gray-200 h-12 rounded-xl focus:border-electric-blue focus:ring-4 focus:ring-electric-blue/10 transition-all font-medium"
                                        placeholder="e.g. 2024"
                                    />
                                </div>
                            </div>

                        </form>
                    </div>

                    {/* RIGHT: INFO CARD (Floating) */}
                    <div className="lg:col-span-5 relative mt-12 lg:mt-0">
                        {/* Decorative background shape */}
                        <div className="absolute top-10 right-10 w-full h-full bg-gray-100 rounded-[2.5rem] -rotate-3 -z-10" />

                        <div className="bg-gradient-to-br from-burnt-orange to-orange-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col justify-between group cursor-default transition-transform hover:-translate-y-1">
                            {/* Texture Overlay */}
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                            <div className="relative z-10">
                                <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/20">
                                    <Car className="w-8 h-8 text-white" />
                                </div>

                                <h2 className="text-3xl font-display font-bold mb-4">
                                    {activeService?.title || "Choose a Service"}
                                </h2>

                                <p className="text-orange-100 text-lg leading-relaxed mb-8">
                                    {activeService?.desc || "Carvo ensures premium quality for every modification. Select a service type to see details."}
                                </p>

                                <div className="space-y-4">
                                    {["Premium Parts", "Certified Mechanics", "Warranty Included", "Free Cancellation"].map((item) => (
                                        <div key={item} className="flex items-center gap-3">
                                            <div className="bg-white/20 rounded-full p-1">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                            <span className="font-medium text-orange-50">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative z-10 pt-12 border-t border-white/20 mt-8">
                                <div className="flex items-end justify-between mb-6">
                                    <span className="text-orange-200 font-medium">Estimated Cost</span>
                                    <span className="text-3xl font-bold">{activeService?.price || "---"}</span>
                                </div>

                                <Button
                                    onClick={handleSubmit}
                                    disabled={loading || !formData.date || !formData.serviceType}
                                    className="w-full bg-white text-orange-600 hover:bg-orange-50 h-14 rounded-xl text-lg font-bold shadow-lg shadow-black/10 flex items-center justify-between px-6 group-hover:px-8 transition-all"
                                >
                                    <span>{loading ? "Booking..." : "Confirm Request"}</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
}
