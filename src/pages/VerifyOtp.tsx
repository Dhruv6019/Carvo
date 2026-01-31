
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function VerifyOtp() {
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();

    // Get email from location state (passed from signup)
    const email = location.state?.email;

    if (!email) {
        // If no email in state, redirect back to login
        navigate("/login");
        return null;
    }

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post("/auth/verify-otp", { email, otp });
            const { user, accessToken, refreshToken } = response.data;

            login(accessToken, user);
            toast.success("Email verified successfully!");
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Verification failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            await api.post("/auth/resend-otp", { email });
            toast.success("OTP resent successfully");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to resend OTP");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Verify Your Email</CardTitle>
                    <CardDescription className="text-center">
                        We've sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleVerify} className="space-y-6">
                        <div className="space-y-2">
                            <Input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                className="text-center text-2xl tracking-widest h-14"
                                maxLength={6}
                                autoFocus
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                            {isLoading ? "Verifying..." : "Verify Email"}
                        </Button>

                        <div className="text-center space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Didn't receive the code?
                            </p>
                            <Button variant="link" type="button" onClick={handleResend} className="text-electric-blue p-0 h-auto font-semibold">
                                Resend OTP
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
