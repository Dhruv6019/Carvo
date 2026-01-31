import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Briefcase,
    Users,
    Heart,
    Rocket,
    GraduationCap,
    Coffee,
    TrendingUp,
    MapPin,
    Clock,
    DollarSign
} from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Link } from "react-router-dom";

const Careers = () => {
    const benefits = [
        {
            icon: Heart,
            title: "Health & Wellness",
            description: "Comprehensive health insurance, dental, vision, and mental health support for you and your family."
        },
        {
            icon: TrendingUp,
            title: "Growth & Development",
            description: "Professional development budget, conference attendance, and continuous learning opportunities."
        },
        {
            icon: Coffee,
            title: "Work-Life Balance",
            description: "Flexible hours, remote work options, unlimited PTO, and generous parental leave."
        },
        {
            icon: DollarSign,
            title: "Competitive Compensation",
            description: "Market-leading salaries, equity options, performance bonuses, and annual reviews."
        },
        {
            icon: Users,
            title: "Amazing Team",
            description: "Work with passionate automotive enthusiasts who love what they do every day."
        },
        {
            icon: Rocket,
            title: "Innovation Culture",
            description: "Experiment with new technologies, pitch ideas, and see your impact on the product."
        }
    ];

    const openPositions = [
        {
            title: "Senior Full-Stack Engineer",
            department: "Engineering",
            location: "Remote / San Francisco, CA",
            type: "Full-time",
            description: "Build and scale our 3D visualization platform. Work with React, Node.js, and Three.js to create amazing user experiences."
        },
        {
            title: "3D Graphics Engineer",
            department: "Engineering",
            location: "Remote / New York, NY",
            type: "Full-time",
            description: "Develop cutting-edge 3D car rendering and real-time modification preview technology using WebGL and Three.js."
        },
        {
            title: "Product Designer",
            department: "Design",
            location: "Remote / Los Angeles, CA",
            type: "Full-time",
            description: "Design delightful user experiences for car enthusiasts. Create intuitive interfaces for complex customization workflows."
        },
        {
            title: "Customer Success Manager",
            department: "Customer Success",
            location: "Remote",
            type: "Full-time",
            description: "Help our customers achieve their dream car transformations. Be the bridge between users and our product team."
        },
        {
            title: "Automotive Parts Specialist",
            department: "Operations",
            location: "Chicago, IL",
            type: "Full-time",
            description: "Source and validate premium automotive parts. Work with suppliers to ensure quality and authenticity."
        },
        {
            title: "Marketing Manager",
            department: "Marketing",
            location: "Remote / Austin, TX",
            type: "Full-time",
            description: "Drive growth through creative campaigns. Tell our story to car enthusiasts across digital channels."
        }
    ];

    const values = [
        { title: "Customer Obsession", description: "Every decision starts with the customer experience" },
        { title: "Innovation First", description: "We push boundaries and embrace new technology" },
        { title: "Quality Craftsmanship", description: "Excellence in every detail, every time" },
        { title: "Transparency", description: "Honest communication and authentic relationships" }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            {/* Hero Section */}
            <AnimatedSection className="pt-24 pb-16 bg-gradient-to-b from-muted to-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <Badge className="mb-6 text-base px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 border-0">
                            <Briefcase className="w-4 h-4 mr-2" />
                            Join Our Team
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                            Build the Future of <span className="text-gradient bg-gradient-to-r from-purple-500 via-pink-600 to-red-600 bg-clip-text text-transparent">Automotive</span> Customization
                        </h1>
                        <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
                            Join a passionate team transforming how people customize their cars. We're looking for talented individuals
                            who want to make an impact in the automotive industry.
                        </p>
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-purple-500 to-pink-600 text-lg px-8 hover:shadow-lg hover:scale-105 transition-all"
                            onClick={() => {
                                const element = document.getElementById('open-positions');
                                element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                        >
                            View Open Positions
                        </Button>
                    </div>
                </div>
            </AnimatedSection>

            {/* Values Section */}
            <section className="py-16 bg-muted/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Our Values</h2>
                        <p className="text-xl text-muted-foreground">The principles that guide everything we do</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <div key={index} className="text-center p-6 rounded-xl bg-background hover:shadow-lg transition-shadow">
                                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                                <p className="text-muted-foreground">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Why Join Carvo?</h2>
                        <p className="text-xl text-muted-foreground">Competitive benefits for exceptional people</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <CardContent className="p-8">
                                    <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <benefit.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section id="open-positions" className="py-16 bg-muted/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Open Positions</h2>
                        <p className="text-xl text-muted-foreground">Find your perfect role at Carvo</p>
                    </div>
                    <div className="grid gap-6 max-w-5xl mx-auto">
                        {openPositions.map((position, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-8">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-semibold mb-2">{position.title}</h3>
                                            <div className="flex flex-wrap gap-3 mb-3">
                                                <Badge variant="secondary" className="flex items-center gap-1">
                                                    <Briefcase className="w-3 h-3" />
                                                    {position.department}
                                                </Badge>
                                                <Badge variant="secondary" className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {position.location}
                                                </Badge>
                                                <Badge variant="secondary" className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {position.type}
                                                </Badge>
                                            </div>
                                        </div>
                                        <Link to="/contact">
                                            <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-lg">
                                                Apply Now
                                            </Button>
                                        </Link>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed">{position.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-purple-500/10 via-pink-600/10 to-red-600/10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                        Don't See the Right Role?
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8">
                        We're always looking for exceptional talent. Send us your resume and tell us why you'd be a great fit.
                    </p>
                    <Link to="/contact">
                        <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-600 text-lg px-8 hover:shadow-lg hover:scale-105 transition-all">
                            Get in Touch
                        </Button>
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Careers;
