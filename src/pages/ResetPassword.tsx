import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

export const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setError("Invalid or missing reset token. Please request a new link.");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            await api.post("/auth/reset-password", { token, password });
            setIsSuccess(true);
            toast.success("Password reset successfully!");
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to reset password. Link may be expired.");
            setError(error.response?.data?.message || "Link expired or invalid.");
        } finally {
            setIsLoading(false);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#DCCBB5]">
                <div className="w-full max-w-md p-8 bg-white rounded-[40px] shadow-2xl text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="bg-red-50 p-4 rounded-full">
                            <AlertCircle className="w-12 h-12 text-red-500" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-gray-900">Reset Link Error</h1>
                        <p className="text-sm text-gray-500">{error}</p>
                    </div>
                    <Button asChild className="w-full h-12 rounded-full bg-[#7A5C4A] hover:bg-[#634A3C]">
                        <Link to="/forgot-password">Request New Link</Link>
                    </Button>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#DCCBB5]">
                <div className="w-full max-w-md p-8 bg-white rounded-[40px] shadow-2xl text-center space-y-8">
                    <div className="flex justify-center">
                        <div className="bg-[#F5ECE1] p-6 rounded-full">
                            <CheckCircle2 className="w-16 h-16 text-[#7A5C4A]" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold text-gray-900">Password Reset!</h1>
                        <p className="text-sm text-gray-500">
                            Your password has been changed successfully. <br />
                            Redirecting to login...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#DCCBB5]">
            <div className="w-full max-w-5xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col lg:flex-row h-auto lg:h-[750px]">

                {/* Left Side - Form */}
                <div className="w-full lg:w-1/2 p-8 lg:p-14 flex flex-col bg-white">
                    <div className="mb-10">
                        <h2 className="text-xl font-black text-[#7A5C4A] tracking-widest uppercase">CARVO</h2>
                    </div>

                    <div className="max-w-md w-full mx-auto space-y-8 flex-1 flex flex-col justify-center">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-gray-900">New Password</h1>
                            <p className="text-sm text-gray-400">Please choose a strong password you haven't used before.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="password" title="Password" className="text-xs font-semibold text-gray-600 pl-4">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="********"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
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
                                    <Label htmlFor="confirmPassword" title="Confirm" className="text-xs font-semibold text-gray-600 pl-4">Confirm Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="********"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
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

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 text-sm font-bold rounded-full bg-[#7A5C4A] hover:bg-[#634A3C] transition-all duration-300 shadow-lg shadow-[#7A5C4A]/10 mt-2"
                            >
                                {isLoading ? "Updating..." : "Update Password"}
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Right Side - Visual Showcase */}
                <div className="hidden lg:block w-1/2 relative bg-[#F5ECE1] p-4">
                    <div
                        className="w-full h-full rounded-[30px] bg-cover bg-center overflow-hidden"
                        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2670&auto=format&fit=crop')` }}
                    >
                        <div className="absolute inset-0 bg-black/5" />
                        <div className="absolute bottom-10 right-10 text-[#7A5C4A] text-right max-w-xs">
                            <h2 className="text-3xl font-bold mb-2">Almost there.</h2>
                            <p className="text-sm font-medium opacity-80">Resetting your password is the first step back to your Carvo experience.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
