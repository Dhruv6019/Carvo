import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Layout, Mail, Lock, Loader2, LogIn, Chrome } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { useGoogleLogin } from '@react-oauth/google';
import { LoadingScreen } from "@/components/LoadingScreen";
import { ToyRobotViewer } from "@/components/ToyRobotViewer";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHiding, setIsHiding] = useState(false);
  const [showSuccessLoading, setShowSuccessLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const getDashboardRoute = (role: string) => {
    switch (role) {
      case "admin":
        return "/admin";
      case "seller":
        return "/seller-dashboard";
      case "service_provider":
        return "/provider-dashboard";
      case "delivery_boy":
        return "/delivery-dashboard";
      case "support_agent":
        return "/support-dashboard";
      default:
        return "/dashboard";
    }
  };

  const [verificationNeeded, setVerificationNeeded] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const response = await api.post("/auth/google", { code: codeResponse.code });
        login(response.data.accessToken, {
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role
        });
        toast.success("Logged in successfully via Google");
        setShowSuccessLoading(true);
        setTimeout(() => {
          navigate(getDashboardRoute(response.data.user.role));
        }, 3000);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Google login failed");
      }
    },
    onError: () => toast.error("Google login failed"),
    flow: 'auth-code',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setVerificationNeeded(false);
    try {
      const response = await api.post("/auth/login", { email, password });
      login(response.data.accessToken, {
        id: response.data.user.id,
        email: response.data.user.email,
        name: response.data.user.name,
        role: response.data.user.role
      });
      toast.success("Logged in successfully");
      setIsLoading(false);
      setShowSuccessLoading(true);
      setTimeout(() => {
        navigate(getDashboardRoute(response.data.user.role));
      }, 3000);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Login failed";
      toast.error(msg);

      // Check for unverified email
      if (error.response?.status === 403 && error.response?.data?.isVerified === false) {
        setVerificationNeeded(true);
        // Also show a persistent toast with action
        toast.message("Verification Required", {
          description: "Please verify your email to continue.",
          action: {
            label: "Verify",
            onClick: () => navigate("/verify-otp", { state: { email } })
          }
        });
      }

      setIsLoading(false);
    }
  };

  if (showSuccessLoading) {
    return <LoadingScreen duration={3000} />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#DCCBB5]">
      <div className="w-full max-w-5xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col lg:flex-row h-auto lg:h-[700px]">

        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-14 flex flex-col bg-white">
          <div className="mb-10">
            <a href="http://localhost:8080" className="inline-block hover:opacity-80 transition-opacity">
              <h2 className="text-xl font-black text-[#7A5C4A] tracking-widest uppercase">CARVO</h2>
            </a>
          </div>

          <div className="max-w-md w-full mx-auto space-y-8 flex-1 flex flex-col justify-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Login</h1>
              <p className="text-sm text-gray-400">Choose from 10,000+ products across 400+ categories</p>
            </div>

            <div className="space-y-6">
              {/* Google Sign-in */}
              <Button
                type="button"
                variant="outline"
                onClick={() => googleLogin()}
                className="w-full h-12 rounded-full border-gray-100 hover:bg-gray-50 transition-all duration-300 font-medium text-gray-700 shadow-sm flex items-center justify-center space-x-2"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                <span>Sign in with Google</span>
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-100 italic"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-gray-300">OR</span>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold text-gray-600 pl-4">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="johncanny@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 rounded-full bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-[#7A5C4A]/20 px-6 transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password" title="Password" className="text-xs font-semibold text-gray-600 pl-4">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setIsHiding(true)}
                        onBlur={() => setIsHiding(false)}
                        className="w-full h-12 rounded-full bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-[#7A5C4A]/20 px-6 pr-12 transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      type="checkbox"
                      className="w-4 h-4 rounded-sm border-gray-200 text-[#7A5C4A] focus:ring-[#7A5C4A] accent-[#7A5C4A]"
                    />
                    <label htmlFor="remember" className="text-xs text-gray-500 font-medium">Remember Me</label>
                  </div>
                  <Link to="/forgot-password" title="Forgot Password" className="text-xs font-medium text-gray-500 hover:text-[#7A5C4A]">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 text-sm font-bold rounded-full bg-[#7A5C4A] hover:bg-[#634A3C] transition-all duration-300 shadow-lg shadow-[#7A5C4A]/10 mt-2"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>

                {/* Verification Needed Action */}
                {verificationNeeded && (
                  <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <Mail className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-medium text-orange-800">Email not verified</p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-4"
                      onClick={() => navigate("/verify-otp", { state: { email } })}
                    >
                      Verify Now
                    </Button>
                  </div>
                )}
              </form>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-500 font-medium">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-[#7A5C4A] font-bold hover:underline transition-all">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Visual Showcase */}
        <div className="hidden lg:block w-1/2 relative bg-[#F5ECE1] p-4">
          <div className="w-full h-full rounded-[30px] overflow-hidden bg-white/50 backdrop-blur-sm shadow-inner relative flex items-center justify-center">
            <ToyRobotViewer shouldAnimate={false} isHiding={isHiding} />
            <div className="absolute bottom-10 left-10 text-[#7A5C4A] max-w-xs pointer-events-none">
              <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
              <p className="text-sm font-medium opacity-80">Your journey in car modification starts here.</p>
            </div>

            {/* Robot Speech Bubble */}
            {verificationNeeded && (
              <div className="absolute top-1/4 right-1/4 max-w-[200px] animate-in zoom-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-4 rounded-2xl rounded-bl-sm shadow-xl border border-gray-100 relative">
                  <p className="text-sm font-bold text-gray-800 mb-2">Beep Boop! 🤖</p>
                  <p className="text-xs text-gray-600 mb-3">Your email isn't verified yet!</p>
                  <Button
                    size="sm"
                    className="w-full bg-[#7A5C4A] hover:bg-[#634A3C] text-white text-xs h-8 rounded-full"
                    onClick={() => navigate("/verify-otp", { state: { email } })}
                  >
                    Verify It Here!
                  </Button>
                  {/* Triangle for bubble tail */}
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-b border-l border-gray-100 transform rotate-45"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;