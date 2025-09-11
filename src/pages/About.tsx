import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Award, Wrench, Clock, Target, Star } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

const About = () => {
  const stats = [
    { icon: Users, number: "5000+", label: "Happy Customers" },
    { icon: Wrench, number: "15000+", label: "Modifications Done" },
    { icon: Award, number: "50+", label: "Awards Won" },
    { icon: Clock, number: "8", label: "Years Experience" },
  ];

  const team = [
    {
      name: "Alex Rodriguez",
      role: "Founder & CEO",
      image: "/placeholder.svg",
      bio: "15+ years in automotive industry, passionate about innovation"
    },
    {
      name: "Sarah Chen",
      role: "Lead Designer",
      image: "/placeholder.svg", 
      bio: "Award-winning designer specializing in luxury car aesthetics"
    },
    {
      name: "Mike Johnson",
      role: "Technical Director",
      image: "/placeholder.svg",
      bio: "Former F1 engineer, expert in performance modifications"
    },
    {
      name: "Lisa Park",
      role: "Customer Success",
      image: "/placeholder.svg",
      bio: "Ensuring every customer gets their dream car transformation"
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Precision",
      description: "Every modification is executed with surgical precision and attention to detail."
    },
    {
      icon: Star,
      title: "Excellence",
      description: "We never compromise on quality. Your satisfaction is our top priority."
    },
    {
      icon: Users,
      title: "Trust",
      description: "Built on years of trust and thousands of successful transformations."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <AnimatedSection className="pt-24 pb-16 bg-gradient-to-b from-muted to-background mesh-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                Crafting <span className="text-gradient">Dreams</span> Since 2016
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                We are passionate automotive artisans who transform ordinary vehicles into extraordinary masterpieces. 
                Every project is a canvas for innovation, precision, and uncompromising quality.
              </p>
              <Button size="lg" className="bg-gradient-electric text-lg px-8">
                Get Your Quote
              </Button>
            </div>
            <div className="relative">
              <img 
                src="/placeholder.svg" 
                alt="Our Workshop"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-lg border">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-semibold">Industry Leaders</p>
                    <p className="text-sm text-muted-foreground">In car modification</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Stats Section */}
      <AnimatedSection className="py-16 bg-card" animation="slideInLeft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center hover-scale animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <stat.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-gradient mb-2">{stat.number}</div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Our Story</h2>
            <p className="text-xl text-muted-foreground">
              From a small garage to industry leaders
            </p>
          </div>
          
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p className="text-lg leading-relaxed mb-6">
              It all started in 2016 when our founder, Alex Rodriguez, transformed his first car in a small garage. 
              What began as a passion project quickly evolved into something much bigger when friends and neighbors 
              started asking for similar transformations.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Today, we've grown into one of the most trusted names in car modification, serving thousands of 
              customers across the country. Our team combines traditional craftsmanship with cutting-edge 
              technology to deliver results that exceed expectations.
            </p>
            <p className="text-lg leading-relaxed">
              Every car that comes through our doors is treated as a unique canvas. We don't just modify cars; 
              we bring visions to life, create memories, and help our customers express their personality 
              through their vehicles.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground">
              The principles that drive everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-8">
                  <value.icon className="w-16 h-16 text-primary mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground">
              The passionate experts behind every transformation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <Badge variant="secondary" className="mb-4">{member.role}</Badge>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-electric-blue/10 to-primary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Ready to Transform Your Ride?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join the thousands of satisfied customers who chose us to bring their vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-electric text-lg px-8">
              Start Your Project
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              View Our Work
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;