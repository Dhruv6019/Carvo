import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Shield, Eye, Lock, FileText } from "lucide-react";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            {/* Hero Section */}
            <div className="pt-32 pb-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-background border-b border-border/50">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center justify-center p-3 mb-6 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-black text-foreground mb-4">
                        Privacy <span className="text-electric-blue">Policy</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        How we protect and manage your data at Carvo.
                    </p>
                    <div className="mt-8 text-sm font-mono text-muted-foreground uppercase tracking-widest">
                        Last Updated: January 30, 2025
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-6 py-20">
                <AnimatedSection animation="fadeInUp" className="space-y-16">

                    {/* Section 1 */}
                    <section className="space-y-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-electric-blue/10 flex items-center justify-center text-electric-blue">
                                <Eye className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-display font-bold text-foreground">What Information We Collect</h2>
                        </div>
                        <div className="prose prose-blue dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                            <p>
                                At Carvo, we collect information to provide better services to all our users. This includes:
                            </p>
                            <ul className="list-disc pl-6 space-y-3">
                                <li><strong>Identity Data:</strong> Name, username, or similar identifier.</li>
                                <li><strong>Contact Data:</strong> Email address, phone number, and delivery address.</li>
                                <li><strong>Technical Data:</strong> IP address, browser type, and operating system used to access our platform.</li>
                                <li><strong>Usage Data:</strong> Information about how you use our website, products, and services.</li>
                                <li><strong>Marketing and Communications Data:</strong> Your preferences in receiving marketing from us.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="space-y-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-electric-blue/10 flex items-center justify-center text-electric-blue">
                                <Lock className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-display font-bold text-foreground">How We Use Your Data</h2>
                        </div>
                        <div className="prose prose-blue dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                            <p>
                                Your data helps us improve your Carvo experience. We use it to:
                            </p>
                            <ul className="list-disc pl-6 space-y-3">
                                <li>Process your orders and manage your account.</li>
                                <li>Notify you about updates to your order status or service requests.</li>
                                <li>Provide real-time 3D previews and configuration saves.</li>
                                <li>Improve our website's performance and security features.</li>
                                <li>Communicate regarding promotions or new modification services (with your consent).</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="space-y-6 p-8 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-border/50">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-electric-blue/10 flex items-center justify-center text-electric-blue">
                                <FileText className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-display font-bold text-foreground">Data Security</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            We implement robust security measures including SSL encryption and secure database protocols to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-display font-bold text-foreground">Your Rights</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            You have the right to access, update, or delete the personal information we have on you. Whenever made possible, you can update your personal information directly within your account settings section. If you are unable to change your information, please contact us to assist you.
                        </p>
                    </section>

                    {/* Contact Info */}
                    <div className="pt-8 border-t border-border/50 text-center">
                        <p className="text-muted-foreground">
                            Questions about our Privacy Policy?
                            <a href="/contact" className="ml-2 text-electric-blue font-bold hover:underline">Contact Support</a>
                        </p>
                    </div>

                </AnimatedSection>
            </div>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
