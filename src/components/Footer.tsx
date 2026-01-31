import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ArrowRight
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";

export const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const [pullProgress, setPullProgress] = useState(0);
  const [showUnlock, setShowUnlock] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const currentDragOffset = useRef(0);

  useEffect(() => {
    if (!isHomePage) return; // Only enable drag/game logic on Home
    const handleMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const currentY = e.clientY;
      const diff = currentY - startY.current;
      const clamped = Math.max(0, Math.min(diff, 150));

      currentDragOffset.current = clamped;
      setDragOffset(clamped);
    };

    const handleUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;

      if (currentDragOffset.current > 100) {
        navigate('/game');
      }

      // Reset
      setDragOffset(0);
      currentDragOffset.current = 0;
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [navigate]);

  const startDrag = (e: React.MouseEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
  };
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleScroll = (e: WheelEvent) => {
      // Disable scroll trigger on desktop (md breakpoint) - usage of button instead
      if (window.innerWidth >= 768) return;

      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;

      if (atBottom && e.deltaY > 0) {
        setPullProgress(prev => {
          const newProgress = Math.min(prev + e.deltaY * 0.5, 120); // Cap at 120
          if (newProgress > 10) setShowUnlock(true);
          if (newProgress >= 100) {
            navigate('/game');
          }
          return newProgress;
        });
      } else {
        setPullProgress(0);
        setShowUnlock(false);
      }

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (pullProgress < 100) {
          setPullProgress(0);
          setShowUnlock(false);
        }
      }, 500); // Reset if stopped scrolling
    };

    window.addEventListener('wheel', handleScroll);
    return () => window.removeEventListener('wheel', handleScroll);
  }, [navigate, pullProgress]);

  return (
    <div className="relative bg-gray-50 flex flex-col font-sans overflow-hidden pb-40 md:pb-60">
      {/* Secret Game Unlock UI & Draggable Button - Home Page Only */}
      {isHomePage && (
        <>
          {/* Secret Game Unlock UI */}
          <div
            className={`fixed inset-x-0 bottom-0 z-50 transition-all duration-300 pointer-events-none flex flex-col items-center justify-end pb-10 bg-gradient-to-t from-black/90 to-transparent ${showUnlock ? 'opacity-100 h-64' : 'opacity-0 h-0'}`}
          >
            <div className="text-white font-bold text-2xl tracking-widest mb-4 font-display">
              {pullProgress >= 100 ? "RELEASE TO IGNITE" : "STARTING ENGINE..."}
            </div>
            <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 transition-all duration-75 ease-out" style={{ width: `${Math.min(pullProgress, 100)}%` }} />
            </div>
          </div>

          {/* Desktop Hint Button - Draggable */}
          <div className="hidden md:flex flex-col items-center fixed bottom-24 right-10 z-40">
            <div
              onMouseDown={startDrag}
              style={{ transform: `translateY(${dragOffset}px)`, transition: isDragging.current ? 'none' : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
              className={`
                    bg-white hover:bg-white/90 backdrop-blur-md border border-gray-200 text-black px-6 py-3 rounded-full cursor-grab active:cursor-grabbing hover:scale-105 group items-center space-x-3 select-none flex shadow-xl z-50
                    ${dragOffset > 100 ? '!bg-orange-500 !border-orange-500 !text-white' : ''}
                `}
            >
              <div className={`bg-orange-500 rounded-full p-1.5 ${dragOffset > 10 ? '' : 'animate-bounce'}`}>
                <ArrowRight className={`w-4 h-4 text-white rotate-90 transition-transform ${dragOffset > 100 ? 'rotate-180' : ''}`} />
              </div>
              <span className="font-bold text-sm tracking-wide">
                {dragOffset > 100 ? "RELEASE TO PLAY" : "PULL TO PLAY"}
              </span>
            </div>
            {/* Vertical Guide Line */}
            <div className="absolute top-full left-1/2 w-0.5 bg-gradient-to-b from-white/20 to-transparent h-32 -translate-x-1/2 pointer-events-none -z-10" />
          </div>
        </>
      )}

      {/* 1. Dark CTA Section (Top) */}
      <div id="footer-dark-section" className="bg-black text-white py-24 px-6 relative z-10">
        {/* Subtle top gradient fade for seamless integration */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-900 to-transparent opacity-50 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to transform your ride?
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto font-medium">
            Join thousands of automotive enthusiasts who are creating masterpiece builds with Carvo.
          </p>
          <Link to="/signup">
            <Button
              className="bg-white text-black hover:bg-gray-200 font-bold px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105"
            >
              Start for free
            </Button>
          </Link>
        </div>

        {/* Decorative blur/glow at bottom of black section to blend */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>

      {/* 2. Floating Footer Card Container */}
      {/* We use negative margin to pull it up into the black section */}
      <div className="relative z-20 -mt-16 px-4 md:px-8 pb-12">
        <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative">

          {/* Watermark Background inside the card (or behind it? Reference looks like smooth light bg with card on top) -> Let's keep card white clean. */}

          <div className="p-12 md:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

              {/* Brand Column (Left) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl">C</div>
                  <span className="text-2xl font-bold tracking-tight text-black">Carvo</span>
                </div>
                <p className="text-gray-500 leading-relaxed max-w-sm">
                  Carvo empowers enthusiasts to transform stock vehicles into unique expressions of style and performance. Making modification simple, visualized, and professional.
                </p>
                <div className="flex space-x-4 pt-4">
                  {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                    <button
                      key={i}
                      onClick={() => toast.info("Social media links coming soon!")}
                      className="text-black hover:text-gray-600 transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Links Columns (Right) */}
              <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
                {/* Column 1 */}
                <div className="space-y-6">
                  <h4 className="font-bold text-black text-lg">Product</h4>
                  <ul className="space-y-4">
                    <li>
                      <Link
                        to="/features"
                        className="text-gray-500 hover:text-black transition-colors font-medium text-sm"
                      >
                        Features
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shop"
                        className="text-gray-500 hover:text-black transition-colors font-medium text-sm"
                      >
                        Pricing
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/car-selection"
                        className="text-gray-500 hover:text-black transition-colors font-medium text-sm"
                      >
                        Live Preview
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/gallery"
                        className="text-gray-500 hover:text-black transition-colors font-medium text-sm"
                      >
                        Showcase
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 2 */}
                <div className="space-y-6">
                  <h4 className="font-bold text-black text-lg">Resources</h4>
                  <ul className="space-y-4">
                    <li>
                      <Link
                        to="/blog"
                        className="text-gray-500 hover:text-black transition-colors font-medium text-sm"
                      >
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/contact"
                        className="text-gray-500 hover:text-black transition-colors font-medium text-sm"
                      >
                        Support
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 3 */}
                <div className="space-y-6">
                  <h4 className="font-bold text-black text-lg">Company</h4>
                  <ul className="space-y-4">
                    <li>
                      <Link
                        to="/about"
                        className="text-gray-500 hover:text-black transition-colors font-medium text-sm"
                      >
                        About
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/careers"
                        className="text-gray-500 hover:text-black transition-colors font-medium text-sm"
                      >
                        Careers
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/contact"
                        className="text-gray-500 hover:text-black transition-colors font-medium text-sm"
                      >
                        Contact
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/terms"
                        className="text-gray-500 hover:text-black transition-colors font-medium text-sm"
                      >
                        Legal
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 my-12" />

            {/* Bottom Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 font-medium space-y-4 md:space-y-0">
              <p>© 2025 Carvo. All rights reserved.</p>
              <div className="flex space-x-8">
                <Link to="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
                <Link to="/cookies" className="hover:text-black transition-colors">Cookies Settings</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Huge Watermark Text Behind (Bottom Layer) */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 translate-y-[15%] select-none pointer-events-none z-0">
        <h1 className="text-[10rem] md:text-[18rem] font-black text-gray-200 tracking-widest leading-none whitespace-nowrap opacity-65">
          Carvo
        </h1>
      </div>
    </div>
  );
};