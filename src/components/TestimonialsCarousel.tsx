import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { useState } from "react";

export const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      name: "Alex Rodriguez",
      car: "BMW M3",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "The live preview feature is incredible! I could see exactly how my M3 would look with the new body kit before ordering. The final result exceeded my expectations.",
      modification: "Carbon Fiber Body Kit + Paint"
    },
    {
      name: "Sarah Chen",
      car: "Audi RS6",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Professional service from start to finish. The team guided me through every option and the 3D preview helped me make the perfect choices for my RS6.",
      modification: "Performance Exhaust + Wheels"
    },
    {
      name: "Marcus Johnson",
      car: "Mercedes AMG GT",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Outstanding quality and attention to detail. The custom interior work on my AMG GT is absolutely perfect. Highly recommend their services!",
      modification: "Custom Interior Package"
    },
    {
      name: "Emma Wilson",
      car: "Porsche 911",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "The turbo upgrade transformed my 911 completely. The team's expertise and the quality of work is simply unmatched. Will definitely return for future mods.",
      modification: "Turbo Performance Package"
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 px-6 bg-background dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-black text-foreground mb-6">
            What Our <span className="bg-gradient-to-r from-electric-blue to-burnt-orange bg-clip-text text-transparent">Customers Say</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of satisfied customers who've transformed their vehicles with us
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative">
          <Card className="p-8 md:p-12 bg-white dark:bg-gray-800 shadow-xl">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-12">
              {/* Customer Photo & Info */}
              <div className="flex-shrink-0 text-center md:text-left">
                <img
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  className="w-24 h-24 rounded-full mx-auto md:mx-0 mb-4 object-cover"
                />
                <h4 className="font-display font-bold text-lg text-foreground">
                  {testimonials[currentIndex].name}
                </h4>
                <p className="text-muted-foreground">
                  {testimonials[currentIndex].car}
                </p>
                <p className="text-sm text-electric-blue font-medium mt-1">
                  {testimonials[currentIndex].modification}
                </p>
              </div>

              {/* Testimonial Content */}
              <div className="flex-1 space-y-6">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-electric-blue opacity-50" />
                
                {/* Rating */}
                <div className="flex justify-center md:justify-start space-x-1">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                  ))}
                </div>
                
                {/* Testimonial Text */}
                <blockquote className="text-lg md:text-xl text-foreground leading-relaxed italic">
                  "{testimonials[currentIndex].text}"
                </blockquote>
              </div>
            </div>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-electric-blue w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};