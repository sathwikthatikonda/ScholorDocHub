"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useStore } from "@/store/useStore";
import { t } from "@/lib/i18n";
import { ShieldAlert, BookOpen } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const { setToken, setUser, language } = useStore();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await api.post("/auth/login", { email, password });
            setToken(res.data.token);
            setUser(res.data);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 w-full flex items-center justify-center p-4 bg-slate-50 relative min-h-[calc(100vh-120px)] overflow-hidden">
            <div className="absolute inset-0 bg-primary-900 overflow-hidden hidden md:block z-0">
                <div className="w-[1000px] h-[1000px] bg-primary-800 rounded-full blur-3xl absolute -top-[500px] -left-[200px] opacity-50 block"></div>
                <div className="w-[800px] h-[800px] bg-accent-teal-700 rounded-full blur-3xl absolute -bottom-[400px] -right-[200px] opacity-30 block"></div>
            </div>

            <div className="w-full max-w-5xl premium-card overflow-hidden flex flex-col md:flex-row shadow-2xl z-10 relative">
                {/* Left Side: Auth Info */}
                <div className="w-full md:w-5/12 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white order-2 md:order-1 relative">
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2 leading-tight">
                        Welcome Back
                    </h2>
                    <p className="text-slate-500 mb-10 text-sm">
                        Securely log in to access your matched national scholarships.
                    </p>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-200 flex items-start gap-3">
                            <ShieldAlert className="w-5 h-5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="premium-label">{t("Email", language)}</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="premium-input placeholder:text-slate-400"
                                placeholder="Enter your registered email"
                                required
                            />
                        </div>

                        <div>
                            <label className="premium-label flex justify-between">
                                {t("Password", language)}
                                <Link href="#" className="font-medium text-primary-600 hover:text-primary-700 text-xs">Forgot password?</Link>
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="premium-input placeholder:text-slate-400"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button type="submit" disabled={loading} className="w-full premium-button-primary mt-8 py-3.5 text-base shadow-lg shadow-primary-500/20">
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                t("Login", language)
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500 font-medium">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-primary-600 hover:text-primary-800 transition-colors font-bold underline decoration-primary-300 underline-offset-4">
                            {t("SignUp", language)}
                        </Link>
                    </p>
                </div>

                {/* Right Side: Visual Context */}
                <div className="w-full md:w-7/12 bg-primary-50 p-8 md:p-16 flex flex-col items-center justify-center relative overflow-hidden order-1 md:order-2">
                    <div className="absolute inset-0 bg-primary-100 opacity-20 pattern-grid"></div>

                    <div className="relative z-10 flex items-center justify-center p-6 bg-white rounded-2xl shadow-xl w-32 h-32 mb-10 mx-auto">
                        <BookOpen className="w-16 h-16 text-primary-600" />
                    </div>

                    <h3 className="relative z-10 text-2xl font-bold text-primary-950 text-center leading-snug max-w-sm mb-4">
                        Your Gateway to National Education Funding
                    </h3>
                    <p className="relative z-10 text-primary-700 text-center max-w-sm">
                        Discover verified opportunities, securely save your records, and connect with direct government & private scholarships instantly.
                    </p>
                </div>
            </div>
        </div>
    );
}
