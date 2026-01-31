import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Cookie, Settings, ShieldCheck, BarChart3, Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

const CookiesSettings = () => {
    const [preferences, setPreferences] = useState({
        essential: true,
        analytical: true,
        marketing: false,
        functional: true
    });

    const handleSave = () => {
        toast.success("Cookie preferences saved successfully!");
    };

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            {/* Hero Section */}
            <div className="pt-32 pb-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-background border-b border-border/50">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center justify-center p-3 mb-6 bg-purple-100 dark:bg-purple-900/30 rounded-2xl text-purple-600 dark:text-purple-400">
                        <Cookie className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-black text-foreground mb-4">
                        Cookies <span className="text-purple-500">Settings</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Manage your privacy preferences and how we use cookies.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-6 py-20">
                <AnimatedSection animation="fadeInUp" className="space-y-12">

                    <div className="prose prose-purple dark:prose-invert max-w-none text-muted-foreground">
                        <p className="text-lg">
                            Cookies are small text files that are used to store small pieces of information. They are stored on your device when the website is loaded on your browser. These cookies help us make the website function properly, make it more secure, provide better user experience, and understand how the website performs.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Essential Cookies */}
                        <div className="flex items-start justify-between p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-border/50 transition-all hover:border-purple-500/30">
                            <div className="flex space-x-4">
                                <div className="mt-1 w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-foreground">Essential Cookies</h3>
                                    <p className="text-muted-foreground text-sm">Required for the website to function. Cannot be disabled.</p>
                                </div>
                            </div>
                            <Switch checked={true} disabled />
                        </div>

                        {/* Functional Cookies */}
                        <div className="flex items-start justify-between p-6 bg-white dark:bg-background rounded-2xl border border-border/50 transition-all hover:border-purple-500/30">
                            <div className="flex space-x-4">
                                <div className="mt-1 w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <Settings className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-foreground">Functional Cookies</h3>
                                    <p className="text-muted-foreground text-sm">Remember your preferences like 3D model settings and language.</p>
                                </div>
                            </div>
                            <Switch
                                checked={preferences.functional}
                                onCheckedChange={(val) => setPreferences({ ...preferences, functional: val })}
                            />
                        </div>

                        {/* Analytical Cookies */}
                        <div className="flex items-start justify-between p-6 bg-white dark:bg-background rounded-2xl border border-border/50 transition-all hover:border-purple-500/30">
                            <div className="flex space-x-4">
                                <div className="mt-1 w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                    <BarChart3 className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-foreground">Analytical Cookies</h3>
                                    <p className="text-muted-foreground text-sm">Help us understand how visitors interact with the website.</p>
                                </div>
                            </div>
                            <Switch
                                checked={preferences.analytical}
                                onCheckedChange={(val) => setPreferences({ ...preferences, analytical: val })}
                            />
                        </div>

                        {/* Marketing Cookies */}
                        <div className="flex items-start justify-between p-6 bg-white dark:bg-background rounded-2xl border border-border/50 transition-all hover:border-purple-500/30">
                            <div className="flex space-x-4">
                                <div className="mt-1 w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-foreground">Marketing Cookies</h3>
                                    <p className="text-muted-foreground text-sm">Used to track visitors across websites to display relevant ads.</p>
                                </div>
                            </div>
                            <Switch
                                checked={preferences.marketing}
                                onCheckedChange={(val) => setPreferences({ ...preferences, marketing: val })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-center pt-8">
                        <Button
                            size="lg"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-12 rounded-full font-bold shadow-lg shadow-purple-500/20"
                            onClick={handleSave}
                        >
                            Save Preferences
                        </Button>
                    </div>

                </AnimatedSection>
            </div>

            <Footer />
        </div>
    );
};

export default CookiesSettings;
