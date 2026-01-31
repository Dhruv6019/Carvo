import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { useGoogleLogin } from '@react-oauth/google';
import { LoadingScreen } from "@/components/LoadingScreen";
import { ToyRobotViewer } from "@/components/ToyRobotViewer";

export const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessLoading, setShowSuccessLoading] = useState(false);
  const [isHiding, setIsHiding] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const getDashboardRoute = (role: string) => {
    switch (role) {
      case "admin": return "/admin";
      case "seller": return "/seller-dashboard";
      case "service_provider": return "/provider-dashboard";
      case "delivery_boy": return "/delivery-dashboard";
      case "support_agent": return "/support-dashboard";
      default: return "/dashboard";
    }
  };

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
        toast.success("Account created successfully via Google");
        setShowSuccessLoading(true);
        setTimeout(() => {
          navigate(getDashboardRoute(response.data.user.role));
        }, 3000);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Google signup failed");
      }
    },
    onError: () => toast.error("Google signup failed"),
    flow: 'auth-code',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.post("/auth/signup", {
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        role: "customer",
        phone: formData.phone
      });
      // Do not login immediately. Redirect to verification.
      toast.success("Account created. Please verify your email.");
      setIsLoading(false);
      setShowSuccessLoading(true);
      setTimeout(() => {
        navigate("/verify-otp", { state: { email: formData.email } });
      }, 3000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
      setIsLoading(false);
    }
  };

  if (showSuccessLoading) {
    return <LoadingScreen duration={3000} />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#DCCBB5]">
      <div className="w-full max-w-5xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col lg:flex-row h-auto lg:h-[850px]">

        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-14 flex flex-col bg-white overflow-y-auto">
          <div className="mb-10 flex-none">
            <a href="http://localhost:8080" className="inline-block hover:opacity-80 transition-opacity">
              <h2 className="text-xl font-black text-[#7A5C4A] tracking-widest uppercase">CARVO</h2>
            </a>
          </div>

          <div className="max-w-md w-full mx-auto space-y-8 flex-1 flex flex-col justify-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Create an account</h1>
              <p className="text-sm text-gray-400">Join Carvo today and start your journey.</p>
            </div>

            <div className="space-y-6">
              {/* Google Sign-in - Move to Top */}
              <Button
                type="button"
                variant="outline"
                onClick={() => googleLogin()}
                className="w-full h-12 rounded-full border-gray-100 hover:bg-gray-50 transition-all duration-300 font-medium text-gray-700 shadow-sm flex items-center justify-center space-x-2"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                <span>Sign up with Google</span>
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-100 italic"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-gray-300">OR</span>
                </div>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-xs font-semibold text-gray-600 pl-4">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="w-full h-12 rounded-full bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-[#7A5C4A]/20 px-6 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-xs font-semibold text-gray-600 pl-4">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="w-full h-12 rounded-full bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-[#7A5C4A]/20 px-6 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-gray-600 pl-4">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full h-12 rounded-full bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-[#7A5C4A]/20 px-6 transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold text-gray-600 pl-4">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 00000 00000"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full h-12 rounded-full bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-[#7A5C4A]/20 px-6 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="password" title="Password" className="text-xs font-semibold text-gray-600 pl-4">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
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
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" title="Confirm" className="text-xs font-semibold text-gray-600 pl-4">Confirm</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="********"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        onFocus={() => setIsHiding(true)}
                        onBlur={() => setIsHiding(false)}
                        className="w-full h-12 rounded-full bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-[#7A5C4A]/20 px-6 pr-12 transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pt-2 px-4">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="mt-1 w-4 h-4 rounded-sm border-gray-200 text-[#7A5C4A] focus:ring-[#7A5C4A] accent-[#7A5C4A]"
                  />
                  <label htmlFor="terms" className="text-[10px] text-gray-500 leading-tight">
                    I agree to the <Link to="/terms" className="text-[#7A5C4A] font-bold hover:underline">Terms</Link> and <Link to="/privacy" className="text-[#7A5C4A] font-bold hover:underline">Privacy Policy</Link>.
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 text-sm font-bold rounded-full bg-[#7A5C4A] hover:bg-[#634A3C] transition-all duration-300 shadow-lg shadow-[#7A5C4A]/10 mt-2"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-500 font-medium">
                  Already have an account?{" "}
                  <Link to="/login" className="text-[#7A5C4A] font-bold hover:underline transition-all">
                    Login
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
              <h2 className="text-3xl font-bold mb-2">Join Carvo</h2>
              <p className="text-sm font-medium opacity-80">Create your dream car with our professional tools.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;