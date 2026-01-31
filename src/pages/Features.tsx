import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Palette,
    Eye,
    Zap,
    Shield,
    Wrench,
    Camera,
    CheckCircle2,
    Users,
    Sparkles,
    ArrowRight,
    Play
} from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Link } from "react-router-dom";

const Features = () => {
    const mainFeatures = [
        {
            icon: Eye,
            title: "Live 3D Visualization",
            description: "See your modifications in real-time with our advanced 3D car viewer. Rotate, zoom, and explore every angle before you commit.",
            color: "from-cyan-500 to-blue-600",
            bgColor: "bg-cyan-50 dark:bg-cyan-950/20"
        },
        {
            icon: Palette,
            title: "Custom Paint & Wraps",
            description: "Choose from thousands of colors, finishes, and wrap designs. Preview them instantly on your exact car model.",
            color: "from-pink-500 to-rose-600",
            bgColor: "bg-pink-50 dark:bg-pink-950/20"
        },
        {
            icon: Zap,
            title: "Performance Upgrades",
            description: "Unlock your car's full potential with engine tuning, exhaust systems, and performance parts from trusted brands.",
            color: "from-yellow-500 to-orange-600",
            bgColor: "bg-yellow-50 dark:bg-yellow-950/20"
        },
        {
            icon: Wrench,
            title: "Wheel Customization",
            description: "Browse premium alloy wheels with perfect fitment guarantee. See how each design looks on your car instantly.",
            color: "from-purple-500 to-indigo-600",
            bgColor: "bg-purple-50 dark:bg-purple-950/20"
        },
        {
            icon: Sparkles,
            title: "Interior Styling",
            description: "Transform your cabin with luxury upholstery, custom trim, ambient lighting, and premium audio systems.",
            color: "from-emerald-500 to-teal-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/20"
        },
        {
            icon: Shield,
            title: "Quality Guarantee",
            description: "All modifications backed by warranty. We partner with certified installers and use genuine parts only.",
            color: "from-blue-500 to-violet-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/20"
        }
    ];

    const additionalFeatures = [
        { icon: CheckCircle2, text: "Professional installation network" },
        { icon: CheckCircle2, text: "Real-time price calculations" },
        { icon: CheckCircle2, text: "Save and share your designs" },
        { icon: CheckCircle2, text: "Expert consultation available" },
        { icon: CheckCircle2, text: "Financing options" },
        { icon: CheckCircle2, text: "Premium parts marketplace" }
    ];

    const stats = [
        { number: "15,000+", label: "Modifications Completed" },
        { number: "5,000+", label: "Happy Customers" },
        { number: "50+", label: "Partner Brands" },
        { number: "99%", label: "Satisfaction Rate" }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            {/* Hero Section */}
            <AnimatedSection className="pt-24 pb-16 bg-gradient-to-b from-muted to-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <Badge className="mb-6 text-base px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 border-0">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Industry-Leading Features
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                            Everything You Need to <span className="text-gradient bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">Transform</span> Your Ride
                        </h1>
                        <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
                            Carvo combines cutting-edge visualization technology with a comprehensive modification platform.
                            See, customize, and order everything in one place.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/car-selection">
                                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-lg px-8 hover:shadow-lg hover:scale-105 transition-all">
                                    <Play className="w-5 h-5 mr-2" />
                                    Try Live Preview
                                </Button>
                            </Link>
                            <Link to="/services">
                                <Button size="lg" variant="outline" className="text-lg px-8 hover:scale-105 transition-all">
                                    Explore Services
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* Main Features Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mainFeatures.map((feature, index) => (
                            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-cyan-400/50">
                                <CardContent className="p-8">
                                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                        <feature.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-4 group-hover:text-cyan-600 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <AnimatedSection className="py-16 bg-gradient-to-r from-cyan-50 via-blue-50 to-purple-50 dark:from-cyan-950/20 dark:via-blue-950/20 dark:to-purple-950/20" animation="slideInLeft">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-gradient bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
                                    {stat.number}
                                </div>
                                <p className="text-muted-foreground font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </AnimatedSection>

            {/* Additional Features */}
            <section className="py-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                            Even More Features
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Everything you need for a seamless modification experience
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {additionalFeatures.map((feature, index) => (
                            <div key={index} className="flex items-center gap-4 p-6 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                                <feature.icon className="w-6 h-6 text-cyan-600 flex-shrink-0" />
                                <p className="text-lg font-medium">{feature.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-primary/10 via-cyan-500/10 to-blue-600/10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8">
                        Join thousands of car enthusiasts who have transformed their vehicles with Carvo.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/signup">
                            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-lg px-8 hover:shadow-lg hover:scale-105 transition-all">
                                Create Free Account
                            </Button>
                        </Link>
                        <Link to="/contact">
                            <Button size="lg" variant="outline" className="text-lg px-8 hover:scale-105 transition-all">
                                Talk to an Expert
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Features;
