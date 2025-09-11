import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-electric-blue to-burnt-orange py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-display font-bold mb-4">
            Stay Updated with Latest Mods
          </h3>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Get exclusive access to new modification packages, industry insights, and special offers.
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto space-y-4 sm:space-y-0 sm:space-x-4">
            <Input 
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-white"
            />
            <Button 
              variant="secondary"
              className="bg-white text-gray-900 hover:bg-white/90 font-semibold"
            >
              Subscribe
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">CM</span>
              </div>
              <span className="font-display font-bold text-xl">CarMods Pro</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Transform your vehicle with professional modification services. 
              Premium quality, cutting-edge technology, and exceptional results.
            </p>
            <div className="flex space-x-4">
              <Button size="icon" variant="ghost" className="hover:bg-white/10">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-white/10">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-white/10">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-white/10">
                <Youtube className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-display font-bold text-lg">Quick Links</h4>
            <div className="space-y-3">
              {[
                "Home",
                "Car Selection", 
                "Modification Hub",
                "Live Preview",
                "Gallery",
                "About Us"
              ].map((link) => (
                <a 
                  key={link}
                  href="#" 
                  className="block text-gray-400 hover:text-electric-blue transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h4 className="font-display font-bold text-lg">Services</h4>
            <div className="space-y-3">
              {[
                "Custom Paint Jobs",
                "Performance Upgrades",
                "Alloy Wheels",
                "Interior Styling", 
                "Body Kits",
                "Exhaust Systems"
              ].map((service) => (
                <a 
                  key={service}
                  href="#" 
                  className="block text-gray-400 hover:text-electric-blue transition-colors"
                >
                  {service}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="font-display font-bold text-lg">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-electric-blue mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Automotive Plaza<br />
                  Los Angeles, CA 90210<br />
                  United States
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-electric-blue flex-shrink-0" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-electric-blue flex-shrink-0" />
                <span className="text-gray-400">info@carmodspro.com</span>
              </div>
            </div>
            <Button 
              className="bg-gradient-to-r from-electric-blue to-electric-blue-dark text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Get Quote
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-center md:text-left">
            © 2024 CarMods Pro. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-electric-blue transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-electric-blue transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-electric-blue transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};