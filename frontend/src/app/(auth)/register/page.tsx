"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useStore } from "@/store/useStore";
import { t } from "@/lib/i18n";
import { ShieldAlert, Fingerprint } from "lucide-react";

export default function Register() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", mobileNumber: "", state: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const { setToken, setUser, language } = useStore();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await api.post("/auth/register", formData);
            const data = res.data;

            if (data.requiresEmailConfirmation) {
                // Supabase sent a confirmation email - show success message
                setSuccess(true);
            } else if (data.token) {
                // Auto-login succeeded (email confirmation disabled in Supabase)
                setToken(data.token);
                setUser(data);
                router.push("/questionnaire");
            } else {
                setSuccess(true);
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || "Registration failed";
            if (msg.toLowerCase().includes("rate limit") || msg.toLowerCase().includes("email rate")) {
                setError("Too many signup attempts. Please wait a few minutes and try again, or use a different email address.");
            } else if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("already exists")) {
                setError("This email is already registered. Please login instead.");
            } else {
                setError(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    // Show success screen if registration went through but needs email confirmation
    if (success) {
        return (
            <div className="flex-1 w-full flex items-center justify-center p-4 bg-primary-900 min-h-[calc(100vh-120px)]">
                <div className="w-full max-w-lg premium-card p-12 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-200">
                        <ShieldAlert className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Account Created! 🎉</h2>
                    <p className="text-slate-600 mb-2">Your account has been created successfully.</p>
                    <p className="text-slate-500 text-sm mb-8">
                        Please check your email <strong className="text-primary-700">{formData.email}</strong> and click the confirmation link to activate your account. Then you can log in.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
                        <strong>Tip:</strong> If you don&apos;t see the email, check your spam/junk folder.
                    </div>
                    <Link href="/login" className="premium-button-primary inline-flex items-center justify-center w-full py-3">
                        Go to Login →
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full flex items-center justify-center p-4 bg-slate-50 relative min-h-[calc(100vh-120px)] overflow-hidden py-10">
            <div className="absolute inset-0 bg-primary-900 hidden md:block z-0">
                <div className="w-[1000px] h-[1000px] bg-primary-800 rounded-full blur-3xl absolute -bottom-[500px] -right-[200px] opacity-50 block"></div>
            </div>

            <div className="w-full max-w-6xl premium-card overflow-hidden flex flex-col md:flex-row shadow-2xl z-10 relative">

                {/* Left Side: Visual Context */}
                <div className="w-full md:w-5/12 bg-primary-50 p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-accent-teal-100/50 opacity-20 pattern-grid"></div>

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white rounded-xl shadow-md border border-slate-200 flex items-center justify-center mb-8">
                            <Fingerprint className="w-8 h-8 text-accent-teal-600" />
                        </div>
                        <h3 className="text-3xl lg:text-4xl font-extrabold text-primary-950 leading-tight mb-4">
                            Join ScholarDoc Hub
                        </h3>
                        <p className="text-primary-700 leading-relaxed text-lg">
                            Start matching with thousands of fully-verified state, national, and private scholarships in minutes.
                        </p>
                    </div>

                    <div className="relative z-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-12 hidden md:block">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold">1</div>
                            <p className="font-semibold text-slate-800">Create an Account</p>
                        </div>
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">2</div>
                            <p className="font-semibold text-slate-800">Complete KYC Profile</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold">3</div>
                            <p className="font-semibold text-slate-800">Apply Seamlessly</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Auth Form */}
                <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col bg-white">
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Create Profile</h2>
                    <p className="text-slate-500 mb-8 text-sm">Enter your foundational details. You can complete the full eligibility questionnaire later securely.</p>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-200 flex items-start gap-3">
                            <ShieldAlert className="w-5 h-5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="premium-label">{t("Name", language)} <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    autoComplete="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="premium-input placeholder:text-slate-400"
                                    placeholder="As on Aadhar/ID"
                                    required
                                />
                            </div>
                            <div>
                                <label className="premium-label">{t("Email", language)} <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    autoComplete="email"
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="premium-input placeholder:text-slate-400"
                                    placeholder="E.g., student@domain.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="premium-label">{t("Mobile", language)} <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={formData.mobileNumber}
                                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                                    className="premium-input placeholder:text-slate-400"
                                    placeholder="+91 XXXXX XXXXX"
                                    required
                                />
                            </div>
                            <div>
                                <label className="premium-label">{t("State", language)} <span className="text-red-500">*</span></label>
                                <select
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    className="premium-input"
                                    required
                                >
                                    <option value="" disabled>Select State</option>
                                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                    <option value="Assam">Assam</option>
                                    <option value="Bihar">Bihar</option>
                                    <option value="Chhattisgarh">Chhattisgarh</option>
                                    <option value="Goa">Goa</option>
                                    <option value="Gujarat">Gujarat</option>
                                    <option value="Haryana">Haryana</option>
                                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                                    <option value="Jharkhand">Jharkhand</option>
                                    <option value="Karnataka">Karnataka</option>
                                    <option value="Kerala">Kerala</option>
                                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                                    <option value="Maharashtra">Maharashtra</option>
                                    <option value="Manipur">Manipur</option>
                                    <option value="Meghalaya">Meghalaya</option>
                                    <option value="Mizoram">Mizoram</option>
                                    <option value="Nagaland">Nagaland</option>
                                    <option value="Odisha">Odisha</option>
                                    <option value="Punjab">Punjab</option>
                                    <option value="Rajasthan">Rajasthan</option>
                                    <option value="Sikkim">Sikkim</option>
                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                    <option value="Telangana">Telangana</option>
                                    <option value="Tripura">Tripura</option>
                                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                                    <option value="Uttarakhand">Uttarakhand</option>
                                    <option value="West Bengal">West Bengal</option>
                                    <option value="Delhi">Delhi (NCT)</option>
                                    <option value="Jammu and Kashmir">Jammu & Kashmir</option>
                                    <option value="Ladakh">Ladakh</option>
                                    <option value="Chandigarh">Chandigarh</option>
                                    <option value="Puducherry">Puducherry</option>
                                    <option value="Andaman and Nicobar Islands">Andaman & Nicobar Islands</option>
                                    <option value="Lakshadweep">Lakshadweep</option>
                                    <option value="Dadra and Nagar Haveli">Dadra & Nagar Haveli</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="premium-label">{t("Password", language)} <span className="text-red-500">*</span></label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="premium-input placeholder:text-slate-400"
                                placeholder="Create a strong password"
                                required
                            />
                            <p className="text-xs text-slate-400 mt-2">Passwords must be at least 8 characters securely hashed.</p>
                        </div>

                        <button type="submit" disabled={loading} className="w-full premium-button-primary mt-8 py-3.5 text-base shadow-xl">
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                "Register Profile"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 border-t border-slate-100 pt-6 text-center text-sm font-medium text-slate-500">
                        Already part of our portal?{" "}
                        <Link href="/login" className="text-primary-600 hover:text-primary-800 transition-colors font-bold underline decoration-primary-300 underline-offset-4">
                            {t("Login", language)}
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
