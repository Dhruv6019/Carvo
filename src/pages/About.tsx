import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Award, Wrench, Clock, Target, Star } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  const stats = [
    { icon: Users, number: "7", label: "Team Members" },
    { icon: Wrench, number: "1", label: "Unified Platform" },
    { icon: Award, number: "2025-26", label: "Project Year" },
    { icon: Clock, number: "24/7", label: "Innovation" },
  ];

  const team = [
    {
      name: "MEET SADARIYA",
      role: "23012250410277",
      image: "/meet-sadariya.png",
      bio: "Information Technology Student"
    },
    {
      name: "MEHUL SHARMA",
      role: "23012250410302",
      image: "/mehul-sharma_v2.png",
      bio: "Information Technology Student"
    },
    {
      name: "JAINAM SOLANKI",
      role: "23012250410309",
      image: "/jainam-solanki.png",
      bio: "Information Technology Student"
    },
    {
      name: "KRISH SUTHAR",
      role: "23012250410320",
      image: "/krish-suthar.png",
      bio: "Information Technology Student"
    },
    {
      name: "KRISHNA TANK",
      role: "23012250410322",
      image: "/krishna-tank.png",
      bio: "Information Technology Student"
    },
    {
      name: "DHRUV TELI",
      role: "23012250410323",
      image: "/dhruv-teli.png",
      bio: "Information Technology Student"
    },
    {
      name: "MANAN TIWARI",
      role: "23012250410330",
      image: "/manan_v4.png",
      bio: "Information Technology Student"
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
      description: "Built on trust and many of successful transformations."
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
              <div className="text-4xl md:text-6xl font-display font-bold mb-6 flex flex-wrap items-center gap-x-3">
                <LayoutTextFlip
                  text="Crafting "
                  words={["Dreams", "Vision", "Reality", "Future"]}
                  className="md:text-6xl text-4xl"
                />
                <span>Since 2023</span>
              </div>
              <p className="text-xl text-muted-foreground mb-8">
                We are passionate automotive artisans who transform ordinary vehicles into extraordinary masterpieces.
                Every project is a canvas for innovation, precision, and uncompromising quality.
              </p>
              <Button
                size="lg"
                className="bg-gradient-electric text-lg px-8 shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigate('/contact')}
              >
                Get Your Quote
              </Button>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="/about-hero-v2.png"
                alt="Our Workshop"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-lg border">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-semibold">Student Innovation</p>
                    <p className="text-sm text-muted-foreground">LJ Polytechnic</p>
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
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground">
              From concept to a comprehensive car modification platform
            </p>
          </div>

          <div className="max-w-none text-muted-foreground">
            <TextGenerateEffect
              words="Carvo represents the culmination of our academic journey at L.J. Polytechnic. Conceived as a final year project in the Department of Information Technology, it reflects our collective passion for technology, design, and automotive culture."
              className="text-lg md:text-xl leading-8 mb-8 font-light tracking-wide text-gray-600 dark:text-gray-300"
            />
            <TextGenerateEffect
              words="Our mission was to create a digital ecosystem that streamlines the car modification industry. By integrating 3D visualization, seamless booking management, and a curated marketplace, we aim to demonstrate how technology can elevate the user experience in the automotive world."
              className="text-lg md:text-xl leading-8 mb-8 font-light tracking-wide text-gray-600 dark:text-gray-300"
            />
            <TextGenerateEffect
              words="This platform stands as a testament to our technical skills, teamwork, and innovation. It is not just a project; it is a showcase of what determines students can build when they combine their knowledge with creativity."
              className="text-lg md:text-xl leading-8 font-light tracking-wide text-gray-600 dark:text-gray-300"
            />
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
                  <ImageWithFallback
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

      {/* University / Department Section */}
      <section className="py-16 bg-muted text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex justify-center">
            <div className="w-40 h-40 flex items-center justify-center">
              <ImageWithFallback
                src="/lj-logo.png"
                alt="LJ Polytechnic Logo"
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
          </div>
          <h3 className="text-2xl font-bold uppercase tracking-wider mb-2">Department of Information Technology</h3>
          <h4 className="text-xl font-semibold text-muted-foreground uppercase mb-4">L.J. Polytechnic, Ahmedabad</h4>
          <p className="text-lg font-mono text-electric-blue">2025-26</p>
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
            <Button size="lg" className="bg-gradient-electric text-lg px-8" onClick={() => window.location.href = '/contact'}>
              Start Your Project
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => window.location.href = '/contact'}>
              Give Feedback
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div >
  );
};

export default About;