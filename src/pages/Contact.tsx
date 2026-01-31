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
      content: "123 Auto Street, Car City, CC 12345",
      action: "Get Directions"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+1 (555) 123-4567",
      action: "Call Now"
    },
    {
      icon: Mail,
      title: "Email Us",
      content: "hello@modcar.com",
      action: "Send Email"
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon-Fri: 8AM-6PM\nSat: 9AM-4PM\nSun: Closed",
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
            <Button size="lg" className="bg-gradient-electric text-lg px-8">
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Chat
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
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
                  <Button variant="outline" size="sm">
                    {info.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Main Contact Section */}
      <section className="py-16 bg-muted">
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
                <CardContent>
                  <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                      <p className="text-muted-foreground">Interactive Map</p>
                      <p className="text-sm text-muted-foreground">123 Auto Street, Car City, CC 12345</p>
                      <Button variant="outline" size="sm" className="mt-3">
                        Open in Maps
                      </Button>
                    </div>
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
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "How long does a typical modification take?",
                a: "Project timelines vary based on complexity. Simple modifications like wheel changes take 1-2 days, while complete makeovers can take 2-4 weeks."
              },
              {
                q: "Do you provide warranties on your work?",
                a: "Yes, we provide comprehensive warranties on all our work. Paint jobs come with a 3-year warranty, while parts have manufacturer warranties."
              },
              {
                q: "Can I see my car during the modification process?",
                a: "Absolutely! We encourage clients to visit and see the progress. We also provide regular photo updates throughout the process."
              },
              {
                q: "Do you work on all car makes and models?",
                a: "Yes, we work on all makes and models, from economy cars to luxury vehicles and supercars. Our team has experience with every major brand."
              }
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div >
  );
};

export default Contact;