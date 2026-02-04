import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  Car,
  Calendar,
  Quote
} from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Workshop",
      content: "L.J. Knowledge Campus, S.G. Highway, Ahmedabad, Gujarat",
      action: "Get Directions"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+91 97262 10000",
      action: "Call Now"
    },
    {
      icon: Mail,
      title: "Email Us",
      content: "info@ljku.edu.in",
      action: "Send Email"
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon-Sat: 10AM-5PM\nSun: Closed",
      action: "View Schedule"
    }
  ];

  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    carModel: "",
    category: "Inquiry",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to send a formal message or complaint.");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const subject = `[${formData.category}] ${formData.carModel ? formData.carModel : 'General Inquiry'}`;
      await api.post("/support/complaints", {
        subject: subject,
        description: formData.message,
        priority: formData.category === "Complaint" ? "high" : "medium"
      });

      toast.success("Your message has been sent to our support team!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        carModel: "",
        category: "Inquiry",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting contact form", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const services = [
    {
      icon: Car,
      title: "Custom Modifications",
      description: "Complete vehicle transformation services"
    },
    {
      icon: Calendar,
      title: "Consultation Booking",
      description: "Schedule a meeting with our experts"
    },
    {
      icon: Quote,
      title: "Free Quotes",
      description: "Get detailed pricing for your project"
    }
  ];

  const scrollToForm = () => {
    const formElement = document.getElementById('contact-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAction = (action: string) => {
    switch (action) {
      case "Call Now":
        window.location.href = "tel:+919726210000";
        break;
      case "Send Email":
        window.location.href = "mailto:info@ljku.edu.in";
        break;
      case "Get Directions":
        window.open("https://maps.app.goo.gl/z33J8nNhLcr44rQ76", "_blank");
        break;
      case "View Schedule":
        toast.info("Business Hours: Mon-Sat 10AM-5PM");
        break;
      case "Book Consultation":
        setFormData(prev => ({ ...prev, category: "Project" }));
        scrollToForm();
        break;
      case "Start Chat":
        scrollToForm();
        toast("How can we help you today?", {
          description: "Our team will respond to your message shortly.",
        });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <AnimatedSection className="pt-24 pb-16 bg-gradient-to-b from-muted to-background mesh-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Get In <span className="text-gradient">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Ready to transform your vehicle? We're here to help you every step of the way.
            Contact us today to discuss your project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-electric text-lg px-8"
              onClick={() => handleAction("Start Chat")}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Chat
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8"
              onClick={() => handleAction("Book Consultation")}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Consultation
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {/* Contact Info Cards */}
      <AnimatedSection className="py-16" animation="scaleIn">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover-lift hover-glow transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <info.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                  <p className="text-muted-foreground mb-4 whitespace-pre-line">{info.content}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction(info.action)}
                  >
                    {info.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Main Contact Section */}
      <section id="contact-form-section" className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="carModel">Car Model (Optional)</Label>
                    <Input
                      id="carModel"
                      placeholder="e.g., BMW M3, Tesla Model S"
                      value={formData.carModel}
                      onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      className="w-full p-2 border border-border rounded-md bg-background"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Inquiry">General Inquiry</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Complaint">Complaint</option>
                      <option value="Project">Project Inquiry</option>
                      <option value="Support">Technical Support</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your project, budget, and timeline..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-gradient-electric text-lg py-6" disabled={loading}>
                    <Send className={`w-5 h-5 mr-2 ${loading ? 'animate-pulse' : ''}`} />
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Services & Map */}
            <div className="space-y-8">

              {/* Services */}
              <Card>
                <CardHeader>
                  <CardTitle>Our Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {services.map((service, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                      <service.icon className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">{service.title}</h4>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Map Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Find Us</CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-hidden">
                  <div className="w-full h-[400px]">
                    <iframe
                      src="https://maps.google.com/maps?q=LJ+Polytechnic+Ahmedabad&t=&z=16&ie=UTF8&iwloc=&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="LJ Polytechnic Map"
                      className="rounded-b-lg"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gradient">24h</div>
                      <p className="text-sm text-muted-foreground">Response Time</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gradient">5000+</div>
                      <p className="text-sm text-muted-foreground">Happy Clients</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gradient">8+</div>
                      <p className="text-sm text-muted-foreground">Years Experience</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="sticky top-32">
              <h2 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-8">
                Frequently asked <br />
                <span className="text-gradient">questions</span>
              </h2>
            </div>

            <div className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    q: "What is the purpose of this website?",
                    a: "Carvo is your ultimate destination for automotive modifications and high-quality parts. We help car enthusiasts transform their vehicles into masterpieces through expert services and curated products."
                  },
                  {
                    q: "How do I contact support?",
                    a: "You can contact our support team via the form above, email us at info@ljku.edu.in, or call our direct line during business hours (Mon-Sat, 10AM-5PM)."
                  },
                  {
                    q: "How do I find the best products?",
                    a: "You can find the best products for your vehicle by browsing our Shop section and using filters for category, performance, and compatibility."
                  },
                  {
                    q: "Can I return a product?",
                    a: "Yes, we accept returns within 14 days of purchase provided the items are in their original packaging and unused. Check our full Refund Policy for more details."
                  },
                  {
                    q: "Do you offer international shipping?",
                    a: "Currently, we specialize in high-performance modifications within India. International shipping options for specific parts are coming soon."
                  },
                  {
                    q: "How can I track my order?",
                    a: "You can track your order by logging into your account and visiting the order history page. You will also receive a tracking number via email once your order has shipped."
                  }
                ].map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
                    <AccordionTrigger className="text-xl font-medium py-6 hover:no-underline hover:text-primary transition-colors hover:border-none">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-lg text-white/70 pb-6 leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div >
  );
};

export default Contact;