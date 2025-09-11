import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, Share2, Filter } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Projects" },
    { id: "paint", name: "Custom Paint" },
    { id: "wheels", name: "Alloy Wheels" },
    { id: "interior", name: "Interior" },
    { id: "performance", name: "Performance" },
    { id: "lighting", name: "LED Lighting" },
  ];

  const projects = [
    {
      id: 1,
      title: "Matte Black BMW M3",
      category: "paint",
      image: "/placeholder.svg",
      client: "John D.",
      likes: 234,
      views: 1200,
      tags: ["Matte Black", "Carbon Fiber", "Sport Package"]
    },
    {
      id: 2,
      title: "Red Chrome Ferrari 488",
      category: "paint",
      image: "/placeholder.svg", 
      client: "Sarah M.",
      likes: 189,
      views: 890,
      tags: ["Chrome Red", "Ceramic Coating", "Performance"]
    },
    {
      id: 3,
      title: "Custom 22\" Forged Wheels",
      category: "wheels",
      image: "/placeholder.svg",
      client: "Mike R.",
      likes: 156,
      views: 670,
      tags: ["Forged", "22 Inch", "Custom Design"]
    },
    {
      id: 4,
      title: "Luxury Interior Upgrade",
      category: "interior",
      image: "/placeholder.svg",
      client: "Lisa K.",
      likes: 298,
      views: 1450,
      tags: ["Leather", "Alcantara", "Custom Stitching"]
    },
    {
      id: 5,
      title: "Turbo Performance Kit",
      category: "performance",
      image: "/placeholder.svg",
      client: "David P.",
      likes: 312,
      views: 1800,
      tags: ["Turbo", "ECU Tune", "Cold Air Intake"]
    },
    {
      id: 6,
      title: "RGB Underglow System",
      category: "lighting",
      image: "/placeholder.svg",
      client: "Alex C.",
      likes: 87,
      views: 420,
      tags: ["RGB", "Underglow", "App Control"]
    }
  ];

  const filteredProjects = selectedCategory === "all" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <AnimatedSection className="pt-24 pb-12 bg-gradient-to-b from-muted to-background mesh-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 hover-lift">
            Modification <span className="text-gradient">Gallery</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animate-delay-200">
            Explore our portfolio of stunning car transformations and get inspired for your next project.
          </p>
        </div>
      </AnimatedSection>

      {/* Filter Tabs */}
      <section className="py-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="mb-2"
              >
                <Filter className="w-4 h-4 mr-2" />
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <AnimatedSection className="py-16" animation="scaleIn">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <Card key={project.id} className="group hover:shadow-xl hover-lift transition-all duration-500 overflow-hidden animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-4">Client: {project.client}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {project.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {project.views}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            Ready to Create Your Masterpiece?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join hundreds of satisfied customers who transformed their rides with us.
          </p>
          <Button size="lg" className="bg-gradient-electric text-lg px-8">
            Start Your Project
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Gallery;