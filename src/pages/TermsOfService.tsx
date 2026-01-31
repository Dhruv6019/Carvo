import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { FileText, Scale, AlertCircle, CheckCircle2 } from "lucide-react";

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            {/* Hero Section */}
            <div className="pt-32 pb-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-background border-b border-border/50">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center justify-center p-3 mb-6 bg-orange-100 dark:bg-orange-900/30 rounded-2xl text-orange-600 dark:text-orange-400">
                        <Scale className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-black text-foreground mb-4">
                        Terms of <span className="text-burnt-orange">Service</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Guidelines and rules for using the Carvo platform.
                    </p>
                    <div className="mt-8 text-sm font-mono text-muted-foreground uppercase tracking-widest">
                        Effective Date: January 30, 2025
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-6 py-20">
                <AnimatedSection animation="fadeInUp" className="space-y-16">

                    {/* Section 1 */}
                    <section className="space-y-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-burnt-orange/10 flex items-center justify-center text-burnt-orange">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-display font-bold text-foreground">Acceptance of Terms</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            By accessing or using Carvo, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section className="space-y-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-burnt-orange/10 flex items-center justify-center text-burnt-orange">
                                <FileText className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-display font-bold text-foreground">User Accounts</h2>
                        </div>
                        <div className="prose prose-orange dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                            <p>
                                When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
                            </p>
                            <ul className="list-disc pl-6 space-y-3 font-medium">
                                <li>You are responsible for safeguarding your password.</li>
                                <li>You may not use as a username the name of another person or entity.</li>
                                <li>You agree not to disclose your password to any third party.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 3: Intellectual Property */}
                    <section className="space-y-6 p-8 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-border/50">
                        <h2 className="text-2xl font-display font-bold text-foreground">Intellectual Property</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of Carvo and its licensors. Our 3D car models, rendering engine designs, and unique customization workflows are protected by copyright and trademark laws.
                        </p>
                    </section>

                    {/* Section 4: Limitation of Liability */}
                    <section className="space-y-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-display font-bold text-foreground">Limitation of Liability</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            In no event shall Carvo, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                        </p>
                    </section>

                    {/* Section 5: Modifications */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-display font-bold text-foreground">Governing Law</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                        </p>
                    </section>

                    {/* Contact Info */}
                    <div className="pt-8 border-t border-border/50 text-center">
                        <p className="text-muted-foreground">
                            Need clarification on these terms?
                            <a href="/contact" className="ml-2 text-burnt-orange font-bold hover:underline">Support Center</a>
                        </p>
                    </div>

                </AnimatedSection>
            </div>

            <Footer />
        </div>
    );
};

export default TermsOfService;
