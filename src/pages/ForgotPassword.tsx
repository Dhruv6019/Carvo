import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { ToyRobotViewer } from "@/components/ToyRobotViewer";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post("/auth/forgot-password", { email });
            setIsSubmitted(true);
            toast.success("Reset instructions sent if email exists.");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#DCCBB5]">
                <div className="w-full max-w-md p-8 lg:p-12 bg-white rounded-[40px] shadow-2xl text-center space-y-8">
                    <div className="flex justify-center">
                        <div className="bg-[#F5ECE1] p-6 rounded-full">
                            <CheckCircle2 className="w-16 h-16 text-[#7A5C4A]" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold text-gray-900">Check your email</h1>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            We've sent password reset instructions to <br />
                            <span className="font-bold text-[#7A5C4A]">{email}</span>
                        </p>
                    </div>
                    <Button asChild className="w-full h-12 rounded-full bg-[#7A5C4A] hover:bg-[#634A3C] transition-all duration-300">
                        <Link to="/login">Return to Login</Link>
                    </Button>
                    <p className="text-xs text-gray-400">
                        Didn't receive the email? Check your spam folder or{" "}
                        <button onClick={() => setIsSubmitted(false)} className="text-[#7A5C4A] font-bold hover:underline">
                            try another email
                        </button>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#DCCBB5]">
            <div className="w-full max-w-5xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col lg:flex-row h-auto lg:h-[700px]">

                {/* Left Side - Form */}
                <div className="w-full lg:w-1/2 p-8 lg:p-14 flex flex-col bg-white">
                    <div className="mb-10">
                        <a href="http://localhost:8080" className="inline-block hover:opacity-80 transition-opacity">
                            <h2 className="text-xl font-black text-[#7A5C4A] tracking-widest uppercase tracking-widest">CARVO</h2>
                        </a>
                    </div>

                    <div className="max-w-md w-full mx-auto space-y-8 flex-1 flex flex-col justify-center">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-gray-900">Forgot Password?</h1>
                            <p className="text-sm text-gray-400">No worries, we'll send you reset instructions.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-xs font-semibold text-gray-600 pl-4">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 rounded-full bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-[#7A5C4A]/20 px-6 transition-all"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 text-sm font-bold rounded-full bg-[#7A5C4A] hover:bg-[#634A3C] transition-all duration-300 shadow-lg shadow-[#7A5C4A]/10 mt-2"
                            >
                                {isLoading ? "Sending..." : "Reset Password"}
                            </Button>
                        </form>

                        <div className="text-center pt-2">
                            <Link to="/login" className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-[#7A5C4A] transition-all group">
                                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                                Back to login
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Side - Visual Showcase */}
                <div className="hidden lg:block w-1/2 relative bg-[#F5ECE1] p-4">
                    <div className="w-full h-full rounded-[30px] overflow-hidden bg-white/50 backdrop-blur-sm shadow-inner relative flex items-center justify-center">
                        <ToyRobotViewer shouldAnimate={false} />
                        <div className="absolute bottom-10 left-10 text-[#7A5C4A] max-w-xs pointer-events-none">
                            <h2 className="text-3xl font-bold mb-2">Security first.</h2>
                            <p className="text-sm font-medium opacity-80">We prioritize your account's safety. Resetting your password is quick and secure.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
