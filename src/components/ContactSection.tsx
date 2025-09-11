import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Send } from "lucide-react";

export const ContactSection = () => {
  return (
    <section className="py-20 px-6 bg-luxury-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,0,0,0.1),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-black text-foreground">
                GET IN <span className="text-luxury-red">TOUCH</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Ready to experience luxury? Contact our team to schedule a test drive 
                or learn more about our exclusive collection.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-glass backdrop-blur-xl rounded-lg flex items-center justify-center border border-white/10">
                  <Phone className="w-5 h-5 text-luxury-red" />
                </div>
                <div>
                  <p className="text-foreground font-semibold">Call Us</p>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-glass backdrop-blur-xl rounded-lg flex items-center justify-center border border-white/10">
                  <Mail className="w-5 h-5 text-luxury-red" />
                </div>
                <div>
                  <p className="text-foreground font-semibold">Email Us</p>
                  <p className="text-muted-foreground">hello@luxurycars.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-glass backdrop-blur-xl rounded-lg flex items-center justify-center border border-white/10">
                  <MapPin className="w-5 h-5 text-luxury-red" />
                </div>
                <div>
                  <p className="text-foreground font-semibold">Visit Showroom</p>
                  <p className="text-muted-foreground">123 Luxury Avenue, Beverly Hills, CA</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="bg-gradient-surface border-luxury-red/20 p-8">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-foreground text-sm font-semibold">First Name</label>
                  <Input 
                    placeholder="John" 
                    className="bg-luxury-dark border-white/10 text-foreground placeholder:text-muted-foreground focus:border-luxury-red"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-foreground text-sm font-semibold">Last Name</label>
                  <Input 
                    placeholder="Doe" 
                    className="bg-luxury-dark border-white/10 text-foreground placeholder:text-muted-foreground focus:border-luxury-red"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-foreground text-sm font-semibold">Email</label>
                <Input 
                  type="email"
                  placeholder="john@example.com" 
                  className="bg-luxury-dark border-white/10 text-foreground placeholder:text-muted-foreground focus:border-luxury-red"
                />
              </div>

              <div className="space-y-2">
                <label className="text-foreground text-sm font-semibold">Phone</label>
                <Input 
                  type="tel"
                  placeholder="+1 (555) 123-4567" 
                  className="bg-luxury-dark border-white/10 text-foreground placeholder:text-muted-foreground focus:border-luxury-red"
                />
              </div>

              <div className="space-y-2">
                <label className="text-foreground text-sm font-semibold">Message</label>
                <Textarea 
                  placeholder="Tell us about your dream car..." 
                  rows={4}
                  className="bg-luxury-dark border-white/10 text-foreground placeholder:text-muted-foreground focus:border-luxury-red resize-none"
                />
              </div>

              <Button variant="luxury" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};