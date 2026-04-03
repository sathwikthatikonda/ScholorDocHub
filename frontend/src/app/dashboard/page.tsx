"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useStore } from "@/store/useStore";
import { t } from "@/lib/i18n";
import { Calendar, Building2, ExternalLink, Bookmark, Search, GraduationCap, MapPin, ChevronRight, LayoutDashboard, Settings, CheckCircle2, ShieldCheck, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
    const { user, token, language } = useStore();
    const router = useRouter();
    const [scholarships, setScholarships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"recommended" | "discovered" | "applied" | "profile">("recommended");

    useEffect(() => {
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchScholarships = async () => {
            setLoading(true);
            try {
                let query = "";

                if (activeTab === "applied") {
                    const appliedIds = user?.appliedScholarships || [];
                    if (appliedIds.length === 0) {
                        setScholarships([]);
                        setLoading(false);
                        return;
                    }
                    query = `?ids=${appliedIds.join(",")}`;
                } else if (activeTab === "discovered") {
                    query = `?all=true`;
                } else {
                    const profile = user?.profile;
                    if (profile) {
                        const params = new URLSearchParams();
                        if (profile.educationLevel) params.append("educationLevel", profile.educationLevel);
                        if (profile.category) params.append("category", profile.category);
                        if (profile.annualFamilyIncome) params.append("incomeLimit", profile.annualFamilyIncome);
                        if (profile.stateOfResidence) params.append("state", profile.stateOfResidence);
                        if (profile.marksPercentage) params.append("marksPercentage", profile.marksPercentage);
                        if (profile.gender) params.append("gender", profile.gender);
                        if (profile.minorityStatus !== undefined) params.append("minorityStatus", String(profile.minorityStatus));
                        if (profile.disabilityStatus !== undefined) params.append("disabilityStatus", String(profile.disabilityStatus));
                        query = `?${params.toString()}`;
                    }
                }

                const res = await api.get(`/scholarships${query}`);
                setScholarships(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchScholarships();
    }, [token, user, router, activeTab]);


    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-120px)] w-full max-w-[1400px] mx-auto">

            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 shrink-0 p-6 md:border-r border-slate-200 sticky top-20 h-fit hidden md:block">
                <div className="mb-8">
                    <h3 className="font-bold text-slate-900 text-lg mb-1 uppercase tracking-tight">{user?.name}</h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary-50 text-primary-700 uppercase tracking-widest border border-primary-200">{t("VerifiedKYC", language)}</span>
                </div>
                <nav className="space-y-2">
                    <button
                        onClick={() => setActiveTab("recommended")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${activeTab === 'recommended'
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                            : 'text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        <Search className="w-5 h-5" /> {t("Recommended", language)}
                    </button>
                    <button
                        onClick={() => setActiveTab("discovered")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${activeTab === 'discovered'
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                            : 'text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        <GraduationCap className="w-5 h-5" /> Discover All
                    </button>
                    <button
                        onClick={() => setActiveTab("applied")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${activeTab === 'applied'
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                            : 'text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        <CheckCircle2 className="w-5 h-5" /> {t("AppliedScholarships", language)}
                    </button>
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${activeTab === 'profile'
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                            : 'text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        <User className="w-5 h-5" /> My Profile
                    </button>
                    <Link href="/questionnaire" className="flex items-center gap-3 text-slate-600 hover:bg-slate-100 px-4 py-3 rounded-xl font-bold transition-all text-sm">
                        <Settings className="w-5 h-5" /> {t("UpdateProfile", language)}
                    </Link>
                </nav>


            </aside>

            {/* Main Content Area */}
            <div className="flex-1 p-6 lg:p-10 w-full min-w-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-200 pb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
                            {activeTab === 'recommended'
                                ? "Recommended For You"
                                : activeTab === 'discovered'
                                    ? "All Scholarships"
                                    : activeTab === 'applied'
                                        ? t("AppliedScholarships", language)
                                        : "My Profile Verification"
                            }
                        </h1>
                        {activeTab === 'recommended' && (
                            <div className="flex items-center gap-2 mb-4">
                                <span className="p-1 bg-green-100 rounded-full"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /></span>
                                <span className="text-xs font-bold text-green-700 uppercase tracking-widest">Official NSP Connectivity Active</span>
                            </div>
                        )}
                        <p className="text-slate-500 font-medium text-sm leading-relaxed">
                            {activeTab === 'recommended'
                                ? ""
                                : activeTab === 'applied'
                                    ? "A consolidated list of all scholarship programs you have actively marked as applied. Track your application history here."
                                    : "Review your verified eligibility profile used by the National Matching Engine to find scholarships."
                            }
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {activeTab === 'recommended' && (
                            <div className="hidden lg:flex flex-col items-end mr-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Verified by</span>
                                <span className="text-xs font-black text-primary-900">National Portal Services</span>
                            </div>
                        )}
                    </div>
                </div>

                {activeTab === 'recommended' && (
                    <div className="bg-primary-900 rounded-3xl p-6 mb-10 text-white relative overflow-hidden shadow-2xl border border-primary-800">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                                    <ShieldCheck className="w-8 h-8 text-accent-gold-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tight mb-1">National Scholarship Discovery Hub</h3>
                                    <p className="text-primary-200 text-sm font-medium">Your profile is synchronized with federal and state scholarship gateways.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-primary-950/50 p-3 rounded-2xl border border-primary-800">
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">Server Status</p>
                                    <p className="text-xs font-black text-green-400">ENCRYPTED & SYNCED</p>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'profile' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Personal Identity</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">Full Name</p>
                                    <p className="text-lg font-black text-slate-900">{user?.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">Email Account</p>
                                    <p className="text-sm font-bold text-slate-700">{user?.email}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Location & Logistics</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">State of Residence</p>
                                    <p className="text-sm font-black text-slate-900">{user?.profile?.stateOfResidence || "Not Specified"}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">Education Level</p>
                                    <p className="text-sm font-black text-slate-900">{user?.profile?.educationLevel === "PhD" ? "Other" : (user?.profile?.educationLevel || "Not Specified")}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Verified Financials</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">Annual Family Income</p>
                                    <p className="text-lg font-black text-primary-700">₹{user?.profile?.annualFamilyIncome?.toLocaleString() || "0"}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">Marks Percentage</p>
                                    <p className="text-sm font-black text-slate-900">{user?.profile?.marksPercentage || "0"}%</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Social Categories</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">Reservation Category</p>
                                    <p className="text-sm font-black text-slate-900">{user?.profile?.category || "General"}</p>
                                </div>
                                <div className="flex gap-4">
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">Minority Status</p>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${user?.profile?.minorityStatus ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                                            {user?.profile?.minorityStatus ? 'YES' : 'NO'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">PwD Status</p>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${user?.profile?.disabilityStatus ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                                            {user?.profile?.disabilityStatus ? 'YES' : 'NO'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>


                    </div>
                ) : loading ? (
                    <div className="flex justify-center flex-col items-center py-24 gap-6">
                        <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
                        <span className="text-slate-500 font-bold animate-pulse text-sm uppercase tracking-widest">{t("MatchingEngine", language)}</span>
                    </div>
                ) : scholarships.length === 0 ? (
                    <div className="glass-panel p-16 text-center rounded-3xl flex flex-col items-center bg-white shadow-2xl max-w-2xl mx-auto my-10 border-slate-100">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 border border-slate-100 shadow-inner">
                            <CheckCircle2 className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-3">
                            {activeTab === 'applied' ? "No Applications Found" : t("NoMatchesTitle", language)}
                        </h3>
                        <p className="text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
                            {activeTab === 'applied'
                                ? "You haven't marked any scholarships as applied yet. Use the 'Mark as Applied' button on scholarship details to track them here."
                                : t("NoMatchesDesc", language)}
                        </p>
                        <button
                            onClick={() => setActiveTab("recommended")}
                            className="premium-button-primary mt-10 px-8"
                        >
                            {activeTab === 'applied' ? "Browse Scholarships" : t("ReturnProfile", language)}
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20">
                        <AnimatePresence>
                            {scholarships.map((sch, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={sch._id}
                                    onClick={() => router.push(`/scholarships/${sch._id}`)}
                                    className="premium-card flex flex-col group cursor-pointer relative overflow-hidden"
                                >
                                    {/* Banner border on top */}
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 to-accent-teal-400"></div>

                                    <div className="p-6 md:p-8 flex-1 flex flex-col pt-8">
                                        <div className="flex justify-between items-start gap-4 mb-4">
                                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-primary-700 transition-colors line-clamp-2 leading-snug">
                                                {sch.name}
                                            </h3>
                                            <div className="shrink-0 p-2 bg-slate-50 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity bg-primary-50 group-hover:text-primary-600">
                                                <ExternalLink className="w-5 h-5 -rotate-45" />
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm font-semibold text-slate-600 mb-5 pb-5 border-b border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-primary-500 shrink-0" />
                                                <span className="truncate max-w-[150px]">{sch.provider}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="w-4 h-4 text-accent-gold-500 shrink-0" />
                                                <span>{sch.educationLevel?.join(", ") || "All"}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                                <span>{sch.state || "All India"}</span>
                                            </div>
                                        </div>

                                        <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                                            {sch.description}
                                        </p>

                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-auto gap-4 pt-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">{t("Deadline", language)}</span>
                                                <div className="flex items-center gap-2 text-accent-gold-600 text-sm font-bold bg-amber-50 px-3 py-1.5 rounded-md border border-amber-100">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(sch.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                                </div>
                                            </div>
                                            <button className="text-primary-600 group-hover:bg-primary-600 group-hover:text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors w-full sm:w-auto justify-center bg-primary-50 border border-transparent shadow-sm">
                                                {t("ViewRequirements", language)} <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
